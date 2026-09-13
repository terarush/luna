import { tl } from "@/lib/i18n"

export const companyMeta = {
  name: "TeraRush",
  logo: "/company/logo.png",
  logoWhite: "/company/logo.png", 
  title: "TeraRush - Open Source Development Agency",
  description:
    "Empowering developers worldwide through open-source innovation. Build, collaborate, and scale with reliable web solutions.",
  tagline: "Build. Collaborate. Innovate.",
  url: "https://terarush.studio",
  email: "hello@terarush.studio",
  phone: "+62 821 4333 8737",
  whatsapp: "https://wa.me/6282143338737",
  links: {
    github: "https://github.com/terarush",
    twitter: "https://twitter.com/terarush",
    linkedin: "https://linkedin.com/company/terarush",
    instagram: "https://instagram.com/terarush.tech",
  },
  location: {
    country: "Indonesia",
    region: "Malang, East Java",
    timezone: "GMT+7 (WIB)",
  },
  businessHours: {
    weekdays: "3:00 PM - 10:00 PM PST",
    weekends: "9:00 AM - 8:00 PM PST",
  },
}

export type CompanyMetaType = typeof companyMeta

export interface SeoMeta {
  title: string
  description: string
  tagline: string
}

export function getSeoMeta(): SeoMeta {
  return {
    title: tl("seo.title"),
    description: tl("seo.description"),
    tagline: tl("seo.tagline"),
  }
}
