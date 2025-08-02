# PKT Store UI 🌸

A beautiful, modern e-commerce website for anime merchandise built with Next.js 15, TypeScript, and Tailwind CSS. Features a stunning pink theme and showcases anime figures, manga, and plushies.

![PKT Store UI](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### Design & UI
- **Modern pink gradient theme** throughout the interface
- **Responsive design** for all devices (mobile-first approach)
- **Smooth animations** and hover effects
- **Glass-morphism effects** and elegant shadows
- **Professional component architecture**

### Product Categories
- 🎎 **Anime Figures** - Premium collectible figures
- 📚 **Manga Collection** - Latest chapters and series  
- 🧸 **Adorable Plushies** - Soft and cuddly companions

### E-commerce Features
- Product cards with ratings, pricing, and wishlist functionality
- Image hover effects and quick preview
- Full-screen hero carousel with auto-play
- Navigation with dropdown menus
- Search functionality with filters
- Shopping cart and wishlist system
- Customer testimonials section
- Contact form with validation
- Interactive Google Maps integration
- FAQ section for common questions
- Newsletter subscription
- Social media integration

### Technical Features
- **TypeScript** for type safety and better developer experience
- **Server Components** and **Client Components** optimization
- **Responsive grid layouts**
- **Loading states** and smooth animations
- **SEO optimized** structure
- **Image optimization** with Next.js

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Image Handling:** Next.js Image Optimization
- **Carousel:** Keen Slider
- **Animations:** CSS Transitions & Keyframes

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine (version 18 or higher).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MengseuThoeng/PKT-Store-UI.git
   cd PKT-Store-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
PKT-Store-UI/
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
├── data/                  # Static data
│   ├── manga-data.ts
│   ├── product-data.ts
│   ├── plushie-data.ts
│   ├── testimonial-data.ts
│   └── contact-data.ts
├── types/                 # TypeScript type definitions
│   ├── manga.ts
│   ├── product.ts
│   ├── plushie.ts
│   ├── testimonial.ts
│   └── contact.ts
├── public/                # Static assets
│   └── images/           # Product and UI images
└── README.md
```

## 🧩 Key Components

### Layout Components
- **Navbar** - Responsive navigation with search and cart
- **HeroCarousel** - Full-screen image slider with auto-play
- **Footer** - Comprehensive footer with links and newsletter

### Product Components
- **FeaturedFigures** - Anime figure product showcase
- **FeaturedManga** - Manga collection display
- **FeaturedPlushies** - Plushie product cards

### Reusable Components
- **ProductCard** - Reusable product display card
- **MangaCard** - Specialized manga book card
- **PlushieCard** - Plushie-specific product card
- **TestimonialCard** - Customer review card
- **ContactForm** - Contact form with validation

### Interactive Components
- **Testimonials** - Customer reviews and ratings
- **ContactUs** - Contact form with map integration

## 🎨 Design System

### Color Palette
The project uses a beautiful pink-themed color palette:

```css
/* Primary Colors */
pink-50 to pink-600
rose-50 to rose-600

/* Accent Colors */
yellow-400 (for ratings)
red-500 (for sale badges)
green-500 (for verified badges)
```

### Typography
- **Font weights:** 400, 500, 600, 700, 800
- **Responsive text sizing**
- **Gradient text effects** for headings

### Animations
- **Hover scale effects:** `hover:scale-105`
- **Smooth transitions:** `transition-all duration-300`
- **Custom keyframe animations** for special effects

### Responsive Design
- **Mobile First:** Optimized for mobile devices
- **Breakpoints:** sm, md, lg, xl, 2xl
- **Grid Systems:** Responsive product grids
- **Touch Friendly:** Large tap targets for mobile

## 🔧 Configuration

### TypeScript Types
```typescript
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
```

### Tailwind Configuration
The project includes custom Tailwind configuration for:
- Custom color palette
- Animation utilities
- Component-specific styles

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide React](https://lucide.dev/) for consistent icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Keen Slider](https://keen-slider.io/) for smooth carousel functionality

## 📞 Support

If you have any questions or need help with the project:

- 📧 **Email:** [support@pktstore.com](mailto:support@pktstore.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/MengseuThoeng/PKT-Store-UI/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/MengseuThoeng/PKT-Store-UI/discussions)

---

<div align="center">
  <p>Made with ❤️ for anime fans</p>
  <p>© 2025 PKT Store. All rights reserved.</p>
</div>
