# 🚀 Vercel Deployment Checklist for PKT Store

## ✅ Pre-Deployment Complete

### **SEO Configuration**
- [x] **Domain Updated**: All URLs changed to `https://pkt-store.vercel.app/`
- [x] **Metadata Base**: Set in `app/layout.tsx`
- [x] **Sitemap**: Auto-generates with correct domain
- [x] **Robots.txt**: Updated with Vercel domain
- [x] **Structured Data**: All schemas use correct URLs
- [x] **Open Graph**: Social media tags with proper domain
- [x] **Build Test**: ✅ Successful with no errors

### **Environment Variables for Vercel**
Make sure these are set in your Vercel dashboard:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_GROUP_CHAT_ID=your_group_chat_id_here
```

### **Post-Deployment Tasks**

#### **1. Google Search Console**
- [ ] Add `https://pkt-store.vercel.app` to Google Search Console
- [ ] Submit sitemap: `https://pkt-store.vercel.app/sitemap.xml`
- [ ] Verify domain ownership

#### **2. Social Media Meta Tags Test**
- [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

#### **3. SEO Tools Testing**
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Schema.org Validator: https://validator.schema.org/
- [ ] PageSpeed Insights: https://pagespeed.web.dev/

#### **4. Telegram Bot Testing**
- [ ] Test checkout flow with real orders
- [ ] Verify group notifications work
- [ ] Test customer messaging functionality

### **Expected SEO Performance**

#### **Google Search Results**
- ✅ Rich snippets for products with prices
- ✅ Sitelinks for main categories (Figures, Manga, Plushies)
- ✅ Local business results for "anime store cambodia"
- ✅ Image search optimization for figure photos

#### **Social Media Sharing**
- ✅ Beautiful previews on Facebook/Meta
- ✅ Twitter cards with proper images
- ✅ LinkedIn rich previews
- ✅ WhatsApp/Telegram link previews

#### **Target Keywords** (should rank within 1-3 months)
- "anime figures cambodia"
- "manga store phnom penh"  
- "pokemon plushies cambodia"
- "one piece figures"
- "anime merchandise cambodia"
- "japanese comics cambodia"

### **Monitoring & Analytics**

#### **Setup Required**
- [ ] Google Analytics 4 with Enhanced Ecommerce
- [ ] Google Search Console monitoring
- [ ] Facebook Pixel (optional)
- [ ] Core Web Vitals monitoring

#### **Weekly Checks**
- [ ] Search Console performance
- [ ] Page speed scores
- [ ] Social media engagement
- [ ] Organic traffic growth

---

## 🎯 Deployment Command

```bash
# Final build test
npm run build

# Deploy to Vercel (if using CLI)
vercel --prod

# Or push to main branch for auto-deploy
git add .
git commit -m "feat: complete SEO implementation with Vercel domain"
git push origin main
```

## 🎌 Success Metrics

### **Month 1 Goals**
- [ ] 100+ organic visitors/month
- [ ] 10+ products indexed in Google
- [ ] 5+ keywords ranking on page 1-3

### **Month 3 Goals**  
- [ ] 500+ organic visitors/month
- [ ] Rich snippets appearing in search
- [ ] Local SEO ranking for Cambodia anime searches

### **Month 6 Goals**
- [ ] 1000+ organic visitors/month
- [ ] Top 3 rankings for main keywords
- [ ] Strong social media sharing metrics

---

**🚀 Your PKT Store is now SEO-optimized and ready to dominate Google search results for anime merchandise in Cambodia!** 🎌✨
