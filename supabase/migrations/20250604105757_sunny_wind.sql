/*
  # Caching System for Metaphors and Idioms

  1. New Tables
    - `metaphor_cache`: Stores generated metaphors
    - `idiom_cache`: Stores analyzed idioms and translations
    - `usage_metrics`: Tracks API usage and cache performance

  2. Security
    - Enable RLS on all tables
    - Add policies for read access
    - Restrict write access to authenticated users
*/

-- Metaphor cache table
CREATE TABLE metaphor_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text TEXT NOT NULL,
  tone TEXT NOT NULL,
  metaphor_text TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(input_text, tone)
);

-- Idiom cache table
CREATE TABLE idiom_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase TEXT UNIQUE NOT NULL,
  analysis JSONB NOT NULL,
  translations JSONB,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- Usage metrics table
CREATE TABLE usage_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE DEFAULT CURRENT_DATE,
  total_requests INTEGER DEFAULT 0,
  cache_hits INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE metaphor_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE idiom_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow read access to metaphor cache"
  ON metaphor_cache
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to idiom cache"
  ON idiom_cache
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to usage metrics"
  ON usage_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX idx_metaphor_input ON metaphor_cache(input_text, tone);
CREATE INDEX idx_idiom_phrase ON idiom_cache(phrase);
CREATE INDEX idx_usage_date ON usage_metrics(date);