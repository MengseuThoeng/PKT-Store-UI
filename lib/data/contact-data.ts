import type { ContactInfo } from "@/lib/types/contact"

export const contactInfo: ContactInfo[] = [
  {
    type: "phone",
    icon: "phone",
    title: "Call Us",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri 9AM-6PM PST",
  },
  {
    type: "email",
    icon: "mail",
    title: "Email Us",
    value: "support@pktstore.com",
    description: "We reply within 24 hours",
  },
  {
    type: "address",
    icon: "map-pin",
    title: "Visit Our Store",
    value: "123 Anime Street, Tokyo District",
    description: "Los Angeles, CA 90210",
  },
  {
    type: "hours",
    icon: "clock",
    title: "Store Hours",
    value: "Mon-Sat: 10AM-8PM",
    description: "Sunday: 12PM-6PM",
  },
]
