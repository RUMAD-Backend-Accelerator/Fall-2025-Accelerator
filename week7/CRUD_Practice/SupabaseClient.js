require('dotenv').config()

// This is your SupabaseClient file. We have already initialized your client but you need to populate your .env
// for this to work.

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_DOMAIN,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = { supabase } 