CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL, 
    title TEXT NOT NULL, 
    url TEXT NOT NULL,
    difficulty TEXT, 
    status TEXT, 
    approach TEXT,  
    tags TEXT[],
    starred BOOLEAN DEFAULT false
);