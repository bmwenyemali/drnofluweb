-- ================================================================
-- FIX RLS POLICIES - Pour corriger les problèmes d'accès
-- Exécuter ce script APRÈS migration_v2_reset.sql
-- ================================================================

-- =============================================
-- 1. FIX SIMULATIONS - Permettre aux visiteurs anonymes d'insérer
-- =============================================

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Simulations insertables par tous" ON simulations;
DROP POLICY IF EXISTS "Simulations visibles par admins" ON simulations;
DROP POLICY IF EXISTS "Allow anon insert simulations" ON simulations;
DROP POLICY IF EXISTS "Allow public insert simulations" ON simulations;

-- Nouvelle policy: Permettre aux utilisateurs anonymes et authentifiés d'insérer
CREATE POLICY "Allow anon insert simulations" ON simulations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Permettre aux admins de voir toutes les simulations
CREATE POLICY "Simulations visibles par admins" ON simulations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );


-- =============================================
-- 2. FIX PARAMETRES - Permettre aux admins de modifier
-- =============================================

DROP POLICY IF EXISTS "Parametres visibles par tous" ON parametres;
DROP POLICY IF EXISTS "Parametres modifiables par admins" ON parametres;
DROP POLICY IF EXISTS "Allow anon read parametres" ON parametres;
DROP POLICY IF EXISTS "Allow admin update parametres" ON parametres;

-- Lire: tout le monde (anon + authenticated)
CREATE POLICY "Allow anon read parametres" ON parametres
  FOR SELECT TO anon, authenticated
  USING (true);

-- Modifier: seulement les admins (via profiles)
CREATE POLICY "Allow admin update parametres" ON parametres
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );


-- =============================================
-- 3. FIX BAREMES - Lecture publique
-- =============================================

DROP POLICY IF EXISTS "Baremes visibles par tous" ON baremes_simulation;
DROP POLICY IF EXISTS "Baremes modifiables par admins" ON baremes_simulation;
DROP POLICY IF EXISTS "Allow anon read baremes" ON baremes_simulation;
DROP POLICY IF EXISTS "Allow admin modify baremes" ON baremes_simulation;

-- Lire: tout le monde
CREATE POLICY "Allow anon read baremes" ON baremes_simulation
  FOR SELECT TO anon, authenticated
  USING (true);

-- Modifier: seulement les admins
CREATE POLICY "Allow admin modify baremes" ON baremes_simulation
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );


-- =============================================
-- 4. FIX BON A SAVOIR - Lecture publique, modification par editeurs
-- =============================================

DROP POLICY IF EXISTS "Bon a savoir visible par tous" ON bon_a_savoir;
DROP POLICY IF EXISTS "Bon a savoir modifiable par admins/editeurs" ON bon_a_savoir;
DROP POLICY IF EXISTS "Allow anon read bon_a_savoir" ON bon_a_savoir;
DROP POLICY IF EXISTS "Allow editor modify bon_a_savoir" ON bon_a_savoir;

-- Lire: tout le monde (publié uniquement pour anon)
CREATE POLICY "Allow anon read bon_a_savoir" ON bon_a_savoir
  FOR SELECT TO anon
  USING (publie = true);

CREATE POLICY "Allow auth read bon_a_savoir" ON bon_a_savoir
  FOR SELECT TO authenticated
  USING (true);

-- Modifier: admins et editeurs
CREATE POLICY "Allow editor modify bon_a_savoir" ON bon_a_savoir
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editeur')
    )
  );


-- =============================================
-- VÉRIFICATION
-- =============================================

SELECT 'RLS Policies corrigées!' as message;

-- Lister les policies actives
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('simulations', 'parametres', 'baremes_simulation', 'bon_a_savoir')
ORDER BY tablename, policyname;
