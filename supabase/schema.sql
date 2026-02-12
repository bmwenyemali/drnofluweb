-- ============================================================================
-- DRNOFLU Database Schema for Supabase
-- Direction des Recettes Non Fiscales du Lualaba
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- User profiles linked to Supabase Auth
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    nom_complet TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'lecteur' CHECK (role IN ('admin', 'editeur', 'lecteur')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR NOT EXISTS (SELECT 1 FROM profiles)
    );

CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nom_complet, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nom_complet', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'lecteur')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ACTUALITES TABLE
-- News and announcements
-- ============================================================================
CREATE TABLE IF NOT EXISTS actualites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    contenu TEXT NOT NULL,
    extrait TEXT NOT NULL,
    image_url TEXT,
    categorie TEXT NOT NULL DEFAULT 'general' CHECK (
        categorie IN ('communique', 'rapport', 'evenement', 'annonce', 'general')
    ),
    auteur_id UUID REFERENCES profiles(id),
    publie BOOLEAN DEFAULT FALSE,
    date_publication TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Published actualites are viewable by everyone" ON actualites
    FOR SELECT USING (publie = TRUE);

CREATE POLICY "All actualites viewable by admins/editors" ON actualites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

CREATE POLICY "Admins and editors can insert actualites" ON actualites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

CREATE POLICY "Admins and editors can update actualites" ON actualites
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

CREATE POLICY "Admins and editors can delete actualites" ON actualites
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

-- Index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_actualites_slug ON actualites(slug);
CREATE INDEX IF NOT EXISTS idx_actualites_publie ON actualites(publie) WHERE publie = TRUE;

-- ============================================================================
-- DOCUMENTS TABLE
-- Legal documents and forms
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'doc', 'docx', 'xls', 'xlsx')),
    categorie TEXT NOT NULL CHECK (
        categorie IN ('ordonnance', 'arrete', 'decret', 'loi', 'circulaire', 'note', 'formulaire', 'rapport')
    ),
    fichier_url TEXT NOT NULL,
    taille_fichier INTEGER,
    date_publication TIMESTAMPTZ DEFAULT NOW(),
    annee INTEGER NOT NULL,
    publie BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Published documents are viewable by everyone" ON documents
    FOR SELECT USING (publie = TRUE);

CREATE POLICY "All documents viewable by admins/editors" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

CREATE POLICY "Admins and editors can manage documents" ON documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

-- Index
CREATE INDEX IF NOT EXISTS idx_documents_categorie ON documents(categorie);
CREATE INDEX IF NOT EXISTS idx_documents_annee ON documents(annee);

-- ============================================================================
-- CONTACT_MESSAGES TABLE
-- Contact form submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    sujet TEXT NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    traite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit a message" ON contact_messages
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins/editors can view messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

CREATE POLICY "Only admins/editors can update messages" ON contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

CREATE POLICY "Only admins can delete messages" ON contact_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- STATISTIQUES_RECETTES TABLE
-- Revenue statistics
-- ============================================================================
CREATE TABLE IF NOT EXISTS statistiques_recettes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    annee INTEGER NOT NULL,
    mois INTEGER CHECK (mois >= 1 AND mois <= 12),
    type_recette TEXT NOT NULL,
    montant DECIMAL(15, 2) NOT NULL,
    devise TEXT DEFAULT 'USD' CHECK (devise IN ('CDF', 'USD')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE statistiques_recettes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Stats are viewable by authenticated users" ON statistiques_recettes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage stats" ON statistiques_recettes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Index
CREATE INDEX IF NOT EXISTS idx_stats_annee ON statistiques_recettes(annee);

-- ============================================================================
-- PERSONNEL TABLE
-- Staff directory
-- ============================================================================
CREATE TABLE IF NOT EXISTS personnel (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom_complet TEXT NOT NULL,
    titre TEXT NOT NULL,
    fonction TEXT NOT NULL,
    departement TEXT NOT NULL,
    photo_url TEXT,
    email TEXT,
    telephone TEXT,
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Active personnel viewable by everyone" ON personnel
    FOR SELECT USING (actif = TRUE);

CREATE POLICY "All personnel viewable by admins" ON personnel
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage personnel" ON personnel
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- SERVICES TABLE
-- Services offered
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT NOT NULL,
    icone TEXT,
    slug TEXT NOT NULL UNIQUE,
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Active services viewable by everyone" ON services
    FOR SELECT USING (actif = TRUE);

CREATE POLICY "Admins can manage services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- BON_A_SAVOIR TABLE
-- Tips and information
-- ============================================================================
CREATE TABLE IF NOT EXISTS bon_a_savoir (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre TEXT NOT NULL,
    contenu TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'astuce', 'alerte', 'question')),
    actif BOOLEAN DEFAULT TRUE,
    date_debut TIMESTAMPTZ,
    date_fin TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bon_a_savoir ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Active items viewable by everyone" ON bon_a_savoir
    FOR SELECT USING (
        actif = TRUE AND
        (date_debut IS NULL OR date_debut <= NOW()) AND
        (date_fin IS NULL OR date_fin >= NOW())
    );

CREATE POLICY "Admins/editors can manage bon_a_savoir" ON bon_a_savoir
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editeur')
        )
    );

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically update updated_at column
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_actualites_updated_at ON actualites;
CREATE TRIGGER update_actualites_updated_at
    BEFORE UPDATE ON actualites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_personnel_updated_at ON personnel;
CREATE TRIGGER update_personnel_updated_at
    BEFORE UPDATE ON personnel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_bon_a_savoir_updated_at ON bon_a_savoir;
CREATE TRIGGER update_bon_a_savoir_updated_at
    BEFORE UPDATE ON bon_a_savoir
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SEED DATA - Initial admin user (replace with actual values)
-- Note: Create user through Supabase Auth first, then update this ID
-- ============================================================================

-- Insert sample services
INSERT INTO services (nom, description, icone, slug, ordre) VALUES
    ('Secteur Minier', 'Redevances et taxes liées à l''exploitation minière industrielle et artisanale', 'Pickaxe', 'secteur-minier', 1),
    ('Environnement', 'Taxes environnementales et redevances pour la protection de l''écosystème', 'Leaf', 'environnement', 2),
    ('Transport', 'Redevances liées au transport routier, ferroviaire et aérien', 'Truck', 'transport', 3),
    ('Commerce', 'Taxes sur les activités commerciales et les marchés', 'Store', 'commerce', 4),
    ('Foncier', 'Redevances foncières et droits de superficie', 'Building', 'foncier', 5),
    ('Services Administratifs', 'Frais administratifs et droits de chancellerie', 'FileText', 'services-administratifs', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample bon_a_savoir
INSERT INTO bon_a_savoir (titre, contenu, type) VALUES
    ('Délais de paiement', 'Les contribuables doivent s''acquitter de leurs obligations fiscales dans les 30 jours suivant la notification.', 'info'),
    ('Nouveau guichet unique', 'Un guichet unique est disponible pour faciliter vos démarches administratives.', 'astuce'),
    ('Pénalités de retard', 'Tout retard de paiement entraîne des pénalités de 10% par mois de retard.', 'alerte')
ON CONFLICT DO NOTHING;
