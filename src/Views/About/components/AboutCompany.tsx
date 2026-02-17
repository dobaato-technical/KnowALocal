// "use client";

// import Button from "@/components/ui/Button";
// import { motion } from "framer-motion";
// import { CalendarDays, CreditCard, ShieldCheck } from "lucide-react";
// import Image from "next/image";

// export default function AboutCompany() {
//   const features = [
//     {
//       icon: CalendarDays,
//       title: "Easy Booking",
//       description:
//         "Discover availability through our intuitive calendar with open slots at 10am, 2pm, or 6pm.",
//     },
//     {
//       icon: CreditCard,
//       title: "Secure Payments",
//       description:
//         "Book seamlessly with secure Stripe payments supporting Visa, Mastercard, and Amex.",
//     },
//     {
//       icon: ShieldCheck,
//       title: "Guest Safety",
//       description:
//         "Clear cancellation policies and glowing reviews backed by your satisfaction guarantee.",
//     },
//   ];

//   return (
//     <div className="w-full overflow-hidden">
//       {/* Main Content Section */}
//       <section className="py-20 md:py-28 bg-neutral-light">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//             {/* Left: Image */}
//             <motion.div
//               initial={{ opacity: 0, x: -40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="relative h-[400px] sm:h-[500px] lg:h-[550px]"
//             >
//               <div className="absolute inset-0 bg-neutral-medium/40 rounded-3xl -z-10" />
//               <Image
//                 src="/LandingImages/lake-adventures.jpg"
//                 alt="Lake Adventures"
//                 fill
//                 className="object-cover rounded-3xl shadow-xl"
//               />
//             </motion.div>

//             {/* Right: Content */}
//             <motion.div
//               initial={{ opacity: 0, x: 40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="flex flex-col justify-center"
//             >
//               <span className="text-neutral-dark text-sm tracking-widest uppercase font-medium mb-3">
//                 Discover Experiences
//               </span>

//               <h2
//                 className="font-heading text-primary mb-8"
//                 style={{ fontSize: "clamp(32px, 5vw, 44px)" }}
//               >
//                 Guided Adventures
//                 <br />
//                 Await You
//               </h2>

//               <div className="space-y-6 mb-10">
//                 <p className="text-neutral-dark/85 text-lg leading-relaxed">
//                   Experience mountain biking, kayaking, paddle boarding, beach
//                   glass collecting, and wildlife exploration. Savor authentic
//                   local cuisine and discover hidden coastal gems with our expert
//                   guides.
//                 </p>
//               </div>

//               {/* Features */}
//               <div className="space-y-5 mb-10">
//                 {features.map((item, i) => (
//                   <motion.div
//                     key={item.title}
//                     initial={{ opacity: 0, y: 15 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.4 + i * 0.1 }}
//                     className="flex gap-4"
//                   >
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 rounded-full bg-neutral-medium flex items-center justify-center">
//                         <item.icon
//                           className="w-5 h-5 text-primary"
//                           strokeWidth={2}
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-heading text-primary font-semibold mb-1">
//                         {item.title}
//                       </h4>
//                       <p className="text-neutral-dark/70 text-sm leading-relaxed">
//                         {item.description}
//                       </p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.7 }}
//               >
//                 <Button
//                   variant="primary"
//                   size="md"
//                   className="w-full sm:w-auto"
//                 >
//                   View Available Tours
//                 </Button>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Contact CTA Section */}
//       <section className="py-20 md:py-28 bg-primary text-neutral-light relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -mr-40 -mt-40" />

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="font-heading text-3xl md:text-5xl font-bold mb-6"
//             style={{ fontSize: "clamp(28px, 5vw, 42px)" }}
//           >
//             Ready to Explore
//             <span className="block text-accent">Nova Scotia's Beauty?</span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-lg md:text-xl opacity-90 mb-12"
//           >
//             Contact us to start planning your custom adventure. Based in
//             Yarmouth, we're your gateway to authentic maritime magic.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3 }}
//             className="flex flex-col sm:flex-row justify-center gap-6 items-center"
//           >
//             <a
//               href="tel:9027740710"
//               className="group flex items-center gap-3 text-xl font-semibold hover:text-accent transition-colors"
//             >
//               <span className="w-12 h-12 rounded-full border-2 border-neutral-light flex items-center justify-center group-hover:border-accent group-hover:bg-neutral-light group-hover:text-primary transition-all">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//                 </svg>
//               </span>
//               902-774-0710
//             </a>
//             <a
//               href="mailto:knowalocaltours@gmail.com"
//               className="group flex items-center gap-3 text-xl font-semibold hover:text-accent transition-colors"
//             >
//               <span className="w-12 h-12 rounded-full border-2 border-neutral-light flex items-center justify-center group-hover:border-accent group-hover:bg-neutral-light group-hover:text-primary transition-all">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <rect width="20" height="16" x="2" y="4" rx="2" />
//                   <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//                 </svg>
//               </span>
//               knowalocaltours@gmail.com
//             </a>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }
