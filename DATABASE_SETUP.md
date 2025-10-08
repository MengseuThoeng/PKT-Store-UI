# PKT Store - Database Setup Guide

## 🚀 Step-by-Step Setup Instructions

### Step 1: Create Supabase Account & Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up** with your GitHub account or email
3. **Create a new project**:
   - Project name: `pkt-store` (or your choice)
   - Database Password: Choose a strong password (save it!)
   - Region: Choose closest to your users (Singapore for Asia)
   - Click "Create new project"
   - Wait 2-3 minutes for setup

### Step 2: Get Your API Keys

1. In your Supabase project dashboard
2. Go to **Settings** (gear icon) → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (another long string, keep this SECRET!)

### Step 3: Update Environment Variables

1. Open your `.env.local` file in the project root
2. Add these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Replace the placeholder values with your actual keys
4. **NEVER commit `.env.local` to Git!** (already in .gitignore)

### Step 4: Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file: `lib/db/schema.sql`
4. **Copy all the SQL code**
5. **Paste it** into the Supabase SQL Editor
6. Click **Run** button
7. You should see success messages

### Step 5: Verify Tables Created

1. In Supabase, go to **Table Editor**
2. You should see these tables:
   - ✅ figures
   - ✅ manga
   - ✅ plushies
   - ✅ customers
   - ✅ orders
   - ✅ order_items
   - ✅ page_views
   - ✅ product_views
   - ✅ cart_actions
   - ✅ admin_users
   - ✅ site_settings

### Step 6: Import Initial Data

We'll create a script to migrate your existing static data to the database.

Run:
```bash
npm run migrate-data
```

This will populate your database with all the products from your static files.

---

## 🔧 Next Steps After Setup

1. ✅ Database created
2. ✅ API keys configured
3. ✅ Schema deployed
4. ⏳ Migrate static data (next step)
5. ⏳ Create API routes
6. ⏳ Update components to fetch from DB

---

## 📊 Database Structure Overview

### Products Tables
- **figures**: Anime figures with series, character, pricing
- **manga**: Manga books with author, genre, volume info
- **plushies**: Plushies with size, material, character

### Order Management
- **customers**: Customer information
- **orders**: Order headers with totals, status
- **order_items**: Individual items in each order

### Analytics
- **page_views**: Track page visits
- **product_views**: Track product detail views
- **cart_actions**: Track add-to-cart events

### Admin
- **admin_users**: Admin authentication
- **site_settings**: Configuration settings

---

## 🔐 Security Notes

- ✅ Service role key is SECRET - never expose in client code
- ✅ Use anon key for client-side operations
- ✅ Set up Row Level Security (RLS) policies for production
- ✅ Enable RLS on sensitive tables

---

## 🆘 Troubleshooting

**Issue**: Can't connect to database
- ✅ Check if API keys are correct in `.env.local`
- ✅ Restart your dev server after adding env variables
- ✅ Verify project URL is correct

**Issue**: Tables not created
- ✅ Check SQL editor for error messages
- ✅ Make sure you ran the entire schema.sql file
- ✅ Try running sections separately if needed

**Issue**: Permission denied
- ✅ Check if you're using the correct API key
- ✅ Verify RLS policies if enabled

---

## 📞 Support

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Review error messages in browser console
3. Check Supabase logs in dashboard

---

**Ready to continue?** After completing these steps, we'll:
1. Create data migration script
2. Build API routes
3. Update components to use real data
