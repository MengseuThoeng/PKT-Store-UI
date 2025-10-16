# Supabase Storage Setup for Product Images

## 📦 Create Storage Bucket

1. **Go to Supabase Dashboard** → Your Project
2. **Click "Storage"** in the left sidebar
3. **Click "New Bucket"**
4. **Enter details:**
   - Name: `products`
   - Public bucket: ✅ **YES** (checked)
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

5. **Click "Create Bucket"**

---

## 🔐 Set Bucket Policies (Public Access)

After creating the bucket, set up policies to allow public read access:

1. **Click on "products" bucket**
2. **Go to "Policies" tab**
3. **Click "New Policy"**
4. **Select "For full customization"**
5. **Create these policies:**

### **Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );
```

### **Policy 2: Admin Upload Access**
```sql
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

### **Policy 3: Admin Update Access**
```sql
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);
```

### **Policy 4: Admin Delete Access**
```sql
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);
```

---

## 📁 Folder Structure

Images will be stored with this naming pattern:
```
products/
  ├── figure-1697456789123-abc123.jpg
  ├── manga-1697456790456-def456.png
  └── plushie-1697456791789-ghi789.webp
```

Format: `{type}-{timestamp}-{random}.{extension}`

---

## 🔗 Public URL Format

After upload, images will be accessible at:
```
https://{project-ref}.supabase.co/storage/v1/object/public/products/{filename}
```

Example:
```
https://abcdefghijklmnop.supabase.co/storage/v1/object/public/products/figure-1697456789123-abc123.jpg
```

---

## ✅ Test Upload

1. Go to `/admin/products/add`
2. Select an image file
3. Upload should show:
   - ✅ "Image uploaded successfully"
   - URL stored in database
   - Image displayed in preview

---

## 🐛 Troubleshooting

### **Error: "Bucket not found"**
- Make sure you created the `products` bucket
- Check bucket name is exactly `products` (lowercase)

### **Error: "new row violates row-level security policy"**
- Set up the policies above
- Make sure bucket is marked as "public"

### **Error: "Storage upload error"**
- Check file size < 5MB
- Check file type is image (jpeg, png, webp, gif)
- Check MIME type settings in bucket

### **Error: "Unauthorized"**
- Make sure you're logged in as admin
- Check `is_admin = true` in customers table

---

## 📊 Database Schema Update

Since we're now storing URLs instead of base64, you can keep VARCHAR(500) for image columns:

```sql
-- URLs are much shorter than base64
-- Example: https://proj.supabase.co/storage/v1/object/public/products/file.jpg
-- Length: ~80 characters

-- No need to change to TEXT!
-- VARCHAR(500) is perfect for URLs
```

---

## 🎯 Benefits

✅ **Smaller database** - URLs instead of huge base64 strings
✅ **Faster queries** - Less data to transfer
✅ **Better performance** - Images served from CDN
✅ **Easy management** - View/delete files in Supabase dashboard
✅ **Proper storage** - Designed for file hosting

---

## 🚀 Ready to Use!

After setting up the storage bucket and policies, the upload system will work automatically:
1. User selects image
2. Image uploads to Supabase Storage
3. Public URL returned
4. URL saved to database
5. Image displays on frontend

**Much better than base64!** 🎉
