/**
 * @description Professional business navigation component with animated mega menus and dropdowns. Built with TypeScript and shadcn/ui. Features hover animations, product showcases, mobile responsiveness, and dark mode support. Perfect for SaaS, enterprise, and e-commerce websites. Free to customize in NextBunny's visual editor. Boost conversion with modern navigation design.
 * @category Navigation
 * @subcategory Navbar
 */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-foreground hover:opacity-[0.9] text-sm"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-background rounded-2xl overflow-hidden border border-border shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export type NavItem = {
  title: string;
  href: string;
};

export type ProductItemType = {
  title: string;
  href: string;
  src: string;
  description: string;
};

export type LogoConfig = {
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
};

export type NavbarConfig = {
  logo: LogoConfig;
  mainNav: {
    firstGroup: {
      title: string;
      items: NavItem[];
    };
    products: {
      title: string;
      items: ProductItemType[];
    };
    lastGroup: {
      title: string;
      items: NavItem[];
    };
  };
};

export default function Navbar({
  className,
  config,
}: {
  className?: string;
  config: NavbarConfig;
}) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 px-4 md:px-0",
        className
      )}
    >
      <Menu setActive={setActive}>
        <div className="flex items-center w-full">
          <div className="shrink-0">
            <Link href={config.logo.href}>
              <Image
                src={config.logo.src}
                alt={config.logo.alt}
                width={config.logo.width}
                height={config.logo.height}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
            <MenuItem
              setActive={setActive}
              active={active}
              item={config.mainNav.firstGroup.title}
            >
              <div className="flex flex-col space-y-4 text-sm">
                {config.mainNav.firstGroup.items.map((item) => (
                  <HoveredLink key={item.href} href={item.href}>
                    {item.title}
                  </HoveredLink>
                ))}
              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item={config.mainNav.products.title}
            >
              <div className="text-sm grid grid-cols-2 gap-10 p-4">
                {config.mainNav.products.items.map((product) => (
                  <ProductItem key={product.href} {...product} />
                ))}
              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item={config.mainNav.lastGroup.title}
            >
              <div className="flex flex-col space-y-4 text-sm">
                {config.mainNav.lastGroup.items.map((item) => (
                  <HoveredLink key={item.href} href={item.href}>
                    {item.title}
                  </HoveredLink>
                ))}
              </div>
            </MenuItem>
          </div>
          <div className="shrink-0 md:hidden ml-auto">
            <button className="text-foreground p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </Menu>
    </div>
  );
}

export function Menu({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-border bg-background shadow-input px-4 py-4 md:px-8 md:py-6"
    >
      {children}
    </nav>
  );
}

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-foreground">{title}</h4>
        <p className="text-muted-foreground text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
}) => {
  return (
    <Link
      {...(rest as LinkProps)}
      className="text-muted-foreground hover:text-foreground"
    >
      {children}
    </Link>
  );
};
