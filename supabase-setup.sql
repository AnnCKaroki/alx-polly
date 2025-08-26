Here is the SQL code to create the tables and policies in your Supabase project. Please run these statements in the Supabase SQL editor.

**SQL for creating tables:**

```sql
-- Create the polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create the options table
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE
);

-- Create the votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID REFERENCES options(id) ON DELETE CASCADE,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (poll_id, user_id)
);
```

**SQL for creating policies:**

```sql
-- Enable RLS for all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for the polls table
CREATE POLICY "Allow authenticated users to create polls" ON polls FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow all users to view polls" ON polls FOR SELECT USING (true);

-- Policies for the options table
CREATE POLICY "Allow all users to view options" ON options FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create options" ON options FOR INSERT TO authenticated WITH CHECK (true);

-- Policies for the votes table
CREATE POLICY "Allow authenticated users to create votes" ON votes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow all users to view votes" ON votes FOR SELECT USING (true);
```

After running these SQL statements, the application should be able to create and view polls successfully. I will also remove the `console.log` statements from the `app/polls/actions.ts` file.