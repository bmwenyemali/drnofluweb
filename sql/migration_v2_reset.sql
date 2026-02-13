-- ================================================================
-- MIGRATION V2 RESET - DRNOFLU
-- Script de reset complet pour les nouvelles tables
-- ATTENTION: Exécuter ce script va SUPPRIMER et RECRÉER les tables
-- ================================================================

-- =============================================
-- ÉTAPE 0: SUPPRIMER LES ANCIENNES TABLES ET POLICIES
-- (Ignorer les erreurs si elles n'existent pas)
-- =============================================

-- Supprimer les policies existantes
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Parametres visibles par tous" ON parametres;
  DROP POLICY IF EXISTS "Parametres modifiables par admins" ON parametres;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Bon a savoir publié visible par tous" ON bon_a_savoir;
  DROP POLICY IF EXISTS "Bon a savoir modifiable par admins/editeurs" ON bon_a_savoir;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Journal visible par admins" ON journal_activites;
  DROP POLICY IF EXISTS "Journal insertable par tous authentifiés" ON journal_activites;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Stats visiteurs visibles par admins" ON statistiques_visiteurs;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Simulations insertables par tous" ON simulations;
  DROP POLICY IF EXISTS "Simulations visibles par admins" ON simulations;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Baremes visibles par tous" ON baremes_simulation;
  DROP POLICY IF EXISTS "Baremes modifiables par admins" ON baremes_simulation;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Supprimer les tables existantes
DROP TABLE IF EXISTS baremes_simulation CASCADE;
DROP TABLE IF EXISTS simulations CASCADE;
DROP TABLE IF EXISTS statistiques_visiteurs CASCADE;
DROP TABLE IF EXISTS journal_activites CASCADE;
DROP TABLE IF EXISTS bon_a_savoir CASCADE;
DROP TABLE IF EXISTS parametres CASCADE;


-- =============================================
-- 1. TABLE PARAMETRES (Configurations système)
-- =============================================

CREATE TABLE parametres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cle VARCHAR(100) UNIQUE NOT NULL,
  valeur TEXT NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'string',
  categorie VARCHAR(100) DEFAULT 'general',
  modifiable BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_parametres_cle ON parametres(cle);

-- Paramètres par défaut
INSERT INTO parametres (cle, valeur, description, type, categorie) VALUES
('taux_change_usd_fc', '2850', 'Taux de change USD vers Franc Congolais', 'number', 'finance'),
('devise_principale', 'USD', 'Devise principale pour les calculs', 'string', 'finance'),
('site_maintenance', 'false', 'Mode maintenance du site', 'boolean', 'system'),
('contact_email', 'contact@drnoflu.cd', 'Email de contact principal', 'string', 'contact'),
('contact_telephone', '+243 976 868 417', 'Téléphone de contact principal', 'string', 'contact');


-- =============================================
-- 2. TABLE BON À SAVOIR
-- =============================================

CREATE TABLE bon_a_savoir (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  contenu TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'information',
  icone VARCHAR(50) DEFAULT 'info',
  ordre INTEGER DEFAULT 0,
  publie BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_bon_a_savoir_type ON bon_a_savoir(type);
CREATE INDEX idx_bon_a_savoir_publie ON bon_a_savoir(publie);

-- Données initiales
INSERT INTO bon_a_savoir (titre, contenu, type, icone, ordre, publie) VALUES
('Délais de paiement', 'Les taxes doivent être payées dans les 30 jours suivant la notification. Passé ce délai, des pénalités de 2% par mois de retard seront appliquées.', 'important', 'alert-triangle', 1, true),
('Paiement mobile disponible', 'Vous pouvez désormais payer vos taxes via Orange Money, Airtel Money ou M-Pesa. Composez *123# et suivez les instructions.', 'astuce', 'smartphone', 2, true),
('Documents requis', 'Pour toute déclaration, munissez-vous de votre NIF (Numéro d''Identification Fiscale), une pièce d''identité valide et les justificatifs d''activité.', 'information', 'file-text', 3, true),
('Exonérations possibles', 'Certaines activités peuvent bénéficier d''exonérations. Consultez la section juridique ou contactez nos services pour plus d''informations.', 'astuce', 'percent', 4, true),
('Horaires d''ouverture', 'Nos bureaux sont ouverts du lundi au vendredi de 8h00 à 15h30. Les samedis de 8h00 à 12h00 uniquement pour les dépôts.', 'information', 'clock', 5, true),
('Attestation de paiement', 'Après chaque paiement, une attestation vous sera délivrée. Conservez-la précieusement car elle fait foi en cas de contrôle.', 'important', 'file-check', 6, true),
('Réclamations', 'En cas de désaccord sur le montant de vos taxes, vous disposez de 60 jours pour introduire une réclamation auprès de notre service contentieux.', 'information', 'message-square', 7, true),
('Réductions pour paiement anticipé', 'Un rabais de 5% est accordé pour tout paiement effectué avant le 15 du mois d''échéance.', 'astuce', 'tag', 8, true);


-- =============================================
-- 3. TABLE JOURNAL D'ACTIVITÉS
-- =============================================

CREATE TABLE journal_activites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  user_nom VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entite VARCHAR(100),
  entite_id UUID,
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_user_id ON journal_activites(user_id);
CREATE INDEX idx_journal_action ON journal_activites(action);
CREATE INDEX idx_journal_entite ON journal_activites(entite);
CREATE INDEX idx_journal_created_at ON journal_activites(created_at DESC);


-- =============================================
-- 4. TABLE STATISTIQUES VISITEURS
-- =============================================

CREATE TABLE statistiques_visiteurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  page VARCHAR(255),
  pays VARCHAR(100),
  province_rdc VARCHAR(100),
  ville VARCHAR(100),
  visites INTEGER DEFAULT 1,
  visiteurs_uniques INTEGER DEFAULT 1,
  duree_moyenne_secondes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, page, pays, province_rdc)
);

