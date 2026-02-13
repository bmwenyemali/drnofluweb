-- ================================================================
-- DONNÉES INITIALES POUR DRNOFLU
-- Exécuter ce script dans l'éditeur SQL de Supabase
-- ================================================================

-- =============================================
-- 1. SERVICES (Types de recettes non fiscales)
-- =============================================

INSERT INTO services (nom, description, icone, slug, ordre) VALUES
('Taxes Minières', 'Redevances et taxes liées à l''exploitation minière dans la province du Lualaba', 'pickaxe', 'taxes-minieres', 1),
('Taxes Commerciales', 'Taxes sur les activités commerciales, patentes et licences d''exploitation', 'store', 'taxes-commerciales', 2),
('Taxes de Transport', 'Taxes sur les véhicules, permis de conduire et transport en commun', 'car', 'taxes-transport', 3),
('Taxes Foncières', 'Taxes sur les propriétés immobilières et terrains', 'building', 'taxes-foncieres', 4),
('Taxes Environnementales', 'Taxes pour la protection de l''environnement et gestion des ressources naturelles', 'tree', 'taxes-environnementales', 5),
('Taxes Agricoles', 'Taxes sur les exploitations agricoles et produits de l''élevage', 'wheat', 'taxes-agricoles', 6),
('Droits Administratifs', 'Frais pour documents administratifs, certificats et autorisations', 'file-text', 'droits-administratifs', 7),
('Taxes de Santé Publique', 'Contributions liées aux établissements de santé et hygiène', 'shield', 'taxes-sante', 8)
ON CONFLICT (slug) DO NOTHING;


