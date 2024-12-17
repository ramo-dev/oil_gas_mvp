"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fuel, MapPin, Navigation, Video, Zap } from "lucide-react";

// Feature Card Component
// @ts-ignore
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      rotate: 2,
      transition: { duration: 0.3 },
    }}
    className="group"
  >
    <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 dark:bg-zinc-800/50 bg-white">
      <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 dark:text-zinc-100">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  </motion.div>
);

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "Find Nearby Stations",
      description: "Locate the closest fuel stations with real-time pricing",
    },
    {
      icon: Fuel,
      title: "Compare Prices",
      description: "Get the best deals on fuel in your area",
    },
    {
      icon: Navigation,
      title: "Track Services",
      description: "Find additional services like car wash and maintenance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.2,
            }}
          >
            <Fuel className="w-24 h-24 mx-auto mb-6 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold mb-4 dark:text-zinc-100">
              FuelFinder Pro
            </h1>
            <p className="text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Revolutionizing how you find, compare, and track fuel stations
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="group">
                Get Started
                <Navigation className="ml-2 h-5 w-5 group-hover:animate-bounce" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="group">
                Learn More
                <Zap className="ml-2 h-5 w-5 text-yellow-500 group-hover:animate-spin" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                  },
                },
              }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
