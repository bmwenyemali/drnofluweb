-- ============================================================================
-- Update Sample Data: Add addresses and contact information
-- DRNOFLU - Direction des Recettes Non Fiscales du Lualaba
-- ============================================================================

-- Update Points de Recettes with addresses and emails
UPDATE cartographie_points_recettes SET 
    adresse = 'Avenue de la Mine, Centre-ville, Kolwezi',
    email = 'siege@drnoflu.gouv.cd'
WHERE nom = 'Siège DRNOFLU';

UPDATE cartographie_points_recettes SET 
    adresse = 'Avenue Kambove, Kolwezi Centre',
    email = 'kolwezi.centre@drnoflu.gouv.cd',
    telephone = '+243 812 345 678'
WHERE nom = 'Point de Recette Kolwezi Centre';

UPDATE cartographie_points_recettes SET 
    adresse = 'Quartier Manika, Kolwezi',
    email = 'manika@drnoflu.gouv.cd',
    telephone = '+243 812 345 679'
WHERE nom = 'Point de Recette Manika';

UPDATE cartographie_points_recettes SET 
    adresse = 'Commune Dilala, Kolwezi',
    email = 'dilala@drnoflu.gouv.cd',
    telephone = '+243 812 345 680'
WHERE nom = 'Point de Recette Dilala';

UPDATE cartographie_points_recettes SET 
    adresse = 'Centre-ville, Dilolo',
    email = 'dilolo@drnoflu.gouv.cd',
    telephone = '+243 812 345 681'
WHERE nom = 'Point de Recette Dilolo';

UPDATE cartographie_points_recettes SET 
    adresse = 'Chef-lieu, Kapanga',
    email = 'kapanga@drnoflu.gouv.cd',
    telephone = '+243 812 345 682'
WHERE nom = 'Point de Recette Kapanga';

UPDATE cartographie_points_recettes SET 
    adresse = 'Centre administratif, Sandoa',
    email = 'sandoa@drnoflu.gouv.cd',
    telephone = '+243 812 345 683'
WHERE nom = 'Point de Recette Sandoa';

UPDATE cartographie_points_recettes SET 
    adresse = 'Chef-lieu, Lubudi',
    email = 'lubudi@drnoflu.gouv.cd',
    telephone = '+243 812 345 684'
WHERE nom = 'Point de Recette Lubudi';

UPDATE cartographie_points_recettes SET 
    adresse = 'Centre, Mutshatsha',
    email = 'mutshatsha@drnoflu.gouv.cd',
    telephone = '+243 812 345 685'
WHERE nom = 'Point de Recette Mutshatsha';

UPDATE cartographie_points_recettes SET 
    adresse = 'Cité de Fungurume',
    email = 'fungurume@drnoflu.gouv.cd',
    telephone = '+243 812 345 686'
WHERE nom = 'Point de Recette Fungurume';

-- Update Projets with addresses
UPDATE cartographie_projets SET 
    adresse = 'Axe RN39, Kolwezi - Likasi'
WHERE nom = 'Route Kolwezi-Likasi';

UPDATE cartographie_projets SET 
    adresse = 'Quartier Manika, Kolwezi'
WHERE nom = 'École Primaire de Manika';

UPDATE cartographie_projets SET 
    adresse = 'Centre-ville, Dilolo'
WHERE nom = 'Centre de Santé Dilolo';

UPDATE cartographie_projets SET 
    adresse = 'Rivière Lulua, Sandoa'
WHERE nom = 'Pont sur la rivière Lulua';

UPDATE cartographie_projets SET 
    adresse = 'Quartier central, Lubudi'
WHERE nom = 'Marché Central Lubudi';

UPDATE cartographie_projets SET 
    adresse = 'Cité de Fungurume'
WHERE nom = 'Adduction d''eau Fungurume';

-- ============================================================================
-- UPDATE COMPLETE
-- ============================================================================
