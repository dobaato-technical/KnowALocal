// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { FaFacebook, FaInstagram } from "react-icons/fa";

// interface Footer7Props {
//   logo?: {
//     url: string;
//     src: string;
//     alt: string;
//     title: string;
//   };
//   description?: string;
//   socialLinks?: Array<{
//     icon: React.ComponentType<{ className?: string }>;
//     href: string;
//     label: string;
//   }>;
//   contactInfo?: {
//     email: string;
//     phone: string;
//     address?: string;
//   };
// }

// const defaultSocialLinks: Footer7Props["socialLinks"] = [
//   {
//     icon: FaFacebook as React.ComponentType<{ className?: string }>,
//     href: "#",
//     label: "Facebook",
//   },
//   {
//     icon: FaInstagram as React.ComponentType<{ className?: string }>,
//     href: "#",
//     label: "Instagram",
//   },
// ];

// export const Footer7 = ({
//   logo = {
//     url: "/",
//     src: "/Logo/logo-removebg-preview.png",
//     alt: "Know A Local Logo",
//     title: "Know A Local",
//   },
//   description = "Discover authentic travel experiences across Canada, guided by local knowledge, nature, and care.",
//   socialLinks = defaultSocialLinks,
//   contactInfo = {
//     email: "Knowalocaltours@gmail.com",
//     phone: "902-774-0710",
//     address: "Yarmouth, Nova Scotia",
//   },
// }: Footer7Props) => {
//   return (
//     <footer className="bg-primary text-bg py-12 md:py-16">
//       <div className="mx-auto max-w-7xl px-4 md:px-8">
//         {/* Main Footer Content */}
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12 lg:gap-16">
//           {/* Left: Logo + Description + Social */}
//           <div className="flex flex-col gap-4">
//             <Link href={logo.url} className="inline-block w-fit">
//               <Image
//                 src={logo.src}
//                 alt={logo.alt}
//                 width={100}
//                 height={100}
//                 className="h-auto w-20 object-contain"
//               />
//             </Link>
//             <p className="text-sm leading-relaxed text-bg/90">{description}</p>
//             <ul className="flex items-center gap-4">
//               {socialLinks.map((social, idx) => {
//                 const IconComponent = social.icon;
//                 return (
//                   <li
//                     key={idx}
//                     className="text-bg hover:text-accent transition-colors"
//                   >
//                     <a href={social.href} aria-label={social.label}>
//                       <IconComponent className="size-5" />
//                     </a>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>

//           {/* Company Section */}
//           <div>
//             <h3 className="mb-4 font-heading text-lg font-semibold text-bg">
//               Company
//             </h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link
//                   href="#about"
//                   className="text-sm text-bg/80 hover:text-accent transition-colors"
//                 >
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="#tours"
//                   className="text-sm text-bg/80 hover:text-accent transition-colors"
//                 >
//                   Tours
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="#hero"
//                   className="text-sm text-bg/80 hover:text-accent transition-colors"
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="#faq"
//                   className="text-sm text-bg/80 hover:text-accent transition-colors"
//                 >
//                   FAQ
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Support Center */}
//           <div>
//             <h3 className="mb-4 font-heading text-lg font-semibold text-bg">
//               Support Center
//             </h3>
//             <div className="space-y-3 text-sm text-bg/80">
//               <div>
//                 <p className="text-xs uppercase tracking-wide text-bg/70 mb-1">
//                   Email
//                 </p>
//                 <a
//                   href={`mailto:${contactInfo.email}`}
//                   className="hover:text-accent transition-colors"
//                 >
//                   {contactInfo.email}
//                 </a>
//               </div>
//               <div>
//                 <p className="text-xs uppercase tracking-wide text-bg/70 mb-1">
//                   Phone
//                 </p>
//                 <a
//                   href={`tel:${contactInfo.phone}`}
//                   className="hover:text-accent transition-colors"
//                 >
//                   {contactInfo.phone}
//                 </a>
//               </div>
//               {contactInfo.address && (
//                 <div>
//                   <p className="text-xs uppercase tracking-wide text-bg/70 mb-1">
//                     Location
//                   </p>
//                   <p className="hover:text-accent transition-colors">
//                     {contactInfo.address}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Legal Information */}
//           <div>
//             <h3 className="mb-4 font-heading text-lg font-semibold text-bg">
//               Legal Information
//             </h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link
//                   href="/privacy-policy"
//                   className="text-sm text-bg/80 hover:text-accent transition-colors"
//                 >
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/terms-and-conditions"
//                   className="text-sm text-bg/80 hover:text-accent transition-colors"
//                 >
//                   Terms and Conditions
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Bar - Copyright */}
//         <div className="mt-12 border-t border-bg/20 pt-8">
//           <p className="text-center text-xs text-bg/70">
//             © {new Date().getFullYear()} Know A Local. All rights reserved.
//             <span className="ml-2">| Crafted by Dobaato</span>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer7;