-- =============================================
-- 2. CHIFFRES CLÉS (Statistiques page d'accueil)
-- =============================================

INSERT INTO chiffres_cles (cle, label, valeur, prefixe, suffixe, description, ordre, actif) VALUES
('recettes_2025', 'Recettes 2025', 45.5, '', ' M USD', 'Total des recettes collectées en 2025', 1, true),
('contribuables', 'Contribuables', 12500, '', '+', 'Nombre de contribuables enregistrés', 2, true),
('points_collecte', 'Points de Collecte', 47, '', '', 'Bureaux de perception actifs', 3, true),
('taux_recouvrement', 'Taux de Recouvrement', 89, '', '%', 'Pourcentage des recettes recouvrées', 4, true),
('projets_finances', 'Projets Financés', 23, '', '', 'Projets d''infrastructure financés', 5, true),
('effectif', 'Agents', 156, '', '', 'Personnel de la DRNOFLU', 6, false)
ON CONFLICT (cle) DO NOTHING;


-- =============================================
-- 3. ACTUALITÉS (News et communiqués)
-- =============================================

INSERT INTO actualites (titre, slug, contenu, extrait, image_url, categorie, publie, a_la_une, date_publication, galerie_images, videos_youtube) VALUES
(
  'Lancement de la campagne de sensibilisation fiscale 2026',
  'campagne-sensibilisation-fiscale-2026',
  '## Une initiative majeure pour la transparence fiscale

La Direction des Recettes Non Fiscales du Lualaba (DRNOFLU) lance ce mois-ci une vaste campagne de sensibilisation auprès des contribuables de la province.

### Objectifs de la campagne

Cette campagne vise à :
- Informer les contribuables sur leurs obligations fiscales
- Expliquer les différents types de recettes non fiscales
- Présenter les procédures de paiement simplifiées
- Renforcer la confiance entre l''administration et les citoyens

### Calendrier des activités

| Date | Territoire | Activité |
|------|------------|----------|
| 15 Mars | Kolwezi | Conférence publique |
| 22 Mars | Dilolo | Sensibilisation de proximité |
| 29 Mars | Lubudi | Forum des contribuables |

### Contact

Pour plus d''informations, contactez-nous au +243 XXX XXX XXX ou par email à contact@drnoflu.cd.',
  'La DRNOFLU lance une vaste campagne pour informer les contribuables sur leurs obligations et les procédures de paiement.',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
  'communique',
  true,
  true,
  NOW() - INTERVAL '2 days',
  '{}',
  '{}'
),
(
  'Rapport annuel 2025 : Performances record de la DRNOFLU',
  'rapport-annuel-2025',
  '## Une année exceptionnelle pour les recettes non fiscales

L''année 2025 marque un tournant historique pour la DRNOFLU avec des recettes atteignant 45,5 millions USD, soit une augmentation de 23% par rapport à 2024.

### Chiffres clés

- **45,5 M USD** de recettes totales
- **89%** de taux de recouvrement
- **12 500** contribuables actifs
- **23** projets d''infrastructure financés

### Secteurs performants

1. **Secteur minier** : 28,3 M USD (62%)
2. **Commerce** : 8,2 M USD (18%)
3. **Transport** : 4,1 M USD (9%)
4. **Autres** : 4,9 M USD (11%)

Le rapport complet est disponible en téléchargement dans la section Documents.',
  'Le rapport annuel 2025 révèle des performances exceptionnelles avec 45,5 M USD de recettes, une hausse de 23% par rapport à 2024.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  'rapport',
  true,
  true,
  NOW() - INTERVAL '5 days',
  '{}',
  '{}'
),
(
  'Nouveau système de paiement mobile pour les contribuables',
  'paiement-mobile-contribuables',
  '## Simplifier le paiement des taxes

La DRNOFLU modernise ses services avec l''introduction du paiement mobile, permettant aux contribuables de s''acquitter de leurs obligations fiscales depuis leur téléphone.

### Avantages du nouveau système

- **Simplicité** : Paiement en quelques clics
- **Rapidité** : Transaction instantanée
- **Sécurité** : Confirmation par SMS
- **Accessibilité** : Disponible 24h/24

### Comment ça marche ?

1. Composez le *123# sur votre téléphone
2. Sélectionnez "Paiement DRNOFLU"
3. Entrez votre numéro de contribuable
4. Confirmez le montant et validez

### Partenaires

Ce service est disponible via :
- Orange Money
- Airtel Money
- M-Pesa

Pour toute assistance, contactez notre service client.',
  'La DRNOFLU lance le paiement mobile pour permettre aux contribuables de payer leurs taxes depuis leur téléphone.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  'annonce',
  true,
  false,
  NOW() - INTERVAL '10 days',
  '{}',
  '{}'
),
(
  'Signature d''un partenariat avec la Banque Centrale du Congo',
  'partenariat-banque-centrale',
  '## Un accord stratégique pour l''efficacité fiscale

La DRNOFLU et la Banque Centrale du Congo (BCC) ont signé ce jour un protocole d''accord visant à renforcer la traçabilité des recettes non fiscales dans la province du Lualaba.

### Objectifs du partenariat

- Amélioration de la traçabilité des flux financiers
- Mise en place d''un système de reporting automatisé
- Formation des agents aux nouvelles procédures bancaires
- Sécurisation des opérations de collecte

### Déclarations officielles

> "Cette collaboration marque une étape importante dans la modernisation de notre administration fiscale." - Directeur DRNOFLU

### Prochaines étapes

La mise en œuvre du système est prévue pour le deuxième trimestre 2026.',
  'La DRNOFLU signe un protocole d''accord avec la Banque Centrale du Congo pour renforcer la traçabilité des recettes.',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
  'evenement',
  true,
  false,
  NOW() - INTERVAL '15 days',
  '{}',
  '{}'
),
(
  'Formation des agents de recouvrement à Kolwezi',
  'formation-agents-recouvrement',
  '## Renforcement des capacités du personnel

Une session de formation intensive de 5 jours a été organisée pour les agents de recouvrement de la DRNOFLU à Kolwezi.

### Programme de la formation

**Jour 1-2 : Cadre juridique**
- Législation fiscale congolaise
- Arrêtés provinciaux
- Procédures de contrôle

**Jour 3-4 : Techniques de recouvrement**
- Communication avec les contribuables
- Gestion des conflits
- Négociation et médiation

**Jour 5 : Outils numériques**
- Utilisation du système informatique
- Génération des rapports
- Sécurité des données

### Participants

35 agents de différents bureaux de perception ont participé à cette formation.',
  '35 agents de recouvrement ont bénéficié d''une formation intensive de 5 jours à Kolwezi.',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
  'general',
  true,
  false,
  NOW() - INTERVAL '20 days',
  '{}',
  '{}'
);


-- =============================================
-- 4. DOCUMENTS (Bibliothèque juridique)
-- =============================================

INSERT INTO documents (titre, description, resume, auteur, nombre_pages, type, categorie, fichier_url, image_couverture_url, annee, date_publication, publie, telechargements) VALUES
(
  'Ordonnance-Loi n°2020-015 portant nomenclature des recettes non fiscales',
  'Texte de base définissant les différents types de recettes non fiscales applicables en République Démocratique du Congo.',
  'Cette ordonnance-loi établit la classification officielle des recettes non fiscales perçues par les provinces et les entités territoriales décentralisées.',
  'Gouvernement de la RDC',
  45,
  'pdf',
  'ordonnance',
  'https://example.com/documents/ordonnance-2020-015.pdf',
  NULL,
  2020,
  '2020-03-15',
  true,
  234
),
(
  'Arrêté Provincial n°2024-001 fixant les taux des recettes non fiscales du Lualaba',
  'Arrêté définissant les barèmes et taux applicables pour toutes les catégories de recettes non fiscales dans la province du Lualaba.',
  'Cet arrêté provincial actualise les taux de perception pour l''année 2024 et suivantes.',
  'Gouvernorat du Lualaba',
  28,
  'pdf',
  'arrete',
  'https://example.com/documents/arrete-2024-001.pdf',
  NULL,
  2024,
  '2024-01-10',
  true,
  567
),
(
  'Décret n°2019-008 portant création de la DRNOFLU',
  'Texte fondateur de la Direction des Recettes Non Fiscales du Lualaba définissant sa mission, son organisation et ses attributions.',
  'Ce décret crée officiellement la DRNOFLU et définit son cadre institutionnel.',
  'Gouvernement Provincial',
  15,
  'pdf',
  'decret',
  'https://example.com/documents/decret-2019-008.pdf',
  NULL,
  2019,
  '2019-06-20',
  true,
  189
),
(
  'Circulaire n°2023-005 relative aux procédures de recouvrement',
  'Instructions détaillées concernant les procédures de recouvrement des recettes non fiscales et la gestion des contribuables.',
  'Cette circulaire précise les modalités opérationnelles du recouvrement.',
  'Direction DRNOFLU',
  12,
  'pdf',
  'circulaire',
  'https://example.com/documents/circulaire-2023-005.pdf',
  NULL,
  2023,
  '2023-08-15',
  true,
  145
),
(
  'Guide du contribuable - Édition 2025',
  'Guide pratique destiné aux contribuables expliquant leurs obligations, les procédures de déclaration et les modalités de paiement.',
  'Un guide complet pour comprendre et s''acquitter de ses obligations fiscales.',
  'DRNOFLU',
  32,
  'pdf',
  'rapport',
  'https://example.com/documents/guide-contribuable-2025.pdf',
  NULL,
  2025,
  '2025-01-05',
  true,
  892
),
(
  'Rapport annuel DRNOFLU 2024',
  'Rapport détaillé des activités et performances de la DRNOFLU pour l''année 2024.',
  'Bilan complet de l''année 2024 incluant les statistiques de collecte et les projets réalisés.',
  'DRNOFLU',
  48,
  'pdf',
  'rapport',
  'https://example.com/documents/rapport-annuel-2024.pdf',
  NULL,
  2024,
  '2025-02-01',
  true,
  456
),
(
  'Formulaire de déclaration - Taxes minières',
  'Formulaire officiel pour la déclaration des taxes minières à remplir par les exploitants.',
  NULL,
  NULL,
  4,
  'pdf',
  'formulaire',
  'https://example.com/documents/formulaire-taxes-minieres.pdf',
  NULL,
  2025,
  '2025-01-01',
  true,
  1234
),
(
  'Formulaire de demande d''exonération',
  'Formulaire pour soumettre une demande d''exonération fiscale avec pièces justificatives requises.',
  NULL,
  NULL,
  3,
  'pdf',
  'formulaire',
  'https://example.com/documents/formulaire-exoneration.pdf',
  NULL,
  2025,
  '2025-01-01',
  true,
  567
),
(
  'Loi organique n°2015-001 sur les finances publiques',
  'Loi cadre définissant les principes de gestion des finances publiques en RDC.',
  'Cette loi établit les règles fondamentales de la gestion budgétaire et fiscale.',
  'Parlement de la RDC',
  78,
  'pdf',
  'loi',
  'https://example.com/documents/loi-organique-2015-001.pdf',
  NULL,
  2015,
  '2015-07-10',
  true,
  321
),
(
  'Code des impôts - Tome 2 : Recettes non fiscales',
  'Compilation des textes juridiques relatifs aux recettes non fiscales.',
  'Ouvrage de référence pour les praticiens du droit fiscal.',
  'Ministère des Finances',
  156,
  'pdf',
  'loi',
  'https://example.com/documents/code-impots-tome2.pdf',
  NULL,
  2023,
  '2023-05-20',
  true,
  234
);


-- =============================================
-- 5. PERSONNEL (Structure organisationnelle)
-- =============================================

INSERT INTO personnel (nom_complet, titre, fonction, departement, equipe, bio, photo_url, email, telephone, ordre, actif) VALUES
(
  'Georges Tshata Mbov',
  'Directeur Provincial',
  'Direction Générale',
  'Direction',
  'direction',
  'M. Georges Tshata dirige la DRNOFLU depuis 2021. Économiste de formation avec plus de 15 ans d''expérience dans l''administration fiscale.',
  '/images/direction/georges.png',
  'directeur@drnoflu.cd',
  '+243 XXX XXX XXX',
  1,
  true
),
(
  'Marie Kabongo',
  'Directrice Adjointe',
  'Coordination des opérations',
  'Direction',
  'direction',
  'Mme Kabongo supervise les opérations quotidiennes et la coordination entre les différents services.',
  NULL,
  'adjoint@drnoflu.cd',
  '+243 XXX XXX XXX',
  2,
  true
),
(
  'Patrick Mwamba',
  'Chef de Division Recouvrement',
  'Supervision du recouvrement',
  'Division Recouvrement',
  'cadres',
  'Expert en fiscalité avec 10 ans d''expérience dans le recouvrement des recettes publiques.',
  NULL,
  'recouvrement@drnoflu.cd',
  NULL,
  3,
  true
),
(
  'Jeanne Mutombo',
  'Chef de Division Contentieux',
  'Gestion des litiges fiscaux',
  'Division Contentieux',
  'cadres',
  'Avocate fiscaliste spécialisée dans la résolution des conflits entre l''administration et les contribuables.',
  NULL,
  'contentieux@drnoflu.cd',
  NULL,
  4,
  true
),
(
  'Albert Kasongo',
  'Chef de Division Informatique',
  'Systèmes d''information',
  'Division IT',
  'cadres',
  'Ingénieur informaticien en charge de la digitalisation des processus de la DRNOFLU.',
  NULL,
  'it@drnoflu.cd',
  NULL,
  5,
  true
),
(
  'Sophie Kalamba',
  'Responsable Communication',
  'Relations publiques et communication',
  'Service Communication',
  'technique',
  'Journaliste de formation, elle gère la communication externe et les relations presse.',
  NULL,
  'communication@drnoflu.cd',
  NULL,
  6,
  true
),
(
  'Pierre Ilunga',
  'Responsable Statistiques',
  'Analyse des données fiscales',
  'Service Statistiques',
  'technique',
  'Statisticien chargé de l''analyse des données de collecte et de la production de rapports.',
  NULL,
  'stats@drnoflu.cd',
  NULL,
  7,
  true
),
(
  'Catherine Mbuyi',
  'Chef du Personnel',
  'Gestion des ressources humaines',
  'Administration',
  'administratif',
  'En charge de la gestion administrative du personnel de la DRNOFLU.',
  NULL,
  'rh@drnoflu.cd',
  NULL,
  8,
  true
);


-- =============================================
-- 6. STATISTIQUES RECETTES (pour graphiques)
-- =============================================

-- Données mensuelles 2024
INSERT INTO statistiques_recettes (annee, mois, type_recette, montant, devise) VALUES
-- 2024
(2024, 1, 'minier', 1800000, 'USD'),
(2024, 1, 'commercial', 420000, 'USD'),
(2024, 1, 'transport', 180000, 'USD'),
(2024, 2, 'minier', 2100000, 'USD'),
(2024, 2, 'commercial', 450000, 'USD'),
(2024, 2, 'transport', 190000, 'USD'),
(2024, 3, 'minier', 2300000, 'USD'),
(2024, 3, 'commercial', 480000, 'USD'),
(2024, 3, 'transport', 210000, 'USD'),
(2024, 4, 'minier', 2150000, 'USD'),
(2024, 4, 'commercial', 520000, 'USD'),
(2024, 4, 'transport', 195000, 'USD'),
(2024, 5, 'minier', 2400000, 'USD'),
(2024, 5, 'commercial', 510000, 'USD'),
(2024, 5, 'transport', 220000, 'USD'),
(2024, 6, 'minier', 2550000, 'USD'),
(2024, 6, 'commercial', 540000, 'USD'),
(2024, 6, 'transport', 235000, 'USD'),
(2024, 7, 'minier', 2650000, 'USD'),
(2024, 7, 'commercial', 560000, 'USD'),
(2024, 7, 'transport', 245000, 'USD'),
(2024, 8, 'minier', 2450000, 'USD'),
(2024, 8, 'commercial', 530000, 'USD'),
(2024, 8, 'transport', 225000, 'USD'),
(2024, 9, 'minier', 2700000, 'USD'),
(2024, 9, 'commercial', 580000, 'USD'),
(2024, 9, 'transport', 260000, 'USD'),
(2024, 10, 'minier', 2850000, 'USD'),
(2024, 10, 'commercial', 600000, 'USD'),
(2024, 10, 'transport', 275000, 'USD'),
(2024, 11, 'minier', 2900000, 'USD'),
(2024, 11, 'commercial', 620000, 'USD'),
(2024, 11, 'transport', 285000, 'USD'),
(2024, 12, 'minier', 3100000, 'USD'),
(2024, 12, 'commercial', 650000, 'USD'),
(2024, 12, 'transport', 310000, 'USD'),

-- 2025 (données partielles)
(2025, 1, 'minier', 2950000, 'USD'),
(2025, 1, 'commercial', 680000, 'USD'),
(2025, 1, 'transport', 320000, 'USD'),
(2025, 2, 'minier', 3100000, 'USD'),
(2025, 2, 'commercial', 710000, 'USD'),
(2025, 2, 'transport', 335000, 'USD'),
(2025, 3, 'minier', 3250000, 'USD'),
(2025, 3, 'commercial', 740000, 'USD'),
(2025, 3, 'transport', 350000, 'USD');


-- =============================================
-- FIN DU SCRIPT
-- =============================================

-- Note: Assurez-vous que les tables existent avant d'exécuter ce script
-- Les tables requises sont:
-- - services
-- - chiffres_cles  
-- - actualites
-- - documents
-- - personnel
-- - statistiques_recettes

SELECT 'Données initiales insérées avec succès!' as message;
