-- ============================================================================
-- Migration: Cartography Module + Activity Journal RLS
-- DRNOFLU - Direction des Recettes Non Fiscales du Lualaba
-- ============================================================================

-- ============================================================================
-- 1. JOURNAL_ACTIVITES RLS POLICIES
-- ============================================================================

-- Enable RLS on journal_activites if not already enabled
ALTER TABLE journal_activites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Journal visible par admins" ON journal_activites;
DROP POLICY IF EXISTS "Journal insertable par tous authentifiés" ON journal_activites;
DROP POLICY IF EXISTS "Anyone can insert activity logs" ON journal_activites;

-- Policy: Anyone authenticated can insert activity logs
CREATE POLICY "Anyone can insert activity logs" ON journal_activites
    FOR INSERT WITH CHECK (TRUE);

-- Policy: Only admins/editors can view activity logs
CREATE POLICY "Journal visible par admins" ON journal_activites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

-- ============================================================================
-- 2. CARTOGRAPHY ICONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartographie_icones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    categorie VARCHAR(50) NOT NULL CHECK (
        categorie IN ('territoire', 'projet', 'mine', 'recette', 'infrastructure', 'autre')
    ),
    couleur VARCHAR(20) DEFAULT '#1e3a8a',
    svg_path TEXT,
    lucide_icon VARCHAR(100),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default icons
INSERT INTO cartographie_icones (nom, label, categorie, couleur, lucide_icon) VALUES
    ('building', 'Bâtiment', 'infrastructure', '#1e3a8a', 'Building2'),
    ('coins', 'Point de Recette', 'recette', '#16a34a', 'Coins'),
    ('hard_hat', 'Projet en cours', 'projet', '#f59e0b', 'HardHat'),
    ('pickaxe', 'Zone Minière', 'mine', '#dc2626', 'Pickaxe'),
    ('map_pin', 'Localisation', 'territoire', '#6366f1', 'MapPin'),
    ('map', 'Territoire', 'territoire', '#059669', 'Map'),
    ('users', 'Chefferie', 'territoire', '#8b5cf6', 'Users'),
    ('home', 'Secteur', 'territoire', '#ec4899', 'Home'),
    ('building_2', 'Ville', 'territoire', '#0ea5e9', 'Building'),
    ('factory', 'Usine', 'infrastructure', '#78716c', 'Factory'),
    ('truck', 'Transport', 'infrastructure', '#84cc16', 'Truck'),
    ('droplet', 'Eau', 'infrastructure', '#06b6d4', 'Droplet'),
    ('zap', 'Électricité', 'infrastructure', '#eab308', 'Zap'),
    ('school', 'École', 'infrastructure', '#f97316', 'GraduationCap'),
    ('hospital', 'Hôpital', 'infrastructure', '#ef4444', 'Hospital'),
    ('road', 'Route', 'infrastructure', '#6b7280', 'Route'),
    ('bridge', 'Pont', 'infrastructure', '#a855f7', 'Construction'),
    ('market', 'Marché', 'infrastructure', '#10b981', 'Store'),
    ('diamond', 'Diamant', 'mine', '#60a5fa', 'Diamond'),
    ('gem', 'Or', 'mine', '#fbbf24', 'Gem'),
    ('copper', 'Cuivre', 'mine', '#f97316', 'CircleDot'),
    ('cobalt', 'Cobalt', 'mine', '#3b82f6', 'Hexagon')
ON CONFLICT (nom) DO NOTHING;

