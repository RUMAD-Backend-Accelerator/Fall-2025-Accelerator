require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const domain = process.env.SUPABASE_DOMAIN;
const supabase_public_key = process.env.SUPABASE_PUBLIC_KEY;

const supabase = createClient(domain, supabase_public_key);