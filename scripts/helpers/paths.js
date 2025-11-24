/**
 * paths.js
 * Centralized path utilities for JavaScript scripts
 * 
 * Provides:
 * - ROOT_DIR: Absolute path to repository root
 * - SCRIPTS_DIR: Absolute path to scripts directory
 * - HELPERS_DIR: Absolute path to scripts/helpers directory
 * 
 * Usage:
 *   const { ROOT_DIR, SCRIPTS_DIR, HELPERS_DIR } = require('./helpers/paths');
 *   // or from helpers directory:
 *   const { ROOT_DIR, SCRIPTS_DIR, HELPERS_DIR } = require('./paths');
 */

const path = require('path');

// Determine directory structure based on where this file is located
// This file should be in scripts/helpers/
const HELPERS_DIR = __dirname;
const SCRIPTS_DIR = path.dirname(HELPERS_DIR);
const ROOT_DIR = path.dirname(SCRIPTS_DIR);

module.exports = {
  ROOT_DIR,
  SCRIPTS_DIR,
  HELPERS_DIR
};
