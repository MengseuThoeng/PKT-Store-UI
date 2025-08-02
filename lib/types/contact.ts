export type ContactInfo = {
  type: "phone" | "email" | "address" | "hours"
  icon: string
  title: string
  value: string
  description?: string
}

export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
  orderNumber?: string
}
