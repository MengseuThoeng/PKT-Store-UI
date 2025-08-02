import CategoriesGrid from "@/components/customs/categoryGrid";
import ContactUs from "@/components/customs/contactUs";
import FeaturedFigures from "@/components/customs/FeaturedFigures";
import FeaturedManga from "@/components/customs/mangaFeatured";
import FeaturedPlushies from "@/components/customs/plushieFeatured";
import Carousel from "@/components/customs/slider";
import Testimonials from "@/components/customs/testimonial";

export default function Home() {
  return (
    <div>
      <Carousel />
      <CategoriesGrid />
      <FeaturedFigures />
      <FeaturedManga />
      <FeaturedPlushies />
      <Testimonials />
      <ContactUs />
    </div>
  );
}