-- ============================================================================
-- 3. TERRITORIES TABLE (Territoires, Villes, Chefferies, Secteurs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartographie_territoires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (
        type IN ('province', 'ville', 'territoire', 'chefferie', 'secteur', 'groupement', 'localite')
    ),
    code VARCHAR(50),
    parent_id UUID REFERENCES cartographie_territoires(id) ON DELETE SET NULL,
    
    -- Geographic data
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    altitude DECIMAL(8, 2),
    precision_gps DECIMAL(6, 2),
    polygone_geojson JSONB,
    superficie_km2 DECIMAL(12, 2),
    
    -- Demographics
    population INTEGER,
    annee_population INTEGER,
    densite_population DECIMAL(10, 2),
    
    -- Administrative
    chef_lieu VARCHAR(255),
    administrateur VARCHAR(255),
    contact_telephone VARCHAR(50),
    contact_email VARCHAR(255),
    
    -- Icon and display
    icone_id UUID REFERENCES cartographie_icones(id),
    couleur VARCHAR(20) DEFAULT '#1e3a8a',
    
    -- Description
    description TEXT,
    particularites TEXT,
    ressources_principales TEXT[],
    
    -- Status
    actif BOOLEAN DEFAULT TRUE,
    ordre INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_territoires_type ON cartographie_territoires(type);
CREATE INDEX idx_territoires_parent ON cartographie_territoires(parent_id);
CREATE INDEX idx_territoires_coords ON cartographie_territoires(latitude, longitude);

-- Add column comments
COMMENT ON COLUMN cartographie_territoires.precision_gps IS 'Précision GPS en mètres';
COMMENT ON COLUMN cartographie_territoires.polygone_geojson IS 'GeoJSON polygon for territory boundaries';

-- ============================================================================
-- 4. PROJECTS TABLE (Projets)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartographie_projets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    territoire_id UUID REFERENCES cartographie_territoires(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    altitude DECIMAL(8, 2),
    precision_gps DECIMAL(6, 2),
    adresse VARCHAR(500),
    
    -- Project details
    type_projet VARCHAR(100) NOT NULL CHECK (
        type_projet IN ('infrastructure', 'education', 'sante', 'eau', 'electricite', 'route', 'pont', 'marche', 'agriculture', 'environnement', 'social', 'autre')
    ),
    secteur VARCHAR(100),
    
    -- Dates
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    annee INTEGER NOT NULL,
    
    -- Status
    statut VARCHAR(50) NOT NULL DEFAULT 'planifie' CHECK (
        statut IN ('propose', 'planifie', 'en_cours', 'suspendu', 'termine', 'annule')
    ),
    pourcentage_avancement INTEGER DEFAULT 0 CHECK (pourcentage_avancement >= 0 AND pourcentage_avancement <= 100),
    
    -- Financials
    cout_estime_usd DECIMAL(15, 2),
    cout_reel_usd DECIMAL(15, 2),
    source_financement VARCHAR(255),
    
    -- Beneficiaries
    beneficiaires_prevus INTEGER,
    beneficiaires_reels INTEGER,
    
    -- Contractor
    maitre_ouvrage VARCHAR(255),
    entrepreneur VARCHAR(255),
    
    -- Icon and display
    icone_id UUID REFERENCES cartographie_icones(id),
    couleur VARCHAR(20) DEFAULT '#f59e0b',
    images TEXT[],
    
    -- Additional details
    details JSONB DEFAULT '{}',
    
    -- Status
    publie BOOLEAN DEFAULT FALSE,
    propose_par VARCHAR(255),
    valide_par UUID REFERENCES profiles(id),
    date_validation TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projets_territoire ON cartographie_projets(territoire_id);
CREATE INDEX idx_projets_statut ON cartographie_projets(statut);
CREATE INDEX idx_projets_annee ON cartographie_projets(annee);
CREATE INDEX idx_projets_coords ON cartographie_projets(latitude, longitude);
CREATE INDEX idx_projets_type ON cartographie_projets(type_projet);

-- ============================================================================
-- 5. MINING ZONES TABLE (Zones Minières)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartographie_zones_minieres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    territoire_id UUID REFERENCES cartographie_territoires(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    altitude DECIMAL(8, 2),
    precision_gps DECIMAL(6, 2),
    polygone_geojson JSONB,
    superficie_km2 DECIMAL(12, 2),
    
    -- Mine details
    type_exploitation VARCHAR(50) NOT NULL CHECK (
        type_exploitation IN ('industrielle', 'artisanale', 'semi_industrielle', 'carriere')
    ),
    minerais TEXT[] NOT NULL,
    operateur VARCHAR(255),
    permis_numero VARCHAR(100),
    permis_date_debut DATE,
    permis_date_fin DATE,
    
    -- Production
    production_annuelle_tonnes DECIMAL(15, 2),
    annee_production INTEGER,
    
    -- Employment
    employes_directs INTEGER,
    employes_indirects INTEGER,
    
    -- Revenue
    redevances_annuelles_usd DECIMAL(15, 2),
    annee_redevances INTEGER,
    
    -- Icon and display
    icone_id UUID REFERENCES cartographie_icones(id),
    couleur VARCHAR(20) DEFAULT '#dc2626',
    images TEXT[],
    
    -- Additional details
    details JSONB DEFAULT '{}',
    
    -- Status
    actif BOOLEAN DEFAULT TRUE,
    publie BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_zones_minieres_territoire ON cartographie_zones_minieres(territoire_id);
CREATE INDEX idx_zones_minieres_type ON cartographie_zones_minieres(type_exploitation);
CREATE INDEX idx_zones_minieres_coords ON cartographie_zones_minieres(latitude, longitude);
CREATE INDEX idx_zones_minieres_minerais ON cartographie_zones_minieres USING GIN(minerais);

-- Add column comments
COMMENT ON COLUMN cartographie_zones_minieres.polygone_geojson IS 'GeoJSON polygon for mine boundaries';

-- ============================================================================
-- 6. REVENUE POINTS TABLE (Points de Recettes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartographie_points_recettes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    territoire_id UUID REFERENCES cartographie_territoires(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    altitude DECIMAL(8, 2),
    precision_gps DECIMAL(6, 2),
    adresse VARCHAR(500),
    
    -- Office details
    type_bureau VARCHAR(50) NOT NULL DEFAULT 'perception' CHECK (
        type_bureau IN ('siege', 'perception', 'antenne', 'guichet', 'mobile')
    ),
    responsable VARCHAR(255),
    telephone VARCHAR(50),
    email VARCHAR(255),
    horaires VARCHAR(255),
    
    -- Services
    services_offerts TEXT[],
    
    -- Revenue data
    recettes_2024_usd DECIMAL(15, 2),
    recettes_2025_usd DECIMAL(15, 2),
    objectif_annuel_usd DECIMAL(15, 2),
    
    -- Icon and display
    icone_id UUID REFERENCES cartographie_icones(id),
    couleur VARCHAR(20) DEFAULT '#16a34a',
    images TEXT[],
    
    -- Additional details
    details JSONB DEFAULT '{}',
    
    -- Status
    actif BOOLEAN DEFAULT TRUE,
    publie BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_points_recettes_territoire ON cartographie_points_recettes(territoire_id);
CREATE INDEX idx_points_recettes_type ON cartographie_points_recettes(type_bureau);
CREATE INDEX idx_points_recettes_coords ON cartographie_points_recettes(latitude, longitude);

-- ============================================================================
-- 7. INFRASTRUCTURE TABLE (Infrastructures diverses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartographie_infrastructures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    territoire_id UUID REFERENCES cartographie_territoires(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    altitude DECIMAL(8, 2),
    precision_gps DECIMAL(6, 2),
    adresse VARCHAR(500),
    
    -- Details
    type_infrastructure VARCHAR(100) NOT NULL CHECK (
        type_infrastructure IN ('ecole', 'hopital', 'centre_sante', 'marche', 'eau', 'electricite', 'route', 'pont', 'batiment_public', 'autre')
    ),
    gestionnaire VARCHAR(255),
    capacite VARCHAR(255),
    annee_construction INTEGER,
    
    -- Link to project if built via project
    projet_id UUID REFERENCES cartographie_projets(id) ON DELETE SET NULL,
    
    -- Icon and display
    icone_id UUID REFERENCES cartographie_icones(id),
    couleur VARCHAR(20) DEFAULT '#6366f1',
    images TEXT[],
    
    -- Additional details
    details JSONB DEFAULT '{}',
    
    -- Status
    actif BOOLEAN DEFAULT TRUE,
    publie BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_infrastructures_territoire ON cartographie_infrastructures(territoire_id);
CREATE INDEX idx_infrastructures_type ON cartographie_infrastructures(type_infrastructure);
CREATE INDEX idx_infrastructures_coords ON cartographie_infrastructures(latitude, longitude);

-- ============================================================================
-- 8. RLS POLICIES FOR CARTOGRAPHY TABLES
-- ============================================================================

-- Enable RLS
ALTER TABLE cartographie_icones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartographie_territoires ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartographie_projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartographie_zones_minieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartographie_points_recettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartographie_infrastructures ENABLE ROW LEVEL SECURITY;

-- Icones: Public read, admin write
CREATE POLICY "Icons viewable by everyone" ON cartographie_icones
    FOR SELECT USING (actif = TRUE);
CREATE POLICY "Admins can manage icons" ON cartographie_icones
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Territoires: Public read, admin/editor write
CREATE POLICY "Territories viewable by everyone" ON cartographie_territoires
    FOR SELECT USING (actif = TRUE);
CREATE POLICY "Admins/editors can manage territories" ON cartographie_territoires
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );

-- Projets: Published public read, admin/editor write
CREATE POLICY "Published projects viewable by everyone" ON cartographie_projets
    FOR SELECT USING (publie = TRUE);
CREATE POLICY "All projects viewable by admins/editors" ON cartographie_projets
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );
CREATE POLICY "Admins/editors can manage projects" ON cartographie_projets
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );

-- Zones minières: Published public read, admin/editor write
CREATE POLICY "Published mines viewable by everyone" ON cartographie_zones_minieres
    FOR SELECT USING (publie = TRUE);
CREATE POLICY "All mines viewable by admins/editors" ON cartographie_zones_minieres
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );
CREATE POLICY "Admins/editors can manage mines" ON cartographie_zones_minieres
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );

-- Points de recettes: Published public read, admin/editor write
CREATE POLICY "Published revenue points viewable by everyone" ON cartographie_points_recettes
    FOR SELECT USING (publie = TRUE);
CREATE POLICY "All revenue points viewable by admins/editors" ON cartographie_points_recettes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );
CREATE POLICY "Admins/editors can manage revenue points" ON cartographie_points_recettes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );

