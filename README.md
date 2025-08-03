# 🎌 PKT Store - Premium Anime Merchandise E-commerce

**🌐 Live Demo:** [https://pkt-store.vercel.app/](https://pkt-store.vercel.app/)

A complete, modern e-commerce platform for anime merchandise built with Next.js 15, featuring real-time shopping cart, secure checkout with Telegram integration, and world-class SEO optimization.

![PKT Store UI](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Key Features

### 🛒 **Complete E-commerce Solution**
- **Real-time Shopping Cart** with Context API + localStorage persistence
- **3-step Checkout Modal** (Customer Info → Payment → Review)
- **Cambodian Payment Methods** (ABA Bank, ACLEDA, Wing, Cash on Delivery)
- **Professional Invoice Generation** with auto-download
- **Telegram Bot Integration** for order notifications and customer messaging

### 🎯 **Advanced SEO & Marketing**
- **Dynamic Metadata** for all pages with Open Graph & Twitter Cards
- **Structured Data (JSON-LD)** for Google Rich Snippets
- **Auto-generated Sitemap** with product pages
- **Breadcrumb Navigation** schema for better rankings
- **Social Media Optimization** for beautiful link previews

### 🎨 **Modern Design & UX**
- **Elegant Pink Gradient Theme** with professional aesthetics
- **Responsive Design** optimized for all devices
- **Smooth Animations** with Tailwind CSS transitions
- **Toast Notifications** with slide-in effects and progress bars
- **Glass-morphism UI** with backdrop blur effects

### 📱 **Product Management**
- 🎎 **Anime Figures** - Premium collectible figures with detailed specs
- 📚 **Manga Collection** - Japanese comics with series information
- 🧸 **Plushies** - Adorable soft toys from popular anime series
- **Dynamic Product Pages** with image galleries and descriptions
- **Category-based Navigation** with filtering and search

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** (App Router) - Full-stack React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Context API** - State management for cart functionality

### **Backend & APIs**
- **Next.js API Routes** - Serverless backend functions
- **Telegram Bot API** - Order notifications and customer messaging
- **JSON-LD Schema** - Structured data for SEO

### **Development & Deployment**
- **ESLint & TypeScript** - Code quality and type checking
- **Vercel** - Production deployment platform
- **Git** - Version control with GitHub integration
- **Icons:** Lucide React
- **Image Handling:** Next.js Image Optimization
- **Carousel:** Keen Slider
- **Animations:** CSS Transitions & Keyframes

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm/yarn/pnpm
- Git for version control
- Code editor (VS Code recommended)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/MengseuThoeng/PKT-Store-UI.git
   cd pkt-store
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
   # Required for Telegram bot functionality
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_GROUP_CHAT_ID=your_group_chat_id_here
   
   # Optional for development
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

### **Build for Production**
```bash
npm run build
npm run start
```

## 🎯 Project Structure

```
pkt-store/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage with structured data
│   ├── sitemap.ts              # Auto-generated sitemap
│   ├── robots.ts               # SEO robots configuration
│   ├── figures/                # Anime figures section
│   │   ├── page.tsx            # Figures listing page
│   │   └── [id]/               # Dynamic figure pages
│   ├── manga/                  # Manga collection section
│   ├── plushies/               # Plushies section
│   ├── cart/                   # Shopping cart page
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   └── api/                    # Backend API routes
│       ├── checkout/           # Order processing
│       └── telegram/           # Bot functionality
├── components/                  # Reusable components
│   ├── customs/                # Custom business components
│   │   ├── categoryGrid.tsx    # 3-category grid layout
│   │   ├── slider.tsx          # Hero carousel
│   │   └── testimonial.tsx     # Customer reviews
│   ├── list/                   # Product listing components
│   ├── ui/                     # UI components
│   │   ├── navbar.tsx          # Navigation with cart counter
│   │   ├── checkoutModal.tsx   # 3-step checkout process
│   │   └── toast.tsx           # Notification system
│   └── seo/                    # SEO components
│       ├── structured-data.tsx # JSON-LD schemas
│       └── breadcrumb-schema.tsx # Navigation breadcrumbs
├── lib/                        # Utilities and configurations
│   ├── context/                # React Context (Cart state)
│   ├── data/                   # Product data
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript definitions
└── public/                     # Static assets
    ├── figures/                # Product images
    ├── manga/                  # Manga covers
    └── plushie/               # Plushie photos
## 🎨 Key Components

### **🛒 Shopping Cart System**
- **Real-time updates** across all components
- **Persistent storage** with localStorage
- **Context API** for global state management
- **Toast notifications** for user feedback

### **� Checkout Process**
- **3-step modal workflow**:
  1. Customer information collection
  2. Payment method selection (ABA/ACLEDA/Wing/COD)
  3. Order review and confirmation
- **Form validation** with error handling
- **Professional invoice generation** with auto-download

### **🤖 Telegram Integration**
- **Order notifications** sent to store group
- **Customer messaging** via Telegram username
- **HTML-formatted messages** with order details
- **Error handling** for failed deliveries

### **📊 SEO Optimization**
- **Dynamic metadata** for all pages
- **Open Graph tags** for social media sharing
- **JSON-LD structured data** for rich snippets
- **Auto-generated sitemap** and robots.txt
- **Breadcrumb navigation** schema

## 🔧 Configuration

### **Telegram Bot Setup**
1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add bot to your store group
4. Get group chat ID using `/api/telegram/get-chat-id`
5. Set environment variables in Vercel dashboard

### **Environment Variables**
```env
# Production (Vercel)
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ
TELEGRAM_GROUP_CHAT_ID=-1001234567890

# Development (Optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### **Build Commands**
```bash
# Development
npm run dev

# Production build
npm run build

# Production start
npm run start

# Linting
npm run lint
```

## 📈 SEO Performance

### **Implemented Features**
- ✅ **Meta tags** with dynamic titles and descriptions
- ✅ **Open Graph** for Facebook/Meta sharing
- ✅ **Twitter Cards** for Twitter sharing
- ✅ **JSON-LD schemas** for Google Rich Results
- ✅ **Sitemap generation** for all products
- ✅ **Robots.txt** for search crawler guidance
- ✅ **Canonical URLs** to prevent duplicate content

### **Target Keywords**
- "anime figures cambodia"
- "manga store phnom penh"
- "pokemon plushies cambodia"
- "anime merchandise cambodia"
- "japanese comics cambodia"

## 🎯 Features Showcase

### **Homepage**
- Hero carousel with featured products
- 3-category grid (Figures, Manga, Plushies)
- Featured products sections
- Customer testimonials
- Contact information and map

### **Product Pages**
- Detailed product information
- Image galleries with zoom
- Add to cart functionality
- Related products suggestions
- Social sharing buttons

### **Shopping Experience**
- Real-time cart updates
- Persistent cart across sessions
- Professional checkout process
- Multiple payment methods
- Order confirmation with invoice

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mengseu Thoeng**
- GitHub: [@MengseuThoeng](https://github.com/MengseuThoeng)
- Project: [PKT Store](https://pkt-store.vercel.app/)

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For seamless deployment platform
- **Tailwind CSS** - For beautiful utility-first styling
- **Lucide** - For the beautiful icon library
- **Anime Community** - For inspiration and feedback

---

**🎌 Built with ❤️ for anime fans in Cambodia and beyond! 🛍️✨**
