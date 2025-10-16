# 🔧 Fix: Duplicate Key Error - ID Sequence Out of Sync

## 🐛 **Problem:**

**Error:**
```
duplicate key value violates unique constraint "figures_pkey"
Key (id)=(1) already exists.
```

**Root Cause:**
The auto-increment sequence for the `id` column is out of sync. This usually happens when:
1. Records were manually inserted with specific IDs
2. Records were imported from another database
3. The sequence was not updated after bulk operations
4. Database was reset but sequence wasn't

---

## ✅ **Solution:**

Reset the sequence to the correct next value for all product tables.

---

## 📝 **How to Fix:**

### **Step 1: Run SQL Script**

Open **Supabase SQL Editor** and run this:

```sql
-- Fix figures table sequence
SELECT setval(
  pg_get_serial_sequence('figures', 'id'),
  COALESCE((SELECT MAX(id) FROM figures), 0) + 1,
  false
);

-- Fix manga table sequence
SELECT setval(
  pg_get_serial_sequence('manga', 'id'),
  COALESCE((SELECT MAX(id) FROM manga), 0) + 1,
  false
);

-- Fix plushies table sequence
SELECT setval(
  pg_get_serial_sequence('plushies', 'id'),
  COALESCE((SELECT MAX(id) FROM plushies), 0) + 1,
  false
);
```

**Or run the file I created:**
- File: `script/fix-id-sequence.sql`
- Just copy and paste into Supabase SQL Editor

### **Step 2: Verify Fix**

Run this to check sequences:

```sql
SELECT 
    'figures' as table_name,
    MAX(id) as max_id,
    (SELECT last_value FROM figures_id_seq) as next_id
FROM figures
UNION ALL
SELECT 
    'manga' as table_name,
    MAX(id) as max_id,
    (SELECT last_value FROM manga_id_seq) as next_id
FROM manga
UNION ALL
SELECT 
    'plushies' as table_name,
    MAX(id) as max_id,
    (SELECT last_value FROM plushies_id_seq) as next_id
FROM plushies;
```

**Expected Result:**
```
table_name  | max_id | next_id
------------|--------|--------
figures     |    5   |    6
manga       |    3   |    4
plushies    |    7   |    8
```

The `next_id` should be `max_id + 1` for each table.

### **Step 3: Test Product Creation**

1. Go to `/admin/products/add`
2. Create a new product
3. Should work without error! ✅

---

## 🔍 **What the SQL Does:**

### **`setval()` Function:**
```sql
setval(sequence_name, next_value, is_called)
```

- `pg_get_serial_sequence('figures', 'id')` - Gets the sequence name
- `COALESCE((SELECT MAX(id) FROM figures), 0) + 1` - Gets the next available ID
- `false` - Don't mark sequence as "called" yet

### **Example:**
If `figures` table has records with IDs: 1, 2, 3, 5, 10

Then:
- `MAX(id)` = 10
- Next value = 11
- Sequence will use: 11, 12, 13, 14...

---

## 🎯 **Why This Happens:**

### **Common Causes:**

1. **Manual ID insertion:**
```sql
INSERT INTO figures (id, name, series, ...) VALUES (1, 'Naruto', ...);
-- Sequence not updated! Still at 0
```

2. **Bulk import:**
```sql
COPY figures FROM 'products.csv';
-- IDs 1-100 inserted, but sequence still at 0
```

3. **Database reset:**
```sql
TRUNCATE figures RESTART IDENTITY;
-- Table cleared, but sequence reset to 1
-- If you then insert records with IDs, sequence won't update
```

---

## ✅ **Prevention:**

### **Always let PostgreSQL handle IDs:**

**Good (Auto-increment):**
```sql
INSERT INTO figures (name, series, character, ...)
VALUES ('Naruto', 'Naruto', 'Uzumaki', ...);
-- ID assigned automatically ✅
```

**Bad (Manual ID):**
```sql
INSERT INTO figures (id, name, series, ...)
VALUES (1, 'Naruto', 'Naruto', ...);
-- Don't do this! ❌
```

### **After bulk operations:**

Always reset sequence:
```sql
-- After import
SELECT setval('figures_id_seq', (SELECT MAX(id) FROM figures) + 1);
```

---

## 🧪 **Testing:**

### **Before Fix:**
```bash
# Try to create product
POST /api/admin/products
❌ Error: duplicate key value violates unique constraint "figures_pkey"
```

### **After Fix:**
```bash
# Try to create product
POST /api/admin/products
✅ Success: Product created with ID=6
```

---

## 📊 **Check Your Data:**

### **See all IDs in use:**
```sql
SELECT id, name FROM figures ORDER BY id;
SELECT id, title FROM manga ORDER BY id;
SELECT id, name FROM plushies ORDER BY id;
```

### **Find gaps in IDs:**
```sql
SELECT 
    id,
    id - LAG(id) OVER (ORDER BY id) AS gap
FROM figures
WHERE id - LAG(id) OVER (ORDER BY id) > 1;
```

---

## 🚀 **Ready to Fix!**

1. **Run** `script/fix-id-sequence.sql` in Supabase SQL Editor
2. **Verify** sequences are correct
3. **Test** creating a new product
4. **Should work** perfectly! ✅

**No more duplicate key errors!** 🎉