-- Infrastructures: Published public read, admin/editor write
CREATE POLICY "Published infrastructures viewable by everyone" ON cartographie_infrastructures
    FOR SELECT USING (publie = TRUE);
CREATE POLICY "All infrastructures viewable by admins/editors" ON cartographie_infrastructures
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );
CREATE POLICY "Admins/editors can manage infrastructures" ON cartographie_infrastructures
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editeur'))
    );

-- ============================================================================
-- 9. TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create the update_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cartographie_icones_updated_at ON cartographie_icones;
CREATE TRIGGER update_cartographie_icones_updated_at
    BEFORE UPDATE ON cartographie_icones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cartographie_territoires_updated_at ON cartographie_territoires;
CREATE TRIGGER update_cartographie_territoires_updated_at
    BEFORE UPDATE ON cartographie_territoires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cartographie_projets_updated_at ON cartographie_projets;
CREATE TRIGGER update_cartographie_projets_updated_at
    BEFORE UPDATE ON cartographie_projets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cartographie_zones_minieres_updated_at ON cartographie_zones_minieres;
CREATE TRIGGER update_cartographie_zones_minieres_updated_at
    BEFORE UPDATE ON cartographie_zones_minieres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cartographie_points_recettes_updated_at ON cartographie_points_recettes;
