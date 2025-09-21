-- Initialize Eternal Calendar NFT Database
-- This script runs when the PostgreSQL container starts

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE eternal_calendar'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eternal_calendar')\gexec

-- Connect to the database
\c eternal_calendar;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- (Tables will be created by SQLAlchemy, but we can add indexes here)

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE eternal_calendar TO postgres;
