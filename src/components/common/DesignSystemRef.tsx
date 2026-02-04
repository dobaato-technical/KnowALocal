// /**
//  * DesignSystemRef.tsx
//  *
//  * Quick reference component for the Tailwind Design System (Component-based)
//  * Keep this visible while building components
//  *
//  * 🧠 GOLDEN RULES:
//  * 1. Accent ONLY on primary buttons
//  * 2. Never use more than 3 colors in one component
//  * 3. Text = neutral-dark on light backgrounds
//  * 4. Primary = structure, Accent = action
//  * 5. When confused → choose the more neutral option
//  */

// import { Alert } from "@/components/ui/Alert";
// import Button from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";
// import {
//   FooterLink,
//   FooterSection,
//   SimpleFooter,
// } from "@/components/ui/Footer";
// import { NavLink, SimpleNavbar } from "@/components/ui/Navbar";

// // ============================================
// // BUTTONS
// // ============================================

// export const ButtonExamples = () => (
//   <div className="space-y-4 p-6">
//     <Button variant="primary">Get Started</Button>
//     <Button variant="secondary">Learn More</Button>
//     <Button variant="subtle">View details →</Button>
//     <Button variant="primary" size="sm">
//       Apply
//     </Button>
//     <Button variant="secondary" size="sm">
//       Cancel
//     </Button>
//   </div>
// );

// // ============================================
// // CARDS
// // ============================================

// export const CardExamples = () => (
//   <div className="space-y-4 p-6">
//     <Card>
//       <h3>Standard Card</h3>
//       <p className="text-secondary text-sm">
//         bg-neutral-light with subtle shadow
//       </p>
//     </Card>
//     <Card highlight>
//       <h3>Featured</h3>
//       <p className="text-neutral-dark">
//         bg-neutral-medium with accent left border
//       </p>
//     </Card>
//     <Card size="lg">
//       <h3>Travel Experience</h3>
//       <p className="text-secondary text-sm">Description goes here</p>
//     </Card>
//   </div>
// );

// // ============================================
// // ALERTS
// // ============================================

// export const AlertExamples = () => (
//   <div className="space-y-3 p-6">
//     <Alert variant="success">✓ Successfully saved!</Alert>
//     <Alert variant="warning">⚠ Limited spots available</Alert>
//     <Alert variant="info">ℹ New experience added</Alert>
//   </div>
// );

// // ============================================
// // FORMS
// // ============================================

// export const FormExample = () => (
//   <div className="space-y-4 p-6 max-w-md">
//     <div>
//       <label htmlFor="email" className="label">
//         Email Address
//       </label>
//       <input
//         id="email"
//         type="email"
//         placeholder="you@example.com"
//         className="input"
//       />
//     </div>
//     <div>
//       <label htmlFor="message" className="label">
//         Message
//       </label>
//       <textarea
//         id="message"
//         placeholder="Your message..."
//         className="input"
//         rows={4}
//       />
//     </div>
//     <Button variant="primary" className="w-full">
//       Send
//     </Button>
//   </div>
// );

// // ============================================
// // NAVIGATION & FOOTER
// // ============================================

// export const NavbarExample = () => (
//   <SimpleNavbar logo="Know A Local">
//     <NavLink href="/">Home</NavLink>
//     <NavLink href="/about" active>
//       About
//     </NavLink>
//     <NavLink href="/locations">Locations</NavLink>
//     <Button variant="primary" size="sm">
//       Sign In
//     </Button>
//   </SimpleNavbar>
// );

// export const FooterExample = () => (
//   <SimpleFooter>
//     <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
//       <FooterSection title="Company">
//         <FooterLink href="/about">About</FooterLink>
//         <FooterLink href="/careers">Careers</FooterLink>
//       </FooterSection>
//       <FooterSection title="Support">
//         <FooterLink href="/help">Help Center</FooterLink>
//         <FooterLink href="/contact">Contact</FooterLink>
//       </FooterSection>
//       <FooterSection title="Legal">
//         <FooterLink href="/privacy">Privacy</FooterLink>
//         <FooterLink href="/terms">Terms</FooterLink>
//       </FooterSection>
//     </div>
//   </SimpleFooter>
// );