CREATE TRIGGER update_cartographie_points_recettes_updated_at
    BEFORE UPDATE ON cartographie_points_recettes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cartographie_infrastructures_updated_at ON cartographie_infrastructures;
CREATE TRIGGER update_cartographie_infrastructures_updated_at
    BEFORE UPDATE ON cartographie_infrastructures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 10. SAMPLE DATA FOR TERRITORIES (Lualaba Province Structure)
-- ============================================================================

-- Insert Lualaba Province
INSERT INTO cartographie_territoires (nom, type, code, latitude, longitude, population, annee_population, superficie_km2, description, actif) VALUES
('Lualaba', 'province', 'LUA', -10.7167, 25.4667, 2100000, 2024, 121308, 'Province du Lualaba, riche en ressources minières', TRUE)
ON CONFLICT DO NOTHING;

-- Get the province ID for parent reference
DO $$
DECLARE
    province_id UUID;
BEGIN
    SELECT id INTO province_id FROM cartographie_territoires WHERE code = 'LUA' LIMIT 1;
    
    -- Insert Cities
    INSERT INTO cartographie_territoires (nom, type, code, parent_id, latitude, longitude, population, annee_population, superficie_km2, description, actif) VALUES
    ('Kolwezi', 'ville', 'KOL', province_id, -10.7167, 25.4667, 850000, 2024, 213, 'Chef-lieu de la province du Lualaba, principal centre minier', TRUE),
    ('Likasi', 'ville', 'LIK', province_id, -10.9833, 26.7333, 520000, 2024, 316, 'Ville industrielle et minière', TRUE)
    ON CONFLICT DO NOTHING;
    
    -- Insert Territories
    INSERT INTO cartographie_territoires (nom, type, code, parent_id, latitude, longitude, population, annee_population, superficie_km2, description, actif) VALUES
    ('Dilolo', 'territoire', 'DIL', province_id, -10.68, 22.35, 320000, 2024, 16700, 'Territoire frontalier avec l''Angola', TRUE),
    ('Kapanga', 'territoire', 'KAP', province_id, -8.35, 22.6, 180000, 2024, 27800, 'Territoire rural du nord de la province', TRUE),
    ('Sandoa', 'territoire', 'SAN', province_id, -9.7, 22.95, 250000, 2024, 31400, 'Territoire central de la province', TRUE),
    ('Lubudi', 'territoire', 'LUB', province_id, -9.88, 25.85, 290000, 2024, 22500, 'Territoire forestier et minier', TRUE),
    ('Mutshatsha', 'territoire', 'MUT', province_id, -10.35, 25.47, 180000, 2024, 16200, 'Territoire proche de Kolwezi', TRUE),
    ('Fungurume', 'territoire', 'FUN', province_id, -10.57, 26.31, 220000, 2024, 8500, 'Important centre minier industriel', TRUE)
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- 11. SAMPLE DATA FOR PROJECTS
-- ============================================================================

