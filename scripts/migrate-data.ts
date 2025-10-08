// Data Migration Script
// This script migrates static data from TypeScript files to Supabase database

import { createClient } from '@supabase/supabase-js'
import { featuredProducts } from '../lib/data/figure-data'
import { featuredManga } from '../lib/data/manga-data'
import { featuredPlushies } from '../lib/data/plushie-data'
import type { Figure } from '../lib/types/figure'
import type { Manga } from '../lib/types/manga'
import type { Plushie } from '../lib/types/plushie'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateFigures() {
  console.log('📦 Migrating Figures...')
  
  const figuresData = featuredProducts.map((figure: any) => ({
    id: figure.id,
    name: figure.name,
    series: figure.series,
    character: figure.character,
    price: parseFloat(figure.price.toString()),
    original_price: figure.originalPrice ? parseFloat(figure.originalPrice.toString()) : null,
    discount_percentage: 0,
    image: figure.image,
    description: `${figure.name} figure from ${figure.series} series featuring ${figure.character}`,
    stock_count: figure.stockCount || 10,
    rating: figure.rating || 0,
    reviews_count: 0,
    is_featured: true,
    is_new: figure.isNew || false,
    category: 'figure'
  }))

  const { data, error } = await supabase
    .from('figures')
    .upsert(figuresData, { onConflict: 'id' })

  if (error) {
    console.error('❌ Error migrating figures:', error)
    return false
  }

  console.log(`✅ Migrated ${figuresData.length} figures`)
  return true
}

async function migrateManga() {
  console.log('📚 Migrating Manga...')
  
  const mangaData = featuredManga.map((manga: any) => ({
    id: manga.id,
    title: manga.title,
    author: manga.author,
    publisher: 'Various Publishers',
    price: parseFloat(manga.price.toString()),
    original_price: manga.originalPrice ? parseFloat(manga.originalPrice.toString()) : null,
    discount_percentage: 0,
    image: manga.image,
    description: `${manga.title} by ${manga.author}. ${manga.genre?.join(', ')}`,
    stock_count: manga.stockCount || 10,
    rating: manga.rating || 0,
    reviews_count: 0,
    volume: manga.volumes || 1,
    genre: manga.genre || [],
    status: manga.status || 'available',
    is_featured: true,
    is_new: false,
    category: 'manga'
  }))

  const { data, error } = await supabase
    .from('manga')
    .upsert(mangaData, { onConflict: 'id' })

  if (error) {
    console.error('❌ Error migrating manga:', error)
    return false
  }

  console.log(`✅ Migrated ${mangaData.length} manga`)
  return true
}

async function migratePlushies() {
  console.log('🧸 Migrating Plushies...')
  
  const plushiesData = featuredPlushies.map((plushie: any) => ({
    id: plushie.id,
    name: plushie.name,
    character: plushie.character,
    series: plushie.series || 'Various',
    price: parseFloat(plushie.price.toString()),
    original_price: plushie.originalPrice ? parseFloat(plushie.originalPrice.toString()) : null,
    discount_percentage: 0,
    image: plushie.image,
    description: `${plushie.name} plushie featuring ${plushie.character}`,
    stock_count: plushie.stockCount || 10,
    rating: plushie.rating || 0,
    reviews_count: 0,
    size: plushie.size || 'Medium',
    material: plushie.material || 'Soft Plush',
    is_featured: true,
    is_new: plushie.isNew || false,
    category: 'plushie'
  }))

  const { data, error } = await supabase
    .from('plushies')
    .upsert(plushiesData, { onConflict: 'id' })

  if (error) {
    console.error('❌ Error migrating plushies:', error)
    return false
  }

  console.log(`✅ Migrated ${plushiesData.length} plushies`)
  return true
}

async function runMigration() {
  console.log('\n🚀 Starting Data Migration...\n')
  
  try {
    // Test connection
    const { data, error } = await supabase.from('site_settings').select('*').limit(1)
    if (error) {
      console.error('❌ Cannot connect to database. Please check your credentials.')
      console.error(error)
      process.exit(1)
    }
    console.log('✅ Database connection successful\n')

    // Run migrations
    const figuresSuccess = await migrateFigures()
    const mangaSuccess = await migrateManga()
    const plushiesSuccess = await migratePlushies()

    console.log('\n📊 Migration Summary:')
    console.log('─────────────────────')
    console.log(`Figures: ${figuresSuccess ? '✅ Success' : '❌ Failed'}`)
    console.log(`Manga: ${mangaSuccess ? '✅ Success' : '❌ Failed'}`)
    console.log(`Plushies: ${plushiesSuccess ? '✅ Success' : '❌ Failed'}`)
    console.log('─────────────────────\n')

    if (figuresSuccess && mangaSuccess && plushiesSuccess) {
      console.log('🎉 All data migrated successfully!')
      console.log('\n✅ Next steps:')
      console.log('1. Check your Supabase dashboard to verify data')
      console.log('2. Create API routes to fetch data')
      console.log('3. Update components to use API instead of static data\n')
    } else {
      console.log('⚠️  Some migrations failed. Please check the errors above.')
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()
