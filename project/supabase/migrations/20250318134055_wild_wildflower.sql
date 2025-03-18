/*
  # Initial Schema for Collaborative Calendar

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
    
    - `event_participants`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references auth.users)
      - `status` (text) - Can be 'pending', 'accepted', 'declined'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Event participants table
CREATE TABLE event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view events they created or are invited to"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_id = events.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for event_participants
CREATE POLICY "Event creators can manage participants"
  ON event_participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE id = event_participants.event_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view their own participant status"
  ON event_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own participant status"
  ON event_participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());