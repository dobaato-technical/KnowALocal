// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";

// // =====================================================
// // OPTION 1: GRADIENT FRAME CARDS
// // Cards with colored borders and elevated shadows
// // =====================================================
// export function CardOption1() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 40 }}
//       whileInView={{ opacity: 1, x: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.8 }}
//       className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
//     >
//       {/* Background Image 1 - Primary with secondary border */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className="absolute top-0 left-0 w-[65%] h-[70%] p-1 bg-gradient-to-br from-secondary to-primary rounded-2xl overflow-hidden shadow-2xl"
//       >
//         <div className="w-full h-full bg-neutral-light rounded-xl overflow-hidden">
//           <Image
//             src="/LandingImages/cape-forchu.jpg"
//             alt="Cape Forchu"
//             fill
//             className="object-cover"
//           />
//         </div>
//       </motion.div>

//       {/* Background Image 2 - Secondary with accent border */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.4 }}
//         className="absolute bottom-0 right-0 w-[60%] h-[65%] p-1 bg-gradient-to-tl from-accent to-secondary rounded-2xl overflow-hidden shadow-2xl"
//       >
//         <div className="w-full h-full bg-neutral-light rounded-xl overflow-hidden">
//           <Image
//             src="/LandingImages/brier-island-whale-tours.jpg"
//             alt="Whale Tours"
//             fill
//             className="object-cover"
//           />
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // =====================================================
// // OPTION 2: ASYMMETRIC STAGGERED
// // One large primary, one smaller accent with offset
// // =====================================================
// export function CardOption2() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 40 }}
//       whileInView={{ opacity: 1, x: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.8 }}
//       className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-end"
//     >
//       {/* Large Primary Image - Right side */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className="relative w-[75%] h-[85%] rounded-3xl overflow-hidden shadow-2xl"
//       >
//         <Image
//           src="/LandingImages/cape-forchu.jpg"
//           alt="Cape Forchu"
//           fill
//           className="object-cover"
//         />
//       </motion.div>

//       {/* Small Accent Image - Top left, overlapping */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.4 }}
//         className="absolute top-0 left-0 w-[45%] h-[50%] rounded-2xl overflow-hidden shadow-lg border-4 border-neutral-light bg-secondary/50"
//       >
//         <Image
//           src="/LandingImages/brier-island-whale-tours.jpg"
//           alt="Whale Tours"
//           fill
//           className="object-cover"
//         />
//       </motion.div>
//     </motion.div>
//   );
// }

// // =====================================================
// // OPTION 3: FLOATING LAYERED
// // Overlapping with floating shadow effect & organic spacing
// // =====================================================
// export function CardOption3() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 40 }}
//       whileInView={{ opacity: 1, x: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.8 }}
//       className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
//     >
//       {/* Back layer with floating shadow */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className="absolute top-8 right-12 w-[65%] h-[65%] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow"
//       >
//         <Image
//           src="/LandingImages/cape-forchu.jpg"
//           alt="Cape Forchu"
//           fill
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
//       </motion.div>

//       {/* Front layer with depth */}
//       <motion.div
//         initial={{ opacity: 0, y: -30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.4 }}
//         className="absolute bottom-4 left-0 w-[65%] h-[65%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
//       >
//         <Image
//           src="/LandingImages/brier-island-whale-tours.jpg"
//           alt="Whale Tours"
//           fill
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
//       </motion.div>

//       {/* Accent circle decoration */}
//       <div className="absolute top-1/3 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10" />
//     </motion.div>
//   );
// }

// // =====================================================
// // OPTION 4: CONTENT BADGE OVERLAY
// // Main image with floating text badge positioned on side
// // =====================================================
// export function CardOption4() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 40 }}
//       whileInView={{ opacity: 1, x: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.8 }}
//       className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
//     >
//       {/* Main Image */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
//       >
//         <Image
//           src="/LandingImages/cape-forchu.jpg"
//           alt="Cape Forchu"
//           fill
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
//       </motion.div>

//       {/* Floating Experience Badge - Bottom Right */}
//       <motion.div
//         initial={{ opacity: 0, y: 20, scale: 0.9 }}
//         whileInView={{ opacity: 1, y: 0, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, delay: 0.5 }}
//         className="absolute -bottom-6 -right-4 w-[55%] bg-neutral-light rounded-2xl shadow-2xl p-6 border-4 border-accent"
//       >
//         <Image
//           src="/LandingImages/brier-island-whale-tours.jpg"
//           alt="Whale Tours"
//           width={300}
//           height={200}
//           className="w-full h-40 object-cover rounded-lg mb-3"
//         />
//         <h4 className="text-primary font-heading font-bold text-sm">
//           Explore More
//         </h4>
//         <p className="text-neutral-dark text-xs leading-relaxed">
//           Whale tours & hidden gems await
//         </p>
//       </motion.div>
//     </motion.div>
//   );
// }

// // =====================================================
// // DEMO COMPONENT - Shows all 4 options
// // =====================================================
// export default function CardDesignOptions() {
//   return (
//     <div className="w-full py-20 bg-gradient-to-b from-neutral-light to-neutral-medium">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-4xl font-heading font-bold text-primary text-center mb-2">
//           Card Design Options
//         </h1>
//         <p className="text-center text-neutral-dark/70 mb-20">
//           Choose your favorite style below
//         </p>

//         {/* Option 1 */}
//         <div className="mb-20">
//           <h2 className="text-2xl font-heading font-bold text-primary mb-8">
//             Option 1: Gradient Frame Cards
//           </h2>
//           <div className="bg-neutral-light rounded-xl p-8">
//             <CardOption1 />
//           </div>
//           <p className="text-neutral-dark mt-4 text-sm">
//             Colored gradient borders with elevated shadows. Modern and polished
//             feel.
//           </p>
//         </div>

//         {/* Option 2 */}
//         <div className="mb-20">
//           <h2 className="text-2xl font-heading font-bold text-primary mb-8">
//             Option 2: Asymmetric Staggered
//           </h2>
//           <div className="bg-neutral-light rounded-xl p-8">
//             <CardOption2 />
//           </div>
//           <p className="text-neutral-dark mt-4 text-sm">
//             One large primary image with smaller accent overlapping. Dynamic &
//             bold.
//           </p>
//         </div>

//         {/* Option 3 */}
//         <div className="mb-20">
//           <h2 className="text-2xl font-heading font-bold text-primary mb-8">
//             Option 3: Floating Layered
//           </h2>
//           <div className="bg-neutral-light rounded-xl p-8">
//             <CardOption3 />
//           </div>
//           <p className="text-neutral-dark mt-4 text-sm">
//             Overlapping cards with hover effects and floating shadows. Elegant &
//             organic.
//           </p>
//         </div>

//         {/* Option 4 */}
//         <div className="mb-20">
//           <h2 className="text-2xl font-heading font-bold text-primary mb-8">
//             Option 4: Content Badge Overlay
//           </h2>
//           <div className="bg-neutral-light rounded-xl p-8">
//             <CardOption4 />
//           </div>
//           <p className="text-neutral-dark mt-4 text-sm">
//             Main image with floating content badge. Modern & integrated. (Best
//             for smaller secondary image)
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
