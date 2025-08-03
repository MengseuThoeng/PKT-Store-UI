import CategoriesGrid from "@/components/customs/categoryGrid";
import ContactUs from "@/components/customs/contactUs";
import FeaturedFigures from "@/components/customs/FeaturedFigures";
import FeaturedManga from "@/components/customs/mangaFeatured";
import FeaturedPlushies from "@/components/customs/plushieFeatured";
import JoinTelegram from "@/components/customs/joinTelegram";
import Carousel from "@/components/customs/slider";
import Testimonials from "@/components/customs/testimonial";
import BackToTop from "@/components/ui/backToTop";
import ProgressBar from "@/components/ui/progressBar";
import { StructuredData, organizationSchema, websiteSchema, storeSchema } from "@/components/seo/structured-data";

export default function Home() {
  return (
    <div>
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <StructuredData data={storeSchema} />
      <ProgressBar />
      <Carousel />
      <CategoriesGrid />
      <FeaturedFigures />
      <FeaturedManga />
      <FeaturedPlushies />
      <Testimonials />
      <JoinTelegram />
      <ContactUs />
      <BackToTop />
    </div>
  );
}