CREATE INDEX idx_stats_visiteurs_date ON statistiques_visiteurs(date DESC);
CREATE INDEX idx_stats_visiteurs_pays ON statistiques_visiteurs(pays);
CREATE INDEX idx_stats_visiteurs_province ON statistiques_visiteurs(province_rdc);


-- =============================================
-- 5. TABLE SIMULATIONS
-- =============================================

CREATE TABLE simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type_taxe VARCHAR(255) NOT NULL,
  donnees_formulaire JSONB NOT NULL DEFAULT '{}',
  resultat_usd DECIMAL(15, 2) NOT NULL,
  resultat_fc DECIMAL(20, 2) NOT NULL,
  taux_change DECIMAL(15, 4) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_simulations_type ON simulations(type_taxe);
CREATE INDEX idx_simulations_created_at ON simulations(created_at DESC);


-- =============================================
-- 6. BARÈMES DE SIMULATION
-- =============================================

CREATE TABLE baremes_simulation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categorie VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  taux_pourcentage DECIMAL(10, 4) DEFAULT 0,
  montant_fixe DECIMAL(15, 2) DEFAULT 0,
  formule TEXT,
  unite VARCHAR(100),
  ordre INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_baremes_categorie ON baremes_simulation(categorie);

-- Données initiales des barèmes (20 entrées)
INSERT INTO baremes_simulation (categorie, description, montant_fixe, taux_pourcentage, unite, ordre, actif) VALUES
-- Secteur minier
('Secteur Minier', 'Redevance superficiaire minière', 25, 0, 'USD par hectare/an', 1, true),
('Secteur Minier', 'Taxe sur extraction de minerais', 0, 2.5, '% de la valeur', 2, true),
('Secteur Minier', 'Permis d''exploitation minière', 5000, 0, 'USD par permis', 3, true),
('Secteur Minier', 'Carte d''exploitant artisanal', 50, 0, 'USD par carte', 4, true),
-- Secteur commercial
('Secteur Commercial', 'Patente commerciale annuelle', 200, 0, 'USD par établissement', 1, true),
('Secteur Commercial', 'Licence d''importation', 500, 0, 'USD par licence', 2, true),
('Secteur Commercial', 'Licence d''exportation', 350, 0, 'USD par licence', 3, true),
('Secteur Commercial', 'Taxe sur affichage publicitaire', 5, 0, 'USD par m²', 4, true),
-- Transport
('Transport', 'Taxe annuelle sur véhicule', 100, 0, 'USD par véhicule', 1, true),
('Transport', 'Permis de transport en commun', 250, 0, 'USD par véhicule', 2, true),
('Transport', 'Taxe de stationnement commercial', 50, 0, 'USD par mois', 3, true),
-- Foncier
('Foncier', 'Taxe foncière sur terrain', 0.5, 0, 'USD par m²/an', 1, true),
('Foncier', 'Taxe sur bâtiment', 0, 1, '% de la valeur locative', 2, true),
-- Environnement
('Environnement', 'Taxe anti-pollution', 0, 0.5, '% du chiffre d''affaires', 1, true),
('Environnement', 'Autorisation de coupe de bois', 10, 0, 'USD par m³', 2, true),
-- Agriculture
('Agriculture', 'Taxe sur élevage bovin', 5, 0, 'USD par tête', 1, true),
('Agriculture', 'Permis de pêche commerciale', 100, 0, 'USD par an', 2, true),
-- Santé
('Santé', 'Autorisation d''ouverture établissement', 300, 0, 'USD par établissement', 1, true),
('Santé', 'Licence d''exploitation pharmacie', 500, 0, 'USD par an', 2, true);