DO $$
DECLARE
    kolwezi_id UUID;
    dilolo_id UUID;
    sandoa_id UUID;
    lubudi_id UUID;
    fungurume_id UUID;
BEGIN
    SELECT id INTO kolwezi_id FROM cartographie_territoires WHERE code = 'KOL' LIMIT 1;
    SELECT id INTO dilolo_id FROM cartographie_territoires WHERE code = 'DIL' LIMIT 1;
    SELECT id INTO sandoa_id FROM cartographie_territoires WHERE code = 'SAN' LIMIT 1;
    SELECT id INTO lubudi_id FROM cartographie_territoires WHERE code = 'LUB' LIMIT 1;
    SELECT id INTO fungurume_id FROM cartographie_territoires WHERE code = 'FUN' LIMIT 1;

    INSERT INTO cartographie_projets (nom, description, territoire_id, latitude, longitude, type_projet, date_debut, date_fin_prevue, annee, statut, pourcentage_avancement, cout_estime_usd, source_financement, beneficiaires_prevus, publie) VALUES
    ('Route Kolwezi-Likasi', 'Infrastructure routière financée par les recettes - 45 km', kolwezi_id, -10.6, 25.55, 'route', '2025-01-15', '2026-12-31', 2025, 'en_cours', 35, 2500000, 'Budget Provincial', 150000, TRUE),
    ('École Primaire de Manika', 'Construction de 12 salles de classe', kolwezi_id, -10.74, 25.42, 'education', '2024-06-01', '2025-03-31', 2024, 'termine', 100, 350000, 'Budget Provincial', 1200, TRUE),
    ('Centre de Santé Dilolo', 'Réhabilitation du centre de santé principal', dilolo_id, -10.7, 22.33, 'sante', '2024-03-01', '2024-12-31', 2024, 'termine', 100, 180000, 'Budget Provincial', 45000, TRUE),
    ('Pont sur la rivière Lulua', 'Construction d''un pont de 80m', sandoa_id, -9.65, 22.9, 'pont', '2025-02-01', '2026-06-30', 2025, 'en_cours', 20, 1200000, 'Budget Provincial', 80000, TRUE),
    ('Marché Central Lubudi', 'Construction du marché couvert', lubudi_id, -9.9, 25.8, 'marche', '2025-01-01', '2025-10-31', 2025, 'en_cours', 45, 420000, 'Budget Provincial', 35000, TRUE),
    ('Adduction d''eau Fungurume', 'Réseau d''eau potable pour 15 000 habitants', fungurume_id, -10.52, 26.28, 'eau', '2024-01-15', '2024-11-30', 2024, 'termine', 100, 890000, 'Budget Provincial', 15000, TRUE)
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- 12. SAMPLE DATA FOR MINING ZONES
-- ============================================================================

