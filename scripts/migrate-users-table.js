const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL || '';
const sql = neon(databaseUrl);

async function migrate() {
  console.log('Migrating users table columns in Neon DB...');
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS company TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS gstnumber TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS invoiceprefix TEXT DEFAULT 'INV';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultterms TEXT DEFAULT 'Payment due within 30 days';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultnotes TEXT DEFAULT 'Thank you for your business!';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultgstrate NUMERIC DEFAULT 18;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaulttaxrate NUMERIC DEFAULT 0;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS emailnotifications BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reminderemails BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reminderdays INTEGER DEFAULT 7;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS autogeneratenumbers BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aiprovider TEXT DEFAULT 'gemini';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aiapikey TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aimodel TEXT DEFAULT 'gemini-2.0-flash';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aibaseurl TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS createdat TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updatedat TEXT;`;

    console.log('✅ Users table migration successful! All columns verified & added.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}

migrate();