// // ============================================
// // TYPOGRAPHY
// // ============================================

// export const TypographyExamples = () => (
//   <div className="space-y-4 p-6">
//     <h1>Heading 1 - Authority</h1>
//     <h2>Heading 2 - Main Section</h2>
//     <h3>Heading 3 - Subsection</h3>
//     <p className="text-neutral-dark font-body leading-relaxed">
//       Main body content. Use neutral-dark for readability on neutral-light
//       backgrounds.
//     </p>
//     <p className="text-secondary text-sm">
//       Meta information, descriptions, supporting details
//     </p>
//     <p className="text-muted">Disabled state, timestamps, helper text</p>
//   </div>
// );

// // ============================================
// // COLOR PALETTE REFERENCE
// // ============================================

// export const ColorPaletteRef = () => (
//   <div className="p-6 space-y-4">
//     <div className="grid grid-cols-2 gap-4">
//       <div className="space-y-2">
//         <div className="bg-primary w-full h-24 rounded-lg" />
//         <p className="font-medium">Primary</p>
//         <p className="text-sm text-secondary">#335358</p>
//         <p className="text-xs text-muted">Headings, navbar, structure</p>
//       </div>
//       <div className="space-y-2">
//         <div className="bg-secondary w-full h-24 rounded-lg" />
//         <p className="font-medium">Secondary</p>
//         <p className="text-sm text-secondary">#69836a</p>
//         <p className="text-xs text-muted">Supporting, subtext, icons</p>
//       </div>
//       <div className="space-y-2">
//         <div className="bg-accent w-full h-24 rounded-lg" />
//         <p className="font-medium">Accent</p>
//         <p className="text-sm text-secondary">#d69850</p>
//         <p className="text-xs text-muted">CTAs, hover (5-10% max)</p>
//       </div>
//       <div className="space-y-2">
//         <div className="bg-neutral-light border border-secondary w-full h-24 rounded-lg" />
//         <p className="font-medium">Neutral Light</p>
//         <p className="text-sm text-secondary">#f8f1dd</p>
//         <p className="text-xs text-muted">Page background</p>
//       </div>
//       <div className="space-y-2">
//         <div className="bg-neutral-medium w-full h-24 rounded-lg" />
//         <p className="font-medium">Neutral Medium</p>
//         <p className="text-sm text-secondary">#bcd2c2</p>
//         <p className="text-xs text-muted">Section & card background</p>
//       </div>
//       <div className="space-y-2">
//         <div className="bg-neutral-dark w-full h-24 rounded-lg" />
//         <p className="font-medium text-neutral-light">Neutral Dark</p>
//         <p className="text-sm text-secondary">#774738</p>
//         <p className="text-xs text-muted">Body text</p>
//       </div>
//     </div>
//   </div>
// );

// // ============================================
// // RULES CHECKLIST
// // ============================================

// export const DesignRulesChecklist = () => (
//   <Card highlight>
//     <h3>Design System Quick Rules</h3>
//     <div className="space-y-2 text-sm mt-4">
//       <div className="flex gap-2">
//         ✓{" "}
//         <span>
//           Accent color <strong>only</strong> on primary buttons
//         </span>
//       </div>
//       <div className="flex gap-2">
//         ✓ <span>Never use more than 3 colors in one component</span>
//       </div>
//       <div className="flex gap-2">
//         ✓ <span>Text = neutral-dark on neutral-light</span>
//       </div>
//       <div className="flex gap-2">
//         ✓ <span>Primary = structure, Accent = action</span>
//       </div>
//       <div className="flex gap-2">
//         ✓ <span>When confused → pick the neutral option</span>
//       </div>
//       <div className="flex gap-2">
//         ✓{" "}
//         <span>
//           Page: neutral-light | Section: neutral-medium | Card: neutral-light
//         </span>
//       </div>
//     </div>
//   </Card>
// );
