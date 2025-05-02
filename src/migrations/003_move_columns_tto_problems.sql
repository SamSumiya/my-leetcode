CREATE TABLE IF NOT EXISTS problems (
    slug Text PRIMARY KEY, 
    title TEXT NOT NULL, 
    difficulty TEXT, 
    tags TEXT[], 
    url TEXT not null 
); 


ALTER TABLE logs ADD COLUMN slug TEXT;

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
    WHERE title is NOT NULL; 
