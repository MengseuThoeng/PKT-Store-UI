# 🚀 Database Setup - Step-by-Step Checklist

Follow these steps in order to set up your database and migrate data:

## ✅ Step 1: Create Supabase Account (5 minutes)

1. [ ] Go to https://supabase.com
2. [ ] Click "Start your project"
3. [ ] Sign up with GitHub or email
4. [ ] Verify your email if needed

## ✅ Step 2: Create New Project (3 minutes)

1. [ ] Click "New Project"
2. [ ] Fill in project details:
   - **Name**: `pkt-store` (or your choice)
   - **Database Password**: Choose strong password (SAVE THIS!)
   - **Region**: Singapore (best for Asia/Cambodia)
   - **Pricing Plan**: Free (perfect for starting)
3. [ ] Click "Create new project"
4. [ ] Wait 2-3 minutes for project setup to complete
5. [ ] You'll see your project dashboard when ready

## ✅ Step 3: Get API Keys (2 minutes)

1. [ ] In your project dashboard, click **Settings** (gear icon bottom left)
2. [ ] Click **API** in the settings menu
3. [ ] Copy these 3 values (you'll need them):

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT**: Keep the `service_role` key SECRET!

## ✅ Step 4: Configure Environment Variables (2 minutes)

1. [ ] Open your project in VS Code
2. [ ] Find the `.env.local` file (create it if it doesn't exist)
3. [ ] Add these lines with YOUR actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Your existing Telegram config
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_GROUP_CHAT_ID=your_telegram_chat_id
```

4. [ ] Save the file
5. [ ] **DO NOT commit `.env.local` to Git!** (it's in .gitignore)

## ✅ Step 5: Run Database Schema (3 minutes)

1. [ ] Go back to Supabase dashboard
2. [ ] Click **SQL Editor** in the left sidebar
3. [ ] Click **New Query**
4. [ ] Open this file in VS Code: `lib/db/schema.sql`
5. [ ] Copy **ALL** the SQL code (Ctrl+A, Ctrl+C)
6. [ ] Paste it in the Supabase SQL Editor
7. [ ] Click **Run** (or press Ctrl+Enter)
8. [ ] Wait for "Success. No rows returned" message
9. [ ] If you see errors, screenshot and ask for help!

## ✅ Step 6: Verify Tables Created (2 minutes)

1. [ ] In Supabase, click **Table Editor** in left sidebar
2. [ ] You should see these tables:
   - [ ] `figures`
   - [ ] `manga`
   - [ ] `plushies`
   - [ ] `customers`
   - [ ] `orders`
   - [ ] `order_items`
   - [ ] `page_views`
   - [ ] `product_views`
   - [ ] `cart_actions`
   - [ ] `admin_users`
   - [ ] `site_settings`

3. [ ] Click on `site_settings` table
4. [ ] You should see 5 rows with initial settings

✅ If you see all tables, you're good!

## ✅ Step 7: Migrate Static Data (2 minutes)

1. [ ] Open terminal in VS Code (Ctrl+`)
2. [ ] Run this command:

```bash
npm run migrate-data
```

3. [ ] You should see:
```
🚀 Starting Data Migration...
✅ Database connection successful
📦 Migrating Figures...
✅ Migrated X figures
📚 Migrating Manga...
✅ Migrated X manga
🧸 Migrating Plushies...
✅ Migrated X plushies
🎉 All data migrated successfully!
```

4. [ ] If you see errors, check:
   - [ ] Is your `.env.local` configured correctly?
   - [ ] Did you restart VS Code after adding env variables?
   - [ ] Are the API keys correct?

## ✅ Step 8: Verify Data in Database (2 minutes)

1. [ ] Go back to Supabase **Table Editor**
2. [ ] Click on `figures` table
3. [ ] You should see all your figure products
4. [ ] Click on `manga` table
5. [ ] You should see all your manga
6. [ ] Click on `plushies` table
7. [ ] You should see all your plushies

✅ If you see data in all tables, SUCCESS! 🎉

---

## 🎯 What's Next?

After completing all steps above:

1. ✅ Database is set up
2. ✅ All data is migrated
3. ⏳ Next: Create API routes to fetch data
4. ⏳ Next: Update components to use API
5. ⏳ Next: Add payment integration

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
- [ ] Check if `.env.local` has correct values
- [ ] Restart VS Code
- [ ] Make sure no spaces in env variable values

### Error: "Missing Supabase credentials"
- [ ] Make sure `.env.local` exists in project root
- [ ] Check variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL`, etc.
- [ ] No quotes around values in .env.local

### Error: "Permission denied"
- [ ] Make sure you're using `service_role` key in `.env.local`
- [ ] Check if you copied the full key (very long string)

### Migration script errors
- [ ] Check that schema.sql ran successfully first
- [ ] Verify tables exist in Supabase Table Editor
- [ ] Try running migration again: `npm run migrate-data`

---

## 📞 Need Help?

If stuck on any step:
1. Take a screenshot of the error
2. Note which step number you're on
3. Check the error message carefully
4. Ask for help with specific details!

---

**Ready?** Let's start with Step 1! ✨
