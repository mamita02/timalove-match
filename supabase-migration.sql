

CREATE TABLE IF NOT EXISTS registrations (
  -- Identifiant et timestamps
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Informations personnelles (avec contraintes de validation)
  first_name TEXT NOT NULL 
    CHECK (char_length(first_name) >= 2 AND char_length(first_name) <= 50),
  
  last_name TEXT NOT NULL 
    CHECK (char_length(last_name) >= 2 AND char_length(last_name) <= 50),
  
  email TEXT NOT NULL UNIQUE 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  
  phone TEXT NOT NULL 
    CHECK (phone ~* '^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$'),
  
  age INTEGER NOT NULL 
    CHECK (age >= 18 AND age <= 99),
  
  city TEXT NOT NULL 
    CHECK (char_length(city) >= 2 AND char_length(city) <= 100),
  
  profession TEXT 
    CHECK (profession IS NULL OR char_length(profession) <= 100),
  
  -- Descriptions textuelles (avec contraintes de longueur)
  presentation TEXT NOT NULL 
    CHECK (char_length(presentation) >= 50 AND char_length(presentation) <= 1000),
  
  looking_for TEXT NOT NULL 
    CHECK (char_length(looking_for) >= 30 AND char_length(looking_for) <= 500),
  
  -- Statut de l'inscription
  status TEXT DEFAULT 'pending' NOT NULL 
    CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- ============================================
-- 2. CRÉATION DES INDEX POUR LA PERFORMANCE
-- ============================================

-- Index sur l'email pour recherches rapides et unicité
CREATE INDEX IF NOT EXISTS idx_registrations_email 
ON registrations(email);

-- Index sur le statut pour filtrer rapidement
CREATE INDEX IF NOT EXISTS idx_registrations_status 
ON registrations(status);

-- Index sur created_at pour tri chronologique
CREATE INDEX IF NOT EXISTS idx_registrations_created_at 
ON registrations(created_at DESC);

-- Index composite pour les requêtes par statut et date
CREATE INDEX IF NOT EXISTS idx_registrations_status_created 
ON registrations(status, created_at DESC);

-- Index sur la ville pour les statistiques géographiques
CREATE INDEX IF NOT EXISTS idx_registrations_city 
ON registrations(city);

-- ============================================
-- 3. FONCTION POUR MISE À JOUR AUTOMATIQUE
-- ============================================

-- Fonction pour mettre à jour automatically le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour appeler la fonction avant chaque UPDATE
DROP TRIGGER IF EXISTS update_registrations_updated_at ON registrations;
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut créer une inscription (INSERT)
DROP POLICY IF EXISTS "Inscription publique" ON registrations;
CREATE POLICY "Inscription publique"
ON registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Politique : Lecture publique (DÉVELOPPEMENT UNIQUEMENT)
-- ⚠️ À DÉSACTIVER en production !
DROP POLICY IF EXISTS "Lecture publique développement" ON registrations;
CREATE POLICY "Lecture publique développement"
ON registrations FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================
-- 5. POLITIQUES DE SÉCURITÉ POUR PRODUCTION
-- ============================================

-- Pour activer en production, décommenter ces lignes :

/*
-- Supprimer la politique de lecture publique
DROP POLICY IF EXISTS "Lecture publique développement" ON registrations;

-- Seuls les utilisateurs authentifiés peuvent lire
DROP POLICY IF EXISTS "Admin lecture" ON registrations;
CREATE POLICY "Admin lecture"
ON registrations FOR SELECT
TO authenticated
USING (true);

-- Seuls les admins peuvent mettre à jour
DROP POLICY IF EXISTS "Admin mise à jour" ON registrations;
CREATE POLICY "Admin mise à jour"
ON registrations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Seuls les admins peuvent supprimer
DROP POLICY IF EXISTS "Admin suppression" ON registrations;
CREATE POLICY "Admin suppression"
ON registrations FOR DELETE
TO authenticated
USING (true);
*/

-- ============================================
-- 6. VUES UTILES POUR LES STATISTIQUES
-- ============================================

-- Vue : Statistiques par statut
DROP VIEW IF EXISTS registration_stats;
CREATE VIEW registration_stats AS
SELECT 
  status,
  COUNT(*) as total,
  MIN(created_at) as premiere_inscription,
  MAX(created_at) as derniere_inscription
FROM registrations
GROUP BY status;

-- Vue : Statistiques par ville
DROP VIEW IF EXISTS registration_by_city;
CREATE VIEW registration_by_city AS
SELECT 
  city,
  COUNT(*) as total,
  AVG(age)::INTEGER as age_moyen,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approuves
FROM registrations
GROUP BY city
ORDER BY total DESC;

-- Vue : Inscriptions récentes (dernières 24h)
DROP VIEW IF EXISTS recent_registrations;
CREATE VIEW recent_registrations AS
SELECT 
  id,
  first_name,
  last_name,
  email,
  city,
  age,
  status,
  created_at
FROM registrations
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- ============================================
-- 7. FONCTIONS UTILES
-- ============================================

-- Fonction : Compter les inscriptions par statut
CREATE OR REPLACE FUNCTION count_by_status(status_filter TEXT DEFAULT NULL)
RETURNS TABLE(status TEXT, count BIGINT) AS $$
BEGIN
  IF status_filter IS NULL THEN
    RETURN QUERY 
    SELECT r.status, COUNT(*)::BIGINT
    FROM registrations r
    GROUP BY r.status;
  ELSE
    RETURN QUERY 
    SELECT r.status, COUNT(*)::BIGINT
    FROM registrations r
    WHERE r.status = status_filter
    GROUP BY r.status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction : Rechercher par email (insensible à la casse)
CREATE OR REPLACE FUNCTION search_by_email(email_search TEXT)
RETURNS TABLE(
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  city TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    r.id,
    r.first_name,
    r.last_name,
    r.email,
    r.city,
    r.status,
    r.created_at
  FROM registrations r
  WHERE r.email ILIKE '%' || email_search || '%'
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Décommenter pour insérer des données de test

/*
INSERT INTO registrations (
  first_name, last_name, email, phone, age, city, 
  profession, presentation, looking_for, status
) VALUES
(
  'Jean',
  'Dupont',
  'jean.dupont@example.com',
  '0612345678',
  30,
  'Paris',
  'Ingénieur',
  'Passionné de voyages et de gastronomie, je cherche à partager des moments authentiques et à construire une relation basée sur la confiance et le respect mutuel.',
  'Je recherche une personne attentionnée et ambitieuse pour construire une relation sérieuse et durable.',
  'pending'
),
(
  'Marie',
  'Martin',
  'marie.martin@example.com',
  '0698765432',
  28,
  'Lyon',
  'Architecte',
  'Creative et curieuse, j''aime l''art, la culture et les longues discussions autour d''un bon café. Je suis à la recherche de quelqu''un qui partage mes valeurs.',
  'Une personne sincère et passionnée avec qui partager des projets et des rêves communs.',
  'approved'
);
*/

-- ============================================
-- 9. REQUÊTES UTILES
-- ============================================

-- Ces requêtes peuvent être exécutées après la création de la table

-- Voir toutes les inscriptions
-- SELECT * FROM registrations ORDER BY created_at DESC;

-- Statistiques par statut
-- SELECT * FROM registration_stats;

-- Inscriptions récentes
-- SELECT * FROM recent_registrations;

-- Statistiques par ville
-- SELECT * FROM registration_by_city LIMIT 10;

-- Rechercher par email
-- SELECT * FROM search_by_email('gmail.com');

-- Compter par statut
-- SELECT * FROM count_by_status();

-- ============================================
-- 10. MAINTENANCE
-- ============================================

-- Analyser la table pour optimiser les requêtes
-- ANALYZE registrations;

-- Vérifier la taille de la table
-- SELECT pg_size_pretty(pg_total_relation_size('registrations'));

-- Voir les index
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'registrations';

-- ============================================
-- ✅ INSTALLATION TERMINÉE
-- ============================================

-- Pour vérifier que tout fonctionne :
-- SELECT COUNT(*) as total_registrations FROM registrations;

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Table "registrations" créée avec succès !';
  RAISE NOTICE '✅ Index créés';
  RAISE NOTICE '✅ Row Level Security activé';
  RAISE NOTICE '✅ Vues statistiques créées';
  RAISE NOTICE '✅ Fonctions utilitaires créées';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Votre base de données est prête !';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Prochaines étapes :';
  RAISE NOTICE '1. Configurer les clés API dans .env';
  RAISE NOTICE '2. Tester l''inscription depuis l''application';
  RAISE NOTICE '3. Vérifier les données dans Table Editor';
END $$;
