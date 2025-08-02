"use client"
import { MessageCircle, Users, Bell, Gift } from "lucide-react"

export default function JoinTelegram() {
  const telegramLink = "https://t.me/+VqoRFkRvw885ZTI1" // Replace with your actual Telegram link

  const benefits = [
    { icon: Bell, text: "Get notified of new arrivals first" },
    { icon: Gift, text: "Exclusive member-only discounts" },
    { icon: Users, text: "Connect with fellow anime fans" },
    { icon: MessageCircle, text: "Ask questions & get quick support" }
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-rose-600">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-3 rounded-full">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Join Our Telegram</h2>
                  <p className="text-pink-600 font-medium">PKT Store Community</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-8">
                Be part of our exclusive anime community! Get the latest updates, special offers, 
                and connect with thousands of fellow anime enthusiasts.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <benefit.icon className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6" />
                Join Telegram Group
              </a>
            </div>

            {/* Right Content - Visual */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-600 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                    7K+
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Active Members</h3>
                <p className="text-gray-600 mb-6">Join thousands of anime fans sharing their passion</p>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-pink-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-rose-600">Daily</div>
                    <div className="text-sm text-gray-600">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
