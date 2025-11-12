// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifuhytgpjoxdgorfqppg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdWh5dGdwam94ZGdvcmZxcHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjUyMjcsImV4cCI6MjA3ODU0MTIyN30.N7Zv9PxffPHA2I-pcOmQ9cWs3dyV4aiiL5uZW9HtU6k';
export const supabase = createClient(supabaseUrl, supabaseKey);