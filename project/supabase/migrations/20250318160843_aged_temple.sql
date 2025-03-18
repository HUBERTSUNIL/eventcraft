/*
  # Add reminder field to events table

  1. Changes
    - Add `reminder` boolean column to `events` table with default value of false

  2. Notes
    - This allows users to set reminders for their events
    - The reminder field will be used by the frontend to display reminder indicators
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'reminder'
  ) THEN
    ALTER TABLE events ADD COLUMN reminder boolean DEFAULT false;
  END IF;
END $$;