/**
 * Auth.js — Authentication Service Layer
 *
 * This file is responsible for all communication with Supabase Auth.
 * Your Express routes call the functions in this file.
 *
 * Students:
 *  - You will write the logic that talks to Supabase here.
 *  - This file should NOT handle HTTP responses. Only return data or throw errors.
 *  - Do NOT modify the function names or signatures.
 *
 * What you will implement:
 *  - signUpUser(email, password)   → create a new user
 *  - signInUser(email, password)   → log a user in and return their session/token
 *  - signOutUser()                 → log a user out
 *
 * Helpful hints:
 *  - Import your Supabase client from SupabaseClient.js
 *  - Use supabase.auth.signUp(), signInWithPassword(), and signOut()
 *  - Each function should:
 *      1. Log what operation you’re doing
 *      2. Call the Supabase API
 *      3. Return the data OR throw the error
 */

const { supabase } = require('../SupabaseClient');

// ===============================================================
// SIGN UP USER
// ===============================================================
async function signUpUser(email, password) {
  console.log(`\n--- Attempting Sign Up for ${email} ---`);

  /**
   * TODO:
   * 1. Call supabase.auth.signUp({ email, password }, options)
   * 2. The "options" should include an emailRedirectTo URL (after confirming email)
   *    Only worry about this if you have confirm email on in Supabase Auth Settings.
   * 3. If there is an error: throw it
   * 4. Otherwise return the user/session data
   */

  // Example structure:
  // const { data, error } = await supabase.auth.signUp(...);
  // if (error) throw error;
  // return data;
}

// ===============================================================
// SIGN IN USER
// ===============================================================
async function signInUser(email, password) {
  console.log(`\n--- Attempting Sign In for ${email} ---`);

  /**
   * TODO:
   * 1. Call supabase.auth.signInWithPassword({ email, password })
   * 2. If there's an error, throw it
   * 3. Return the session so the Express route can access the token
   *
   * Tip:
   *   data.session contains:
   *     - access_token
   *     - refresh_token
   *     - user info
   */

  // Example structure:
  // const { data, error } = await supabase.auth.signInWithPassword(...);
  // if (error) throw error;
  // return data.session;
}

// ===============================================================
// SIGN OUT USER
// ===============================================================
async function signOutUser() {
  console.log("\n--- Attempting Sign Out ---");

  /**
   * TODO:
   * 1. Call supabase.auth.signOut()
   * 2. If there's an error, throw it
   * 3. Otherwise return something (true or a message)
   */

  // Example:
  // const { error } = await supabase.auth.signOut();
  // if (error) throw error;
}

module.exports = { signUpUser, signInUser, signOutUser };
