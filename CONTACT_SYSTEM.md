# Nexora Contact Lead System

This project now includes a production-style contact lead flow:

- Public contact form posts to Netlify Forms in production and `POST /api/leads` during local Express development
- Leads are saved in PostgreSQL
- Site owner receives an email through Nodemailer
- React admin dashboard is available at `/admin/leads`
- Dashboard supports status filters, search, total count, and status updates

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create `.env` from `.env.example` and update:

   ```bash
   DATABASE_URL=postgresql://postgres:postgres@your-database-host:5432/nexora_portfolio
   OWNER_EMAIL=hello.nexora26@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-smtp-user@example.com
   SMTP_PASS=your-smtp-password
   ADMIN_API_KEY=change-this-admin-key
   ```

3. Create the database in PostgreSQL, then run the migration:

   ```bash
   npm run migrate --prefix server
   ```

4. Build the React admin dashboard:

   ```bash
   npm run build:admin
   ```

5. Start the Express server:

   ```bash
   npm start
   ```

The portfolio will be served from the configured Express host.
The leads dashboard will be available at `/admin/leads`.

## Admin Access

Open `/admin/leads` and paste the `ADMIN_API_KEY` value from `.env`. The key is sent as `x-admin-api-key` for dashboard API calls.

## Lead Statuses

Supported lead statuses are:

- `New`
- `Contacted`
- `Closed`
