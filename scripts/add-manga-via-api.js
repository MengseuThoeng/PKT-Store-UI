// Quick script to add manga products via API
// Run this in browser console on /admin/products page

const mangaProducts = [
  {
    name: 'One Piece Vol. 1',
    description: 'Join Monkey D. Luffy as he begins his quest to become King of the Pirates!',
    price: 9.99,
    stock_count: 50,
    type: 'manga',
    image_url: '/manga/one-piece-1.jpg',
    is_featured: true
  },
  {
    name: 'Naruto Vol. 1',
    description: 'The story of Naruto Uzumaki, a young ninja who seeks recognition!',
    price: 8.99,
    stock_count: 45,
    type: 'manga',
    image_url: '/manga/naruto-1.jpg',
    is_featured: true
  },
  {
    name: 'Attack on Titan Vol. 1',
    description: 'Humanity fights for survival against man-eating Titans!',
    price: 10.99,
    stock_count: 30,
    type: 'manga',
    image_url: '/manga/aot-1.jpg',
    is_featured: true
  },
  {
    name: 'My Hero Academia Vol. 1',
    description: 'Izuku Midoriya dreams of becoming a hero in a world of superpowers!',
    price: 9.99,
    stock_count: 40,
    type: 'manga',
    image_url: '/manga/mha-1.jpg',
    is_featured: false
  },
  {
    name: 'Demon Slayer Vol. 1',
    description: 'Tanjiro becomes a demon slayer to save his sister!',
    price: 9.99,
    stock_count: 35,
    type: 'manga',
    image_url: '/manga/demon-slayer-1.jpg',
    is_featured: true
  }
];

// Add each manga
async function addManga() {
  for (const manga of mangaProducts) {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manga)
      });
      const data = await response.json();
      console.log(`✅ Added: ${manga.name}`, data);
    } catch (error) {
      console.error(`❌ Failed to add ${manga.name}:`, error);
    }
  }
  console.log('🎉 Done! Refresh the page.');
}

// Run it
addManga();
