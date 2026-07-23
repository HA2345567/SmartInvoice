const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jy7RdpHvbqZ5@ep-royal-butterfly-ay7k3tn8-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(databaseUrl);

async function initDb() {
  console.log('Connecting to Neon DB and initializing schema...');
  try {
    // 1. Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        company TEXT,
        address TEXT,
        phone TEXT,
        gstnumber TEXT,
        currency TEXT DEFAULT 'USD',
        invoiceprefix TEXT DEFAULT 'INV',
        defaultterms TEXT DEFAULT 'Payment due within 30 days',
        defaultnotes TEXT DEFAULT 'Thank you for your business!',
        defaultgstrate NUMERIC DEFAULT 18,
        defaulttaxrate NUMERIC DEFAULT 0,
        emailnotifications BOOLEAN DEFAULT true,
        reminderemails BOOLEAN DEFAULT true,
        reminderdays INTEGER DEFAULT 7,
        autogeneratenumbers BOOLEAN DEFAULT true,
        avatar TEXT,
        createdat TEXT,
        updatedat TEXT
      );
    `;
    console.log('✅ Users table ready');

    // 2. Clients table
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        userid TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        address TEXT,
        gstnumber TEXT,
        currency TEXT DEFAULT 'USD',
        isactive BOOLEAN DEFAULT true,
        createdat TEXT,
        updatedat TEXT
      );
    `;
    console.log('✅ Clients table ready');

    // 3. Invoices table
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        userid TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invoicenumber TEXT NOT NULL,
        clientid TEXT REFERENCES clients(id) ON DELETE SET NULL,
        clientname TEXT NOT NULL,
        clientemail TEXT NOT NULL,
        clientcompany TEXT,
        clientaddress TEXT,
        clientgst TEXT,
        clientcurrency TEXT DEFAULT 'USD',
        amount NUMERIC DEFAULT 0,
        subtotal NUMERIC DEFAULT 0,
        taxamount NUMERIC DEFAULT 0,
        discountamount NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'draft',
        date TEXT,
        duedate TEXT,
        paiddate TEXT,
        paymentmethod TEXT,
        paymentnotes TEXT,
        items JSONB,
        notes TEXT,
        terms TEXT,
        taxrate NUMERIC DEFAULT 0,
        discountrate NUMERIC DEFAULT 0,
        paymentlink TEXT,
        emailsent BOOLEAN DEFAULT false,
        reminderssent INTEGER DEFAULT 0,
        lastremindersent TEXT,
        createdat TEXT,
        updatedat TEXT
      );
    `;
    console.log('✅ Invoices table ready');

    // 4. Feedback table
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        type TEXT,
        rating INTEGER,
        title TEXT,
        description TEXT,
        email TEXT,
        category TEXT,
        created_at TEXT
      );
    `;
    console.log('✅ Feedback table ready');

    console.log('\n🎉 Neon Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing Neon DB:', error);
    process.exit(1);
  }
}

initDb();
