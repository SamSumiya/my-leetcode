DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'title'
  ) THEN
    ALTER TABLE logs DROP COLUMN title;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE logs DROP COLUMN difficulty;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'tags'
  ) THEN
    ALTER TABLE logs DROP COLUMN tags;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'logs' AND column_name = 'url'
  ) THEN
    ALTER TABLE logs DROP COLUMN url;
  END IF;
END;
$$;
