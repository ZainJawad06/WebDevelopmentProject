// src/supabaseClient.js
// Initializes and exports the Supabase client used for database operations across the app.

import { createClient } from '@supabase/supabase-js';

// Project URL and public anon key. Safe to be public because Row Level Security controls access.
const supabaseUrl = 'https://hsztbpkulujygxlaquxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzenRicGt1bHVqeWd4bGFxdXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MTAxNzQsImV4cCI6MjEwNjk4NjE3NH0.0KMFEwFgEhUmMrlYeSonyG409BfvUSSBB7bI9G4IvpY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
