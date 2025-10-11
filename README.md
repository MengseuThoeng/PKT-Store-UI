# 🎌 PKT Store - Premium Anime Merchandise E-Commerce

<div align="center">

![PKT Store Logo](public/images/pngkt.png)

**Your Ultimate Destination for Anime Figures, Manga & Plushies in Cambodia** 🇰🇭

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**🌐 Live Demo:** [https://pkt-store.vercel.app/](https://pkt-store.vercel.app/)

[📖 Documentation](#-documentation) | [🚀 Quick Start](#-quick-start) | [🐛 Report Bug](../../issues) | [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Setup](#️-environment-setup)
- [📱 Mobile Responsive](#-mobile-responsive)
- [💳 Payment Integration](#-payment-integration)
- [🗄️ Database](#️-database)
- [🚢 Deployment](#-deployment)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)


---

## ✨ Features

### �️ **Complete E-Commerce Platform**

#### Customer Features
- **Product Browsing**
  - ✅ Browse anime figures, manga, and plushies
  - ✅ Advanced search and filtering
  - ✅ Sort by name, price, rating, newest
  - ✅ Product details with image galleries
  - ✅ Real-time stock availability
  - ✅ Wishlist functionality

- **Shopping Cart & Checkout**
  - ✅ Real-time cart with Context API
  - ✅ LocalStorage persistence
  - ✅ 3-step checkout modal
  - ✅ Multiple payment methods (KHQR, Cash on Delivery)
  - ✅ Professional invoice generation
  - ✅ Order tracking and history

- **User Account System**
  - ✅ Email/Phone registration & login
  - ✅ OTP verification (Email & Telegram)
  - ✅ Profile management
  - ✅ Multiple shipping addresses
  - ✅ Order history with status tracking
  - ✅ Password change & account deletion
  - ✅ JWT-based authentication

#### Admin Features
- **Dashboard & Analytics**
  - ✅ Sales statistics
  - ✅ Revenue tracking
  - ✅ Order overview
  - ✅ Customer insights

- **Order Management**
  - ✅ View all orders
  - ✅ Update order status
  - ✅ Payment verification
  - ✅ Invoice generation

- **Product Management**
  - ✅ Add/Edit/Delete products
  - ✅ Inventory tracking
  - ✅ Category management
  - ✅ Image uploads

- **Customer Management**
  - ✅ Customer list
  - ✅ Order history per customer
  - ✅ Customer details

### 💳 **Payment Integration**

#### Bakong KHQR (Primary)
- ✅ Individual merchant account
- ✅ Dynamic QR code generation
- ✅ Real-time payment verification
- ✅ MD5 hash validation
- ✅ Auto order creation on payment
- ✅ Transaction tracking
- ✅ Auto-refresh tokens

#### Cash on Delivery
- ✅ Manual payment verification
- ✅ Order confirmation workflow

### 📧 **Notifications**

#### Email Notifications (Resend/Gmail)
- ✅ Order confirmations
- ✅ Payment receipts
- ✅ OTP verification codes
- ✅ Shipping updates
- ✅ HTML email templates

#### Telegram Integration
- ✅ Admin order alerts
- ✅ Customer OTP delivery
- ✅ Payment confirmations
- ✅ Real-time notifications

### 🎨 **UI/UX Excellence**

- ✅ **100% Mobile Responsive** (320px - 2560px)
- ✅ Modern pink gradient theme
- ✅ Smooth animations with Tailwind
- ✅ Glass-morphism effects
- ✅ Loading skeletons
- ✅ Toast notifications with progress
- ✅ Touch-friendly buttons (44x44px min)
- ✅ Accessible keyboard navigation

### 🔍 **SEO Optimized**

- ✅ Dynamic metadata for all pages
- ✅ OpenGraph & Twitter Cards
- ✅ JSON-LD structured data
- ✅ Auto-generated sitemap
- ✅ Breadcrumb navigation schema
- ✅ Robots.txt configuration
- ✅ PWA ready with manifest
- ✅ Optimized images


---

## 🏗️ Tech Stack

### **Frontend**
- **[Next.js 15.4.4](https://nextjs.org/)** - React framework with App Router
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **React Context API** - Global state management

### **Backend & Database**
- **[Supabase](https://supabase.com/)** - PostgreSQL database
- **Next.js API Routes** - Serverless functions
- **Supabase Client** - Database ORM
- **Custom JWT Auth** - Secure authentication

### **Integrations**
- **Bakong KHQR API** - Payment processing (NBC Cambodia)
- **[Resend](https://resend.com/)** - Email delivery (or Gmail SMTP)
- **Telegram Bot API** - Instant notifications
- **Vercel** - Deployment & hosting

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Git** - Version control
- **VS Code** - Recommended editor

---

## 🚀 Quick Start

### **Prerequisites**
```bash
Node.js 18.x or higher
npm 9.x or higher
Git
Supabase account (free tier)
```

### **Installation**

```bash
# 1. Clone repository
git clone https://github.com/MengseuThoeng/PKT-Store-UI.git
cd pkt-store

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

### **Build for Production**
```bash
npm run build
npm start
```

---

## ⚙️ Environment Setup

### **Required Environment Variables**

Create `.env.local` file:

```env
# ===========================================
# SUPABASE (Database)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ===========================================
# EMAIL (Choose one)
# ===========================================
# Option 1: Resend (Recommended - 3000 free/month)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Option 2: Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ===========================================
# JWT AUTHENTICATION
# ===========================================
JWT_SECRET=your-super-secret-key-min-32-characters

# ===========================================
# TELEGRAM NOTIFICATIONS
# ===========================================
TELEGRAM_BOT_TOKEN=7815081863:AAH...
TELEGRAM_CHAT_ID=7234242855

# ===========================================
# BAKONG KHQR PAYMENT
# ===========================================
BAKONG_API_URL=https://api-bakong.nbc.gov.kh
BAKONG_CLIENT_ID=your_client_id
BAKONG_CLIENT_SECRET=your_client_secret
BAKONG_MERCHANT_ID=your_merchant_id
BAKONG_ACCOUNT_ID=your_account_id

# ===========================================
# APP CONFIGURATION
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### **Setup Guides**
- 📘 [Complete Setup Guide](./QUICK_START.md)
- 📧 [Email Configuration](./QUICK_START.md#email-setup)
- 🤖 [Telegram Bot Setup](./QUICK_START.md#telegram-setup)
- 💳 [KHQR Payment Setup](./KHQR_INDIVIDUAL_SETUP.md)
- 🗄️ [Database Setup](./DATABASE_SETUP.md)


---

## 📱 Mobile Responsive

### ✅ **100% Mobile Responsive Design**

Tested and verified on all device sizes:

| Device Type | Screen Size | Status |
|-------------|-------------|--------|
| Small Phones | 320px - 375px | ✅ Perfect |
| Medium Phones | 375px - 414px | ✅ Perfect |
| Large Phones | 414px+ | ✅ Perfect |
| Tablets | 768px - 1024px | ✅ Perfect |
| Laptops | 1024px - 1440px | ✅ Perfect |
| Desktops | 1440px - 2560px | ✅ Perfect |

### **Responsive Features**
```tsx
// Mobile-first Tailwind breakpoints
sm: 640px   // Tablets
md: 768px   // Small laptops
lg: 1024px  // Desktops
xl: 1280px  // Large desktops
```

**What's Responsive:**
- ✅ Grid layouts: 1 → 2 → 3 → 4 columns
- ✅ Responsive padding: `px-4 sm:px-6 lg:px-8`
- ✅ Mobile navigation menu
- ✅ Touch-friendly buttons (44x44px minimum)
- ✅ Responsive images
- ✅ No horizontal scroll
- ✅ Stack to row layouts
- ✅ Adaptive typography

📖 **[View Full Responsive Report](./MOBILE_RESPONSIVE_TEST_RESULTS.md)**

---

## 💳 Payment Integration

### **Bakong KHQR (Primary Payment)**

Cambodia's national payment system integration:

#### Features
- ✅ Individual merchant account
- ✅ Dynamic QR code generation
- ✅ Real-time payment verification
- ✅ MD5 hash validation for security
- ✅ Auto order creation on payment
- ✅ Transaction tracking
- ✅ Auto-refresh access tokens
- ✅ Webhook support

#### Payment Flow
```mermaid
User selects KHQR
    ↓
System generates QR code
    ↓
User scans with banking app
    ↓
Payment verified via Bakong API
    ↓
Order auto-created
    ↓
Email & Telegram notifications sent
```

#### Setup Guide
📖 **[Complete KHQR Setup](./KHQR_INDIVIDUAL_SETUP.md)**

### **Cash on Delivery**

Alternative payment method:
- ✅ Manual verification
- ✅ Order confirmation workflow
- ✅ Admin approval required

---

## 🗄️ Database

### **Supabase PostgreSQL**

#### Core Tables

**`users`** - User accounts
- Authentication (email/phone/password)
- Profile information
- Admin flags
- Email verification status

**`products`** - Product catalog
- Figures, Manga, Plushies
- Stock tracking
- Pricing & discounts
- Images & metadata

**`orders`** - Order management
- Customer information
- Order items (JSONB)
- Payment status
- Order status tracking
- Shipping details

**`transactions`** - Payment tracking
- KHQR transaction data
- Payment verification
- Transaction history

**`addresses`** - Shipping addresses
- Multiple addresses per user
- Default address selection

📖 **[Complete Database Schema](./DATABASE_SETUP.md)**

### **Quick Database Setup**
```bash
# Run migrations
npm run db:migrate

# Or manually execute SQL scripts
# See /scripts folder
```

---

## � Deployment

### **Deploy to Vercel** (Recommended)

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MengseuThoeng/PKT-Store-UI)

#### Manual Deployment
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Add environment variables in dashboard
# 5. Promote to production
vercel --prod
```

### **Environment Variables in Vercel**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add all 15 variables from `.env.production`
4. Redeploy

### **Post-Deployment Checklist**
- [ ] All environment variables added
- [ ] Database connected
- [ ] Email service working
- [ ] Telegram notifications working
- [ ] KHQR payment tested
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] SEO metadata working
- [ ] Social sharing previews working

📖 **[Complete Deployment Guide](./VERCEL_DEPLOYMENT.md)**

---

## 📚 Documentation

### **Setup Guides**
- 📖 [Quick Start Guide](./QUICK_START.md)
- 🚀 [Deployment Guide](./VERCEL_DEPLOYMENT.md)
- 🗄️ [Database Setup](./DATABASE_SETUP.md)
- 💳 [KHQR Payment Setup](./KHQR_INDIVIDUAL_SETUP.md)

### **Development Docs**
- 📱 [Mobile Responsive Report](./MOBILE_RESPONSIVE_TEST_RESULTS.md)
- 🏗️ [System Architecture](./SYSTEM_ARCHITECTURE.md)
- 🔧 [API Documentation](./API_DOCUMENTATION.md)
- 🐛 [Troubleshooting Guide](./TROUBLESHOOTING.md)

### **Project Management**
- ✅ [Setup Checklist](./SETUP_CHECKLIST.md)
- 📋 [Documentation Index](./DOCS_INDEX.md)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### **How to Contribute**

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/PKT-Store-UI.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add TypeScript types
   - Use Tailwind CSS for styling
   - Add comments for complex logic
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/AmazingFeature
   ```

### **Commit Message Convention**
```
Add: New feature
Fix: Bug fix
Update: Improve existing feature
Remove: Delete deprecated code
Docs: Documentation only
Style: Code formatting
Refactor: Code restructuring
Test: Add tests
```

### **Code Style Guidelines**
- ✅ Use TypeScript for type safety
- ✅ Follow ESLint rules
- ✅ Use Tailwind CSS (no custom CSS)
- ✅ Mobile-first responsive design
- ✅ Add proper error handling
- ✅ Write clean, readable code
- ✅ Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 PKT Store

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👥 Team & Support

### **👨‍💻 Developer**
**Mengseu Thoeng** - Full Stack Developer
- GitHub: [@MengseuThoeng](https://github.com/MengseuThoeng)
- Project: [PKT Store](https://pkt-store.vercel.app/)

### **📞 Support**
- 📧 Email: mengseu.dev@gmail.com
- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)

### **🔗 Links**
- 🌐 [Live Demo](https://pkt-store.vercel.app/)
- 📖 [Documentation](./DOCS_INDEX.md)
- 🚀 [Roadmap](../../projects/1)

---

## 🙏 Acknowledgments

Special thanks to:

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Vercel](https://vercel.com/)** - Seamless deployment platform
- **[Supabase](https://supabase.com/)** - Database & backend services
- **[Tailwind CSS](https://tailwindcss.com/)** - Beautiful utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Lucide](https://lucide.dev/)** - Beautiful icon library
- **National Bank of Cambodia** - Bakong KHQR API
- **[Resend](https://resend.com/)** - Email delivery service
- **Anime Community** - Inspiration and support

---

## 🗺️ Roadmap

### ✅ **Phase 1 - MVP** (Completed)
- [x] User authentication with OTP
- [x] Product catalog (Figures, Manga, Plushies)
- [x] Shopping cart with persistence
- [x] KHQR payment integration
- [x] Order management system
- [x] Admin dashboard
- [x] Email notifications
- [x] Telegram integration
- [x] 100% mobile responsive
- [x] SEO optimization
- [x] Production deployment

### 🚧 **Phase 2 - Enhancements** (Planned - Q1 2025)
- [ ] Product reviews & ratings
- [ ] Wishlist with sync
- [ ] Advanced search & filters
- [ ] Product recommendations
- [ ] Multi-language (Khmer/English)
- [ ] Social media login
- [ ] Order tracking page
- [ ] Stock alerts

### 📋 **Phase 3 - Advanced** (Planned - Q2 2025)
- [ ] Live chat support
- [ ] Loyalty program
- [ ] Gift cards system
- [ ] Subscription boxes
- [ ] Mobile app (React Native)
- [ ] AR product preview
- [ ] Voice search
- [ ] Analytics dashboard

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/MengseuThoeng/PKT-Store-UI?style=social)
![GitHub forks](https://img.shields.io/github/forks/MengseuThoeng/PKT-Store-UI?style=social)
![GitHub issues](https://img.shields.io/github/issues/MengseuThoeng/PKT-Store-UI)
![GitHub last commit](https://img.shields.io/github/last-commit/MengseuThoeng/PKT-Store-UI)

---

## 🎯 Quick Links

| Resource | Link |
|----------|------|
| 🌐 Live Demo | [pkt-store.vercel.app](https://pkt-store.vercel.app/) |
| 📖 Documentation | [DOCS_INDEX.md](./DOCS_INDEX.md) |
| 🚀 Quick Start | [QUICK_START.md](./QUICK_START.md) |
| 🚢 Deployment Guide | [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) |
| 💳 KHQR Setup | [KHQR_INDIVIDUAL_SETUP.md](./KHQR_INDIVIDUAL_SETUP.md) |
| 🐛 Report Bug | [Create Issue](../../issues/new) |
| ✨ Request Feature | [Create Issue](../../issues/new) |
| 📱 Responsive Report | [MOBILE_RESPONSIVE_TEST_RESULTS.md](./MOBILE_RESPONSIVE_TEST_RESULTS.md) |

---

<div align="center">

### **🎌 Built with ❤️ for anime fans in Cambodia and beyond! 🛍️✨**

**PKT Store © 2025** | Made in Cambodia 🇰🇭

[⬆ Back to Top](#-pkt-store---premium-anime-merchandise-e-commerce)

</div>
