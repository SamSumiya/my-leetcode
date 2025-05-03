CREATE TABLE IF NOT EXISTS problems (
    slug Text PRIMARY KEY, 
    title TEXT NOT NULL, 
    difficulty TEXT, 
    tags TEXT[], 
    url TEXT not null 
); 

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='logs' AND column_name='slug'
  ) THEN
    ALTER TABLE logs ADD COLUMN slug TEXT;
  END IF;
END;
$$;

UPDATE logs
SET slug = LOWER(REPLACE(title, ' ', '-'))
WHERE slug is NULL AND title IS NOT NULL; 

-- Insert unique problem entries form logs
INSERT INTO problems (slug, title, difficulty, tags, url)
SELECT DISTINCT 
    slug,
    title,
    difficulty, 
    tags, 
    url
FROM logs 
WHERE title is NOT NULL AND slug IS NOT NULL 
ON CONFLICT (slug) DO NOTHING;