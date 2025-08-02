# 🌸 PKT Store - Anime Merchandise E-commerce

A beautiful, modern e-commerce website for anime merchandise built with Next.js 15, TypeScript, and Tailwind CSS. Features a stunning pink theme and showcases anime figures, manga, and plushies.

![PKT Store Banner](https://via.placeholder.com/1200x400/f472b6/ffffff?text=PKT+Store+-+Your+Anime+Paradise)

## ✨ Features

### 🎨 **Beautiful UI/UX**
- Modern pink gradient theme throughout
- Responsive design for all devices
- Smooth animations and hover effects
- Glass-morphism effects and shadows
- Professional component architecture

### 🛍️ **Product Showcase**
- **Anime Figures** - Premium collectible figures
- **Manga Collection** - Latest chapters and series
- **Adorable Plushies** - Soft and cuddly companions
- Product cards with ratings, pricing, and wishlist
- Image hover effects and quick preview

### 🎠 **Interactive Components**
- Full-screen hero carousel with auto-play
- Navigation with dropdown menus
- Search functionality with filters
- Shopping cart and wishlist system
- Customer testimonials section

### 📞 **Customer Experience**
- Contact form with validation
- Interactive Google Maps integration
- FAQ section for common questions
- Newsletter subscription
- Social media integration

### 🎯 **Modern Features**
- TypeScript for type safety
- Server Components and Client Components
- Responsive grid layouts
- Loading states and animations
- SEO optimized structure

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Image Handling:** Next.js Image Optimization
- **Carousel:** Keen Slider
- **Animations:** CSS Transitions & Keyframes

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/pkt-store.git
   cd pkt-store
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
pkt-store/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── featured-figures.tsx
│   ├── featured-manga.tsx
│   ├── featured-plushies.tsx
│   ├── hero-carousel.tsx
│   ├── navbar.tsx
│   ├── testimonials.tsx
│   ├── contact-us.tsx
│   └── footer.tsx
├── data/                 # Static data
│   ├── manga-data.ts
│   ├── product-data.ts
│   ├── plushie-data.ts
│   ├── testimonial-data.ts
│   └── contact-data.ts
├── types/                # TypeScript type definitions
│   ├── manga.ts
│   ├── product.ts
│   ├── plushie.ts
│   ├── testimonial.ts
│   └── contact.ts
├── public/               # Static assets
│   └── placeholder images
└── README.md
\`\`\`

## 🎨 Components Overview

### **Core Components**
- `Navbar` - Responsive navigation with search and cart
- `HeroCarousel` - Full-screen image slider with auto-play
- `FeaturedFigures` - Anime figure product showcase
- `FeaturedManga` - Manga collection display
- `FeaturedPlushies` - Plushie product cards
- `Testimonials` - Customer reviews and ratings
- `ContactUs` - Contact form with map integration
- `Footer` - Comprehensive footer with links and newsletter

### **UI Components**
- `ProductCard` - Reusable product display card
- `MangaCard` - Specialized manga book card
- `PlushieCard` - Plushie-specific product card
- `TestimonialCard` - Customer review card
- `ContactForm` - Contact form with validation

## 🎯 Key Features Breakdown

### **Product Management**
\`\`\`typescript
// Example product structure
type Product = {
  id: number
  name: string
  price: number
  image: string
  originalPrice?: number
  rating?: number
  isNew?: boolean
}
\`\`\`

### **Interactive Elements**
- Hover animations on product cards
- Shopping cart with item counter
- Wishlist functionality
- Search with autocomplete
- Mobile-responsive navigation

### **Performance Optimizations**
- Next.js Image optimization
- Lazy loading for images
- Component code splitting
- CSS-in-JS with Tailwind
- TypeScript for better DX

## 🎨 Customization

### **Colors**
The project uses a pink-themed color palette:
\`\`\`css
/* Primary Colors */
pink-50 to pink-600
rose-50 to rose-600

/* Accent Colors */
yellow-400 (for ratings)
red-500 (for sale badges)
green-500 (for verified badges)
\`\`\`

### **Typography**
- Font weights: 400, 500, 600, 700, 800
- Responsive text sizing
- Gradient text effects for headings

### **Animations**
- Hover scale effects: `hover:scale-105`
- Smooth transitions: `transition-all duration-300`
- Custom keyframe animations for special effects

## 📱 Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Breakpoints:** sm, md, lg, xl, 2xl
- **Grid Systems:** Responsive product grids
- **Touch Friendly:** Large tap targets for mobile

## 🔧 Configuration

### **Environment Variables**
Create a `.env.local` file:
\`\`\`env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
\`\`\`

### **Tailwind Configuration**
The project includes custom Tailwind configuration for:
- Custom color palette
- Animation utilities
- Component-specific styles

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### **Other Platforms**
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Lucide React** for consistent icons
- **Tailwind CSS** for utility-first styling
- **Next.js** for the amazing React framework
- **Keen Slider** for smooth carousel functionality

## 📞 Support

If you have any questions or need help with the project:

- 📧 Email: support@pktstore.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pkt-store/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/pkt-store/discussions)

---

<div align="center">
  <p>Made with ❤️ for anime fans</p>
  <p>© 2025 PKT Store. All rights reserved.</p>
</div>
