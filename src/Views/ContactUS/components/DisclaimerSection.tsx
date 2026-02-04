"use client";

import { motion } from "framer-motion";

export default function DisclaimerSection() {
  return (
    <section className="py-16 md:py-24 px-6 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-heading font-semibold text-primary mb-8">
            Important Policies & Disclaimers
          </h2>

          <div className="space-y-8">
            {/* Custom Itineraries Disclaimer */}
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Custom Itineraries
              </h3>
              <p className="text-neutral-dark leading-relaxed">
                All custom itineraries are carefully curated based on your
                preferences and the season. We provide recommendations based on
                current local conditions and availability. Activities and
                accommodations are subject to change based on weather, local
                events, or operator availability. We will notify you promptly of
                any changes and work with you to provide suitable alternatives.
              </p>
            </div>

            {/* Rainy Day Alternatives */}
            <div className="border-l-4 border-accent pl-6">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Rainy Day Alternatives
              </h3>
              <p className="text-neutral-dark leading-relaxed mb-3">
                We understand that weather can impact your travel plans. For all
                outdoor activities, we include indoor and covered alternatives
                in your itinerary. In the event of severe weather:
              </p>
              <ul className="list-disc list-inside text-neutral-dark space-y-2 ml-2">
                <li>
                  We'll provide equally engaging indoor activities or
                  attractions
                </li>
                <li>
                  Rescheduling options are available for outdoor excursions
                </li>
                <li>
                  Full refunds are available if you choose to cancel specific
                  activities
                </li>
                <li>
                  Our local experts are equipped to adapt plans on short notice
                </li>
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Cancellation Policy
              </h3>
              <div className="text-neutral-dark space-y-3">
                <p>
                  We want you to feel confident booking with us. Here's our
                  cancellation policy:
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary min-w-fit">
                      60+ days:
                    </span>
                    <span>
                      Full refund of deposit (minus 5% processing fee)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary min-w-fit">
                      30-59 days:
                    </span>
                    <span>50% refund of deposit</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary min-w-fit">
                      14-29 days:
                    </span>
                    <span>25% refund of deposit</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary min-w-fit">
                      Less than 14 days:
                    </span>
                    <span>No refund</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm italic">
                  Travel insurance is recommended to protect against unforeseen
                  circumstances. We can recommend providers upon request.
                </p>
              </div>
            </div>

            {/* General Disclaimer */}
            <div className="bg-neutral-medium/10 rounded-lg p-6 border border-neutral-medium/30">
              <h3 className="text-lg font-semibold text-primary mb-3">
                General Terms
              </h3>
              <p className="text-sm text-neutral-dark leading-relaxed">
                Know a Local is not responsible for weather delays, force
                majeure events, pandemics, travel disruptions, or other
                circumstances beyond our control. We recommend comprehensive
                travel insurance. All activities are subject to local
                regulations and operator policies. Participants must follow
                safety guidelines provided by our partners and local
                authorities. By booking with us, you acknowledge that outdoor
                activities carry inherent risks and agree to participate at your
                own discretion.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
