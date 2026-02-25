-- Add new columns to tours table
-- Run this SQL in Supabase SQL Editor (Database → SQL Editor)

ALTER TABLE tours
ADD COLUMN itinerary TEXT DEFAULT '',
ADD COLUMN specialities TEXT DEFAULT '',
ADD COLUMN included TEXT DEFAULT '',
ADD COLUMN requirements TEXT DEFAULT '';

-- Verify the columns were added
SELECT * FROM information_schema.columns 
WHERE table_name = 'tours' 
AND column_name IN ('itinerary', 'specialities', 'included', 'requirements');
