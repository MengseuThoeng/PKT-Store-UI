"use client";
import Image from "next/image";
import {
  Heart,
  Star,
  Users,
  Package,
  Award,
  Globe,
  Shield,
  Truck,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Package, label: "Products Sold", value: "200,000+" },
    { icon: Globe, label: "Countries Served", value: "25+" },
    { icon: Award, label: "Years Experience", value: "8+" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Anime",
      description:
        "We're not just a store - we're fellow anime enthusiasts who understand the joy of collecting your favorite characters.",
    },
    {
      icon: Shield,
      title: "Authentic Quality",
      description:
        "Every figure, plushie, and manga is carefully sourced to ensure you receive only genuine, high-quality merchandise.",
    },
    {
      icon: Star,
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We go above and beyond to make sure every purchase brings a smile to your face.",
    },
    {
      icon: Truck,
      title: "Fast & Safe Delivery",
      description:
        "We package every item with care and ship quickly so you can enjoy your new treasures as soon as possible.",
    },
  ];

  const team = [
    {
      name: "Seng Kunthea",
      role: "Founder of PKT Store",
      image: "/people/momPkt.png",
      description:
        "A visionary leader with a deep love for anime and a commitment to quality.",
    },
    {
      name: "Pisey Sokunpidor",
      role: "Founder & CEO",
      image: "/people/pidor.png",
      description:
        "Anime lover since childhood, turned passion into PKT Store to share amazing collectibles with fellow fans.",
    },
    {
      name: "Thoeng Mengseu",
      role: "Software Engineer",
      image: "/people/seu.png",
      description:
        "Passionate about coding and anime, dedicated to improving our website and user experience.",
    },
    {
      name: "Pisey Sokmonea",
      role: "Pre-Sales Manager",
      image: "/people/nea.png",
      description:
        "Bringing a unique perspective to our sales strategy and customer engagement.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-6">
            About PKT Store
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your ultimate destination for authentic anime figures, adorable
            plushies, and manga collections. We&apos;re passionate otakus bringing
            you the best of Japanese pop culture.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  PKT Store began in 2016 as a small passion project by a group
                  of anime enthusiasts who struggled to find authentic,
                  high-quality merchandise at reasonable prices. What started as
                  a weekend hobby quickly grew into something much bigger.
                </p>
                <p className="text-lg">
                  We realized there was a huge demand for genuine anime
                  collectibles, but many fans were getting disappointed by
                  counterfeit products and poor service. That&apos;s when we decided
                  to create something different - a store built by fans, for
                  fans.
                </p>
                <p className="text-lg">
                  Today, PKT Store is trusted by thousands of collectors
                  worldwide. We work directly with official distributors and
                  manufacturers to bring you authentic figures, plushies, and
                  manga at competitive prices, with the customer service you
                  deserve.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <Image
                  src="/images/pkt.jpg"
                  alt="PKT Store Journey"
                  width={500}
                  height={400}
                  className="rounded-xl object-cover w-full"
                />
                <div className="mt-6 text-center">
                  <p className="text-gray-600 italic">
                    {`"From small beginnings to serving anime fans worldwide"`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that showcase our commitment to the anime community
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600">
              The values that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind PKT Store
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              To create the world&apos;s most trusted and beloved destination for
              anime merchandise, where every fan can find authentic,
              high-quality collectibles that bring their favorite characters to
              life. We&apos;re not just selling products - we&apos;re helping fans express
              their passion and connect with the stories they love.
            </p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-500 mt-4">Rated 4.9/5 by our customers</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-rose-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join the PKT Family</h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to start your anime collection journey? Explore our carefully
            curated selection of figures, plushies, and manga today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Figures
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors">
              Browse Manga
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
