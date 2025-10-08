# PKT Store - API Documentation

## Overview

The PKT Store API provides endpoints to manage and retrieve product data from the Supabase database.

## Base URL

```
Development: http://localhost:3000
Production: https://pkt-store.vercel.app
```

---

## Product Endpoints

### 1. Get All Figures

**Endpoint:** `GET /api/products/figures`

**Query Parameters:**
- `featured` (boolean, optional) - Filter featured products only
- `limit` (number, optional) - Limit the number of results

**Example Requests:**
```bash
# Get all figures
GET /api/products/figures

# Get featured figures only
GET /api/products/figures?featured=true

# Get first 4 figures
GET /api/products/figures?limit=4

# Get first 4 featured figures
GET /api/products/figures?featured=true&limit=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Luffy Gear 5",
      "series": "One Piece",
      "character": "Monkey D. Luffy",
      "price": 45.99,
      "originalPrice": 59.99,
      "image": "/figures/luffy.png",
      "stockCount": 10,
      "rating": 4.8,
      "isNew": true,
      "category": "figure"
    }
  ],
  "count": 1
}
```

---

### 2. Get All Manga

**Endpoint:** `GET /api/products/manga`

**Query Parameters:**
- `featured` (boolean, optional) - Filter featured products only
- `limit` (number, optional) - Limit the number of results

**Example Requests:**
```bash
# Get all manga
GET /api/products/manga

# Get featured manga only
GET /api/products/manga?featured=true&limit=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "One Piece",
      "author": "Eiichiro Oda",
      "price": 9.99,
      "originalPrice": 12.99,
      "image": "/manga/op.jpg",
      "stockCount": 10,
      "rating": 4.9,
      "volumes": 100,
      "genre": ["Action", "Adventure"],
      "status": "ongoing",
      "category": "manga"
    }
  ],
  "count": 1
}
```

---

### 3. Get All Plushies

**Endpoint:** `GET /api/products/plushies`

**Query Parameters:**
- `featured` (boolean, optional) - Filter featured products only
- `limit` (number, optional) - Limit the number of results

**Example Requests:**
```bash
# Get all plushies
GET /api/products/plushies

# Get featured plushies only
GET /api/products/plushies?featured=true&limit=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pikachu Plushie",
      "character": "Pikachu",
      "series": "Pokemon",
      "price": 19.99,
      "image": "/plushie/pikachu.jpg",
      "stockCount": 10,
      "rating": 4.7,
      "size": "Medium",
      "material": "Soft Plush",
      "isNew": true,
      "category": "plushie"
    }
  ],
  "count": 1
}
```

---

### 4. Get All Products (Combined)

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `type` (string, optional) - Filter by type: `figure`, `manga`, `plushie`, or `all`
- `featured` (boolean, optional) - Filter featured products only
- `limit` (number, optional) - Limit the number of results

**Example Requests:**
```bash
# Get all products
GET /api/products

# Get only figures
GET /api/products?type=figure

# Get all featured products
GET /api/products?featured=true

# Get first 10 products
GET /api/products?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    // Mixed array of figures, manga, and plushies
  ],
  "count": 10
}
```

---

## Client-Side Usage

### Using the Helper Functions

```typescript
import { fetchFigures, fetchManga, fetchPlushies, fetchAllProducts } from '@/lib/api/products'

// In your component
const figures = await fetchFigures({ featured: true, limit: 4 })
const manga = await fetchManga({ featured: true })
const plushies = await fetchPlushies({ limit: 8 })
const allProducts = await fetchAllProducts({ type: 'all' })
```

### Using fetch directly

```typescript
// Client component
"use client"

const [products, setProducts] = useState([])

useEffect(() => {
  fetch('/api/products/figures?featured=true&limit=4')
    .then(res => res.json())
    .then(data => setProducts(data.data))
}, [])
```

### Server component

```typescript
// Server component (recommended for SEO)
export default async function Page() {
  const figures = await fetchFigures({ featured: true, limit: 4 })
  
  return (
    <div>
      {figures.map(figure => (
        <ProductCard key={figure.id} product={figure} />
      ))}
    </div>
  )
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information (in development)"
}
```

### Common Error Codes

- `500` - Internal server error
- `404` - Product not found
- `400` - Bad request (invalid parameters)

---

## Caching & Revalidation

- API routes use `force-dynamic` to always fetch fresh data
- Helper functions use Next.js cache with 60-second revalidation
- You can adjust revalidation time in `lib/api/products.ts`

---

## Database Schema

### Figures Table
- `id` - Integer (Primary Key)
- `name` - String
- `series` - String
- `character` - String
- `price` - Decimal
- `original_price` - Decimal (nullable)
- `image` - String
- `stock_count` - Integer
- `rating` - Decimal
- `is_featured` - Boolean
- `is_new` - Boolean

### Manga Table
- `id` - Integer (Primary Key)
- `title` - String
- `author` - String
- `price` - Decimal
- `original_price` - Decimal (nullable)
- `image` - String
- `stock_count` - Integer
- `rating` - Decimal
- `volume` - Integer
- `genre` - String Array
- `status` - String
- `is_featured` - Boolean

### Plushies Table
- `id` - Integer (Primary Key)
- `name` - String
- `character` - String
- `series` - String
- `price` - Decimal
- `original_price` - Decimal (nullable)
- `image` - String
- `stock_count` - Integer
- `rating` - Decimal
- `size` - String
- `material` - String
- `is_featured` - Boolean
- `is_new` - Boolean

---

## Next Steps

1. ✅ API routes created
2. ⏳ Update components to use API
3. ⏳ Add product detail endpoints
4. ⏳ Add order creation endpoints
5. ⏳ Add admin endpoints (CRUD operations)
