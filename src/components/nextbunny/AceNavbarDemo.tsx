"use client";

import AceNavbar, { NavbarConfig } from "@/components/nextbunny/AceNavbar";
const navbarConfig: NavbarConfig = {
  logo: {
    src: "/images/nextbunny-logo.png",
    alt: "NextBunny Logo",
    href: "/",
    width: 32,
    height: 32
  },
  mainNav: {
    firstGroup: {
      title: "Services",
      items: [{
        title: "Web Development",
        href: "/web-dev"
      }, {
        title: "Interface Design",
        href: "/interface-design"
      }, {
        title: "Search Engine Optimization",
        href: "/seo"
      }, {
        title: "Branding",
        href: "/branding"
      }]
    },
    products: {
      title: "Products",
      items: [{
        title: "Algochurn",
        href: "https://algochurn.com",
        src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&h=150&fit=crop",
        description: "Prepare for tech interviews like never before."
      }, {
        title: "Tailwind Master Kit",
        href: "https://tailwindmasterkit.com",
        src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=300&h=150&fit=crop",
        description: "Production ready Tailwind css components for your next project"
      }, {
        title: "Moonbeam",
        href: "https://gomoonbeam.com",
        src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300&h=150&fit=crop",
        description: "Never write from scratch again. Go from idea to blog in minutes."
      }, {
        title: "Rogue",
        href: "https://userogue.com",
        src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&h=150&fit=crop",
        description: "Respond to government RFPs, RFIs and RFQs 10x faster using AI"
      }]
    },
    lastGroup: {
      title: "Pricing",
      items: [{
        title: "Hobby",
        href: "/hobby"
      }, {
        title: "Individual",
        href: "/individual"
      }, {
        title: "Team",
        href: "/team"
      }, {
        title: "Enterprise",
        href: "/enterprise"
      }]
    }
  }
};
export default function AceNavbarDemo() {
  return <div className="relative w-full flex items-center justify-center">
      <AceNavbar className="top-2" config={navbarConfig} />
    </div>;
}