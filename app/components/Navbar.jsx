'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  PhoneCall, 
  Search, 
  User, 
  Home, 
  Package, 
  FileText, 
  Info, 
  LogIn,
  Sun,
  Moon,
  Clock
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/packages", label: "ট্যুর বিবরণ", icon: Package },
    { href: "/registration", label: "রেজিস্ট্রেশন", icon: FileText },
    { href: "/schedule", label: "কার্যক্রম", icon: Clock },
    { href: "/user-info", label: "আপনার তথ্য", icon: User },
    { href: "/emergency", label: "জরুরি নম্বর", icon: PhoneCall },
    { href: "/about", label: "আমাদের সম্পর্কে", icon: Info },
  ];

  return (
    <>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-md' : 'bg-background/60 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  ট্যুর প্ল্যানার
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="সার্চ করুন..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-purple-100 focus:border-purple-300 bg-background/50"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>

              {/* Navigation Links */}
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background/50 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 focus:bg-purple-50 focus:text-purple-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-purple-50/50 data-[state=open]:bg-purple-50/50 ${
                          link.href === '/emergency' ? 'hover:bg-red-50 hover:text-red-600' : ''
                        }`}>
                          <link.icon className="mr-2 h-4 w-4" />
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* User Profile & Theme Toggle */}
              <div className="flex items-center space-x-4">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="rounded-full hover:bg-purple-50"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Moon className="h-5 w-5 text-purple-600" />
                    )}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full border-purple-200">
                      <User className="h-5 w-5 text-purple-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>অ্যাডমিন লগইন</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="rounded-full hover:bg-purple-50"
              >
                <Search className="h-5 w-5 text-purple-600" />
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-full hover:bg-purple-50"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Moon className="h-5 w-5 text-purple-600" />
                  )}
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-50">
                    <Menu className="h-5 w-5 text-purple-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                      ট্যুর প্ল্যানার
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-6">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className={`flex items-center space-x-2 text-lg font-medium p-2 rounded-lg transition-colors duration-200 hover:bg-purple-50 ${
                          link.href === '/emergency' ? 'hover:bg-red-50 hover:text-red-600' : 'hover:text-purple-600'
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                    <div className="pt-4 border-t">
                      <Link 
                        href="/admin"
                        className="flex items-center space-x-2 text-lg font-medium p-2 rounded-lg transition-colors duration-200 hover:bg-purple-50 hover:text-purple-600"
                      >
                        <LogIn className="h-5 w-5" />
                        <span>অ্যাডমিন লগইন</span>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden py-4"
              >
                <Input
                  type="search"
                  placeholder="সার্চ করুন..."
                  className="w-full rounded-full border-2 border-purple-100 focus:border-purple-300 bg-background/50"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
} 