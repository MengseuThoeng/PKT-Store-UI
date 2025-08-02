"use client"
import { Phone, Mail, MapPin, Clock, MessageCircle, Headphones } from "lucide-react"
import ContactForm from "@/components/ui/contactForm"
import ContactMap from "@/components/ui/contactMap"
import { contactInfo } from "@/lib/data/contact-data"

const iconMap = {
  phone: Phone,
  mail: Mail,
  "map-pin": MapPin,
  clock: Clock,
}

export default function ContactUs() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-pink-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <MessageCircle className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions about our products or need help with your order? We&apos;re here to help! Reach out to us anytime.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactInfo.map((info, index) => {
          const IconComponent = iconMap[info.icon as keyof typeof iconMap]
          return (
            <div
              key={info.type}
              className="bg-white rounded-xl shadow-md border border-pink-100/50 p-6 text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{info.title}</h3>
              <p className="text-pink-600 font-medium mb-1">{info.value}</p>
              {info.description && <p className="text-sm text-gray-500">{info.description}</p>}
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <ContactForm />

        {/* Map */}
        <ContactMap />
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-pink-100/50 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Headphones className="w-6 h-6 text-pink-500" />
            <h3 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">How long does shipping take?</h4>
              <p className="text-gray-600 text-sm">
                Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Do you ship internationally?</h4>
              <p className="text-gray-600 text-sm">
                Yes! We ship worldwide. International shipping times vary by location (7-14 business days).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What&apos;s your return policy?</h4>
              <p className="text-gray-600 text-sm">
                We offer 30-day returns for unopened items in original condition. Damaged items can be returned anytime.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Are your products authentic?</h4>
              <p className="text-gray-600 text-sm">
                We only sell authentic, licensed merchandise from official distributors and manufacturers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Do you offer pre-orders?</h4>
              <p className="text-gray-600 text-sm">
                Yes! We offer pre-orders for upcoming releases. You&apos;ll be charged when the item ships.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Can I track my order?</h4>
              <p className="text-gray-600 text-sm">
                Yes! You&apos;ll receive a tracking number via email once your order ships. You can track it on our website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
