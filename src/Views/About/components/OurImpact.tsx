"use client";

import { motion } from "framer-motion";
import { Compass, Leaf, Users as UsersIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function OurImpact() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "-100px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const impacts = [
    {
      id: 1,
      icon: Compass,
      number: "500+",
      label: "Travelers Guided",
      description:
        "Happy explorers from around the world who've experienced authentic Yarmouth",
    },
    {
      id: 2,
      icon: UsersIcon,
      number: "15",
      label: "Local Guides Trained",
      description:
        "Community members earning sustainable income while sharing their heritage",
    },
    {
      id: 3,
      icon: Leaf,
      number: "10K+",
      label: "Sq. Miles Conserved",
      description:
        "Through our partnership with local environmental conservation initiatives",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-semibold uppercase tracking-wide text-sm">
            Making a Difference
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-3 font-heading">
            Our Impact
          </h2>
          <p className="text-lg text-neutral-dark mt-4 max-w-2xl mx-auto">
            Since day one, we've been committed to supporting our community and
            preserving Yarmouth's natural beauty.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {impacts.map((impact) => {
            const IconComponent = impact.icon;
            return (
              <motion.div
                key={impact.id}
                variants={cardVariants}
                className="text-center p-8 bg-neutral-light rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                {/* Icon */}
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-accent/15 rounded-full flex items-center justify-center">
                    <IconComponent
                      className="w-8 h-8 text-accent"
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.div>

                {/* Number */}
                <motion.h3
                  className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: impact.id * 0.2, duration: 0.8 }}
                >
                  {impact.number}
                </motion.h3>

                {/* Label */}
                <h4 className="text-xl font-semibold text-primary mb-3">
                  {impact.label}
                </h4>

                {/* Description */}
                <p className="text-neutral-dark leading-relaxed">
                  {impact.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
