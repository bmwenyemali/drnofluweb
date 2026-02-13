-- ============================================================================
-- Migration: Add missing columns to existing tables
-- DRNOFLU Database Migration
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to "SQL Editor" in the left menu
-- 4. Create a new query
-- 5. Paste ALL of this SQL code
-- 6. Click "Run" to execute
-- 7. You should see "Success. No rows returned" or similar
--
-- This script is safe to run multiple times - it checks before adding columns
-- ============================================================================

-- Start transaction
BEGIN;

-- Add bio and telephone to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'telephone') THEN
        ALTER TABLE profiles ADD COLUMN telephone TEXT;
    END IF;
END $$;

-- Add new columns to actualites if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'actualites' AND column_name = 'galerie_images') THEN
        ALTER TABLE actualites ADD COLUMN galerie_images TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'actualites' AND column_name = 'videos_youtube') THEN
        ALTER TABLE actualites ADD COLUMN videos_youtube TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'actualites' AND column_name = 'a_la_une') THEN
        ALTER TABLE actualites ADD COLUMN a_la_une BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add new columns to documents if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'resume') THEN
        ALTER TABLE documents ADD COLUMN resume TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'auteur') THEN
        ALTER TABLE documents ADD COLUMN auteur TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'nombre_pages') THEN
        ALTER TABLE documents ADD COLUMN nombre_pages INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'image_couverture_url') THEN
        ALTER TABLE documents ADD COLUMN image_couverture_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'documents' AND column_name = 'telechargements') THEN
        ALTER TABLE documents ADD COLUMN telechargements INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add new columns to personnel if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'personnel' AND column_name = 'nom_complet') THEN
        -- If nom_complet doesn't exist but nom does, rename it
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'personnel' AND column_name = 'nom') THEN
            ALTER TABLE personnel RENAME COLUMN nom TO nom_complet;
        ELSE
            ALTER TABLE personnel ADD COLUMN nom_complet TEXT;
        END IF;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'personnel' AND column_name = 'bio') THEN
        ALTER TABLE personnel ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'personnel' AND column_name = 'linkedin') THEN
        ALTER TABLE personnel ADD COLUMN linkedin TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'personnel' AND column_name = 'equipe') THEN
        ALTER TABLE personnel ADD COLUMN equipe TEXT DEFAULT 'autre' 
            CHECK (equipe IN ('direction', 'cadres', 'technique', 'administratif', 'autre'));
    END IF;
END $$;

-- Create statistiques_recettes table if it doesn't exist
CREATE TABLE IF NOT EXISTS statistiques_recettes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    annee INTEGER NOT NULL,
    mois INTEGER CHECK (mois >= 1 AND mois <= 12),
    type_recette TEXT NOT NULL,
    montant DECIMAL(15, 2) NOT NULL,
    devise TEXT DEFAULT 'USD' CHECK (devise IN ('CDF', 'USD')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for statistiques_recettes
ALTER TABLE statistiques_recettes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Stats are viewable by authenticated users" ON statistiques_recettes;
CREATE POLICY "Stats are viewable by authenticated users" ON statistiques_recettes
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only admins can manage stats" ON statistiques_recettes;
CREATE POLICY "Only admins can manage stats" ON statistiques_recettes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create chiffres_cles table for homepage statistics
CREATE TABLE IF NOT EXISTS chiffres_cles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cle TEXT NOT NULL UNIQUE,
    valeur DECIMAL(15, 2) NOT NULL,
    label TEXT NOT NULL,
    prefixe TEXT DEFAULT '',
    suffixe TEXT DEFAULT '',
    description TEXT,
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for chiffres_cles
ALTER TABLE chiffres_cles ENABLE ROW LEVEL SECURITY;

-- Policies for chiffres_cles
DROP POLICY IF EXISTS "Chiffres viewable by everyone" ON chiffres_cles;
CREATE POLICY "Chiffres viewable by everyone" ON chiffres_cles
    FOR SELECT USING (actif = TRUE);

DROP POLICY IF EXISTS "Admins can manage chiffres" ON chiffres_cles;
CREATE POLICY "Admins can manage chiffres" ON chiffres_cles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert default chiffres_cles if empty
INSERT INTO chiffres_cles (cle, valeur, label, prefixe, suffixe, description, ordre)
SELECT * FROM (VALUES
    ('recettes_collectees', 150, 'Recettes Collectées', '', 'M USD', 'Mobilisation annuelle', 1),
    ('contribuables', 5000, 'Contribuables', '+', '', 'Enregistrés dans la province', 2),
    ('projets_finances', 100, 'Projets Financés', '', '+', 'Infrastructures et développement', 3),
    ('antennes', 8, 'Antennes Provinciales', '', '', 'Couverture territoriale', 4)
) AS defaults(cle, valeur, label, prefixe, suffixe, description, ordre)
WHERE NOT EXISTS (SELECT 1 FROM chiffres_cles);

-- Add RLS policy for public read of stats (for homepage)
DROP POLICY IF EXISTS "Stats viewable by everyone" ON statistiques_recettes;
CREATE POLICY "Stats viewable by everyone" ON statistiques_recettes
    FOR SELECT USING (true);

COMMIT;
