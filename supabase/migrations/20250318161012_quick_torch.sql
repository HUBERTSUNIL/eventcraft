/*
  # Fix Events Table Policies

  1. Changes
    - Drop existing policies that may cause recursion
    - Create new, simplified policies for events table
    - Maintain security while avoiding circular references

  2. Security
    - Users can view events they created or are invited to
    - Users can only create/update/delete their own events
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can view events they created or are invited to" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Create new simplified policies
CREATE POLICY "Enable read access for own events"
  ON events FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    id IN (
      SELECT event_id 
      FROM event_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Enable insert for authenticated users"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Enable update for event owners"
  ON events FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Enable delete for event owners"
  ON events FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());