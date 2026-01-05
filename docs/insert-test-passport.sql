-- Script SQL pour insérer un passeport numérique de test
-- Assurez-vous qu'un produit avec ID=1 existe déjà !

-- 1. Carbon Footprint
INSERT INTO carbon_footprints (total_co2, manufacturing, transportation, usage, end_of_life, score)
VALUES (42.5, 30.0, 5.5, 5.0, 2.0, 'C');

SET @carbon_id = LAST_INSERT_ID();

-- 2. Traceability
INSERT INTO traceability (origin_country, manufacturer, factory, transparency_score)
VALUES ('France', 'EcoTech France', 'Usine de Lyon', 95);

SET @trace_id = LAST_INSERT_ID();

-- 3. Supply Chain Journey (étapes de la chaîne d'approvisionnement)
INSERT INTO supply_chain_journey (traceability_id, step) VALUES
(@trace_id, 'Extraction matières premières - Alsace'),
(@trace_id, 'Fabrication composants - Lyon'),
(@trace_id, 'Assemblage final - Paris'),
(@trace_id, 'Distribution - France & Europe');

-- 4. Durability
INSERT INTO durability (expected_lifespan_years, repairability_score, repairability_index, 
                        spare_parts_available, warranty_years, software_updates)
VALUES (7, 9.2, 'A', true, 3, true);

SET @durability_id = LAST_INSERT_ID();

-- 5. Recycling Info
INSERT INTO recycling_info (recyclable_percentage, instructions, take_back_program)
VALUES (95.0, 
        'Déposez votre ancien appareil dans un point de collecte agréé. Toutes les pièces seront récupérées et recyclées. Retirez d''abord toutes les données personnelles.',
        true);

SET @recycling_id = LAST_INSERT_ID();

-- 6. Digital Passport (Master)
INSERT INTO digital_passports (product_id, carbon_footprint_id, traceability_id, 
                               durability_id, recycling_info_id, created_at, updated_at)
VALUES (1, @carbon_id, @trace_id, @durability_id, @recycling_id, 
        NOW(), NOW());

SET @passport_id = LAST_INSERT_ID();

-- 7. Materials
INSERT INTO materials (passport_id, name, percentage, renewable, recycled, recyclable, origin) VALUES
(@passport_id, 'Aluminium recyclé', 40.0, false, true, true, 'France'),
(@passport_id, 'Plastique bio-sourcé', 30.0, true, false, true, 'Europe'),
(@passport_id, 'Composants électroniques', 25.0, false, false, true, 'Asie - Fair Trade'),
(@passport_id, 'Verre', 5.0, false, true, true, 'Europe');

-- 8. Certifications
INSERT INTO certifications (passport_id, name, issuer, valid_until, logo_url, verification_url, type) VALUES
(@passport_id, 'Écolabel Européen', 'Commission Européenne', '2026-12-31', 
 'https://example.com/ecolabel.png', 'https://ecolabel.eu/verify/12345', 'ENVIRONMENTAL'),
(@passport_id, 'Fair Trade Certified', 'Fair Trade International', '2026-06-30',
 'https://example.com/fairtrade.png', 'https://fairtrade.org/verify/67890', 'ETHICAL');

-- 9. Collection Points
INSERT INTO collection_points (recycling_info_id, name, address, distance) VALUES
(@recycling_id, 'Ecosystem - Paris 10', '15 Rue du Faubourg Montmartre, 75010 Paris', '2.3 km'),
(@recycling_id, 'Darty - Gare du Nord', '23 Boulevard de Denain, 75010 Paris', '3.1 km'),
(@recycling_id, 'Emmaüs - Porte de Clignancourt', '102 Boulevard Ney, 75018 Paris', '5.5 km');

SET @cp1 = LAST_INSERT_ID() - 2;
SET @cp2 = LAST_INSERT_ID() - 1;
SET @cp3 = LAST_INSERT_ID();

-- 10. Accepted Materials pour chaque point de collecte
INSERT INTO collection_point_materials (collection_point_id, material) VALUES
(@cp1, 'Électronique'),
(@cp1, 'Batteries'),
(@cp1, 'Plastique'),
(@cp1, 'Métaux'),
(@cp2, 'Électronique'),
(@cp2, 'Batteries'),
(@cp3, 'Électronique'),
(@cp3, 'Textile'),
(@cp3, 'Plastique'),
(@cp3, 'Métaux');

-- Vérification
SELECT 'Passeport numérique créé avec succès pour le produit ID 1' AS message;
SELECT 
    dp.id AS passport_id,
    dp.product_id,
    cf.total_co2,
    cf.score AS carbon_score,
    t.manufacturer,
    d.repairability_index,
    COUNT(DISTINCT m.id) AS materials_count,
    COUNT(DISTINCT c.id) AS certifications_count
FROM digital_passports dp
LEFT JOIN carbon_footprints cf ON dp.carbon_footprint_id = cf.id
LEFT JOIN traceability t ON dp.traceability_id = t.id
LEFT JOIN durability d ON dp.durability_id = d.id
LEFT JOIN materials m ON m.passport_id = dp.id
LEFT JOIN certifications c ON c.passport_id = dp.id
WHERE dp.product_id = 1
GROUP BY dp.id;