-- =============================================
-- 7. RLS POLICIES
-- =============================================

-- Parametres
ALTER TABLE parametres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parametres visibles par tous" ON parametres
  FOR SELECT USING (true);

CREATE POLICY "Parametres modifiables par admins" ON parametres
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );

-- Bon à savoir
ALTER TABLE bon_a_savoir ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bon a savoir visible par tous" ON bon_a_savoir
  FOR SELECT USING (true);

CREATE POLICY "Bon a savoir modifiable par admins/editeurs" ON bon_a_savoir
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editeur')
    )
  );

-- Journal
ALTER TABLE journal_activites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Journal visible par admins" ON journal_activites
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );

CREATE POLICY "Journal insertable par tous authentifiés" ON journal_activites
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Statistiques visiteurs
ALTER TABLE statistiques_visiteurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats visiteurs visibles par admins" ON statistiques_visiteurs
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );

-- Simulations
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Simulations insertables par tous" ON simulations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Simulations visibles par admins" ON simulations
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );

-- Baremes
ALTER TABLE baremes_simulation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Baremes visibles par tous" ON baremes_simulation
  FOR SELECT USING (true);

CREATE POLICY "Baremes modifiables par admins" ON baremes_simulation
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );


-- =============================================
-- 8. FONCTION UTILITAIRE
-- =============================================

CREATE OR REPLACE FUNCTION log_activity(
  p_action VARCHAR,
  p_entite VARCHAR DEFAULT NULL,
  p_entite_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_email VARCHAR;
  v_user_nom VARCHAR;
  v_log_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NOT NULL THEN
    SELECT email, raw_user_meta_data->>'nom_complet'
    INTO v_user_email, v_user_nom
    FROM auth.users WHERE id = v_user_id;
  END IF;
  
  INSERT INTO journal_activites (user_id, user_email, user_nom, action, entite, entite_id, details)
  VALUES (v_user_id, v_user_email, v_user_nom, p_action, p_entite, p_entite_id, p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;


-- =============================================
-- VÉRIFICATION
-- =============================================

SELECT 'Migration V2 RESET exécutée avec succès!' as message;

-- Vérifier les données
SELECT 'Tables créées:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('parametres', 'bon_a_savoir', 'journal_activites', 'statistiques_visiteurs', 'simulations', 'baremes_simulation');

SELECT 'Nombre de barèmes:' as info, COUNT(*) as count FROM baremes_simulation;
SELECT 'Nombre de bon à savoir:' as info, COUNT(*) as count FROM bon_a_savoir;
SELECT 'Taux de change:' as info, valeur FROM parametres WHERE cle = 'taux_change_usd_fc';
