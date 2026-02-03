-- SQL Migration to make password optional for OAuth users
-- Run this in your Supabase SQL Editor

ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