DO $$
DECLARE
    kolwezi_id UUID;
    fungurume_id UUID;
    dilolo_id UUID;
    lubudi_id UUID;
    kapanga_id UUID;
BEGIN
    SELECT id INTO kolwezi_id FROM cartographie_territoires WHERE code = 'KOL' LIMIT 1;
    SELECT id INTO fungurume_id FROM cartographie_territoires WHERE code = 'FUN' LIMIT 1;
    SELECT id INTO dilolo_id FROM cartographie_territoires WHERE code = 'DIL' LIMIT 1;
    SELECT id INTO lubudi_id FROM cartographie_territoires WHERE code = 'LUB' LIMIT 1;
    SELECT id INTO kapanga_id FROM cartographie_territoires WHERE code = 'KAP' LIMIT 1;

    INSERT INTO cartographie_zones_minieres (nom, description, territoire_id, latitude, longitude, type_exploitation, minerais, operateur, production_annuelle_tonnes, annee_production, employes_directs, redevances_annuelles_usd, annee_redevances, publie) VALUES
    ('Zone Minière Tenke-Fungurume', 'Cuivre et Cobalt - Production majeure', fungurume_id, -10.6167, 26.1333, 'industrielle', ARRAY['Cuivre', 'Cobalt'], 'CMOC', 250000, 2024, 8000, 45000000, 2024, TRUE),
    ('Zone Minière Kamoto', 'Exploitation cuivre-cobalt Glencore', kolwezi_id, -10.7, 25.4, 'industrielle', ARRAY['Cuivre', 'Cobalt'], 'Glencore', 180000, 2024, 6500, 38000000, 2024, TRUE),
    ('Zone Minière Mutoshi', 'Exploitation artisanale et industrielle', kolwezi_id, -10.68, 25.35, 'semi_industrielle', ARRAY['Cuivre', 'Cobalt'], 'Chemaf', 45000, 2024, 2500, 12000000, 2024, TRUE),
    ('Carrières Lubudi', 'Extraction de matériaux de construction', lubudi_id, -9.82, 25.9, 'carriere', ARRAY['Pierre', 'Sable'], 'Divers', 25000, 2024, 350, 500000, 2024, TRUE),
    ('Zone Aurifère Dilolo', 'Exploitation artisanale d''or alluvionnaire', dilolo_id, -10.65, 22.4, 'artisanale', ARRAY['Or'], 'Artisanal', NULL, NULL, 1200, 250000, 2024, TRUE),
    ('Zone Diamantifère Kapanga', 'Exploitation artisanale de diamants', kapanga_id, -8.4, 22.5, 'artisanale', ARRAY['Diamant'], 'Artisanal', NULL, NULL, 850, 180000, 2024, TRUE)
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- 13. SAMPLE DATA FOR REVENUE POINTS
-- ============================================================================

DO $$
DECLARE
    kolwezi_id UUID;
    dilolo_id UUID;
    kapanga_id UUID;
    sandoa_id UUID;
    lubudi_id UUID;
    mutshatsha_id UUID;
    fungurume_id UUID;
