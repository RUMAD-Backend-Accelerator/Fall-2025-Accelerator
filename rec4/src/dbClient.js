const { Pool } = require('pg')
require('dotenv').config()

// PostgreSQL configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'booksdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
})

// Validate that critical environment variables are set
if (!process.env.DB_PASSWORD) {
    console.warn('Warning: DB_PASSWORD not set in environment variables')
}

// Test connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

module.exports = pool