BEGIN
    SELECT id INTO kolwezi_id FROM cartographie_territoires WHERE code = 'KOL' LIMIT 1;
    SELECT id INTO dilolo_id FROM cartographie_territoires WHERE code = 'DIL' LIMIT 1;
    SELECT id INTO kapanga_id FROM cartographie_territoires WHERE code = 'KAP' LIMIT 1;
    SELECT id INTO sandoa_id FROM cartographie_territoires WHERE code = 'SAN' LIMIT 1;
    SELECT id INTO lubudi_id FROM cartographie_territoires WHERE code = 'LUB' LIMIT 1;
    SELECT id INTO mutshatsha_id FROM cartographie_territoires WHERE code = 'MUT' LIMIT 1;
    SELECT id INTO fungurume_id FROM cartographie_territoires WHERE code = 'FUN' LIMIT 1;

    INSERT INTO cartographie_points_recettes (nom, description, territoire_id, latitude, longitude, type_bureau, responsable, telephone, horaires, services_offerts, recettes_2024_usd, recettes_2025_usd, objectif_annuel_usd, publie) VALUES
    ('Siège DRNOFLU', 'Direction des Recettes Non Fiscales du Lualaba', kolwezi_id, -10.7167, 25.4667, 'siege', 'Directeur Provincial', '+243 976 868 417', 'Lun-Ven: 7h30-15h30', ARRAY['Direction', 'Administration', 'Contrôle'], 0, 0, 0, TRUE),
    ('Point de Recette Kolwezi Centre', 'Bureau de perception principal', kolwezi_id, -10.72, 25.47, 'perception', NULL, NULL, 'Lun-Ven: 7h30-15h30, Sam: 8h-12h', ARRAY['Perception', 'Déclarations', 'Renseignements'], 18500000, 20200000, 22000000, TRUE),
    ('Point de Recette Manika', 'Bureau de perception Manika', kolwezi_id, -10.71, 25.45, 'perception', NULL, NULL, 'Lun-Ven: 7h30-15h30', ARRAY['Perception', 'Déclarations'], 5200000, 5800000, 6000000, TRUE),
    ('Point de Recette Dilala', 'Bureau de perception Dilala', kolwezi_id, -10.73, 25.48, 'perception', NULL, NULL, 'Lun-Ven: 7h30-15h30', ARRAY['Perception', 'Déclarations'], 4800000, 5100000, 5500000, TRUE),
    ('Point de Recette Dilolo', 'Bureau de perception Dilolo', dilolo_id, -10.68, 22.35, 'perception', NULL, NULL, 'Lun-Ven: 8h-15h', ARRAY['Perception', 'Déclarations'], 1200000, 1450000, 1600000, TRUE),
    ('Point de Recette Kapanga', 'Bureau de perception Kapanga', kapanga_id, -8.35, 22.6, 'perception', NULL, NULL, 'Lun-Ven: 8h-15h', ARRAY['Perception', 'Déclarations'], 450000, 520000, 600000, TRUE),
    ('Point de Recette Sandoa', 'Bureau de perception Sandoa', sandoa_id, -9.7, 22.95, 'perception', NULL, NULL, 'Lun-Ven: 8h-15h', ARRAY['Perception', 'Déclarations'], 680000, 750000, 850000, TRUE),
    ('Point de Recette Lubudi', 'Bureau de perception Lubudi', lubudi_id, -9.88, 25.85, 'perception', NULL, NULL, 'Lun-Ven: 8h-15h', ARRAY['Perception', 'Déclarations'], 920000, 1050000, 1200000, TRUE),
    ('Point de Recette Mutshatsha', 'Bureau de perception Mutshatsha', mutshatsha_id, -10.35, 25.47, 'perception', NULL, NULL, 'Lun-Ven: 8h-15h', ARRAY['Perception', 'Déclarations'], 580000, 670000, 750000, TRUE),
    ('Point de Recette Fungurume', 'Bureau de perception Fungurume', fungurume_id, -10.57, 26.31, 'perception', NULL, NULL, 'Lun-Ven: 7h30-15h30', ARRAY['Perception', 'Déclarations'], 3200000, 3650000, 4000000, TRUE)
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
