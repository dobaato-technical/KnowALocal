import { TCData } from "../types";

export const termsAndConditionsData: TCData = {
  lastUpdated: "February 9, 2026",
  sections: [
    {
      id: "booking-cancellation",
      title: "Booking & Cancellation Policy",
      description:
        "Understanding our booking process and cancellation terms will help you plan your Canadian adventure with confidence.",
      clauses: [
        {
          heading: "Booking Confirmation",
          content:
            "Once you submit a booking request, you will receive a confirmation email within 24 hours. Your spot on the tour is reserved only after payment has been received in full. We recommend booking at least 14 days before your desired travel date to ensure availability.",
        },
        {
          heading: "Cancellation Terms",
          content:
            "Cancellations made more than 30 days before the tour date will receive a full refund. Cancellations made 15-30 days before will incur a 50% cancellation fee. Cancellations made less than 15 days before the tour are non-refundable. Natural disasters or extreme weather may result in tour postponement or cancellation at our discretion.",
        },
        {
          heading: "Rescheduling",
          content:
            "If you need to reschedule your tour, please notify us at least 21 days in advance. Rescheduling is subject to availability and may incur an additional fee if selecting a premium date. No rescheduling is permitted within 15 days of the original tour date.",
        },
        {
          heading: "No Shows",
          content:
            "If you do not arrive for your booked tour and have not cancelled at least 24 hours in advance, the full tour price will be forfeited with no refund or rescheduling permitted.",
        },
      ],
    },
    {
      id: "payment-terms",
      title: "Payment Terms",
      description:
        "All payments must be made according to the following terms to secure your booking.",
      clauses: [
        {
          heading: "Payment Methods",
          content:
            "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and digital payment platforms. All payments must be in Canadian dollars unless otherwise agreed upon in writing.",
        },
        {
          heading: "Payment Schedule",
          content:
            "A 50% deposit is required to secure your booking. The remaining balance must be paid in full at least 14 days before your tour date. Payments not received by the deadline will result in automatic cancellation of your reservation.",
        },
        {
          heading: "Currency & Fees",
          content:
            "All tour prices are quoted in Canadian dollars (CAD). Credit card processing fees, if any, are the responsibility of the customer. International bank transfers may incur additional fees determined by your financial institution.",
        },
        {
          heading: "Invoicing",
          content:
            "Upon payment, you will receive an itemized invoice detailing all tour inclusions, prices, and terms. Please retain this for your records and reference during your tour.",
        },
      ],
    },
    {
      id: "liability-disclaimers",
      title: "Liability & Disclaimers",
      description:
        "Please read our liability limitations and important disclaimers carefully before booking.",
      clauses: [
        {
          heading: "Assumption of Risk",
          content:
            "All tours involve physical activity and travel in natural environments. By booking with us, you acknowledge and assume all risks associated with outdoor activities, including but not limited to falls, exposure to weather, wildlife encounters, and water-related incidents. Participants must be in good physical health and disclose any medical conditions upon booking.",
        },
        {
          heading: "Limitation of Liability",
          content:
            "Know a Local and its guides, employees, and partners are not liable for any indirect, incidental, consequential, or punitive damages arising from your participation in our tours. Our total liability is limited to the amount paid for the tour. This includes but is not limited to: personal injury, property damage, travel delays, accommodation issues, or missed connections.",
        },
        {
          heading: "Exclusions",
          content:
            "We are not responsible for claims arising from: your failure to obtain proper travel documents or insurance; pre-existing medical conditions; use of alcohol or drugs; non-compliance with guide instructions; personal negligence; or acts of God and force majeure events.",
        },
        {
          heading: "Travel Insurance",
          content:
            "We strongly recommend purchasing comprehensive travel insurance that includes trip cancellation, medical emergencies, and evacuation coverage. Travel insurance is not included in tour pricing and is your responsibility.",
        },
      ],
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      description:
        "As a participant, you agree to uphold these responsibilities for a safe and enjoyable experience.",
      clauses: [
        {
          heading: "Physical Fitness & Health Disclosure",
          content:
            "You are responsible for assessing your physical fitness level against the tour difficulty rating. You must disclose all medical conditions, allergies, medications, and physical limitations at the time of booking. Failure to disclose relevant health information may result in exclusion from the tour without refund.",
        },
        {
          heading: "Compliance with Instructions",
          content:
            "You must follow all instructions provided by our guides, local partners, and venue operators. This includes safety briefings, trail rules, and facility policies. Non-compliance may result in immediate removal from the tour.",
        },
        {
          heading: "Personal Conduct",
          content:
            "You agree to treat guides, fellow participants, local communities, and wildlife with respect. Behavior that is dangerous, disruptive, discriminatory, or harmful to others will result in immediate removal from the tour. No refunds will be provided for removals due to misconduct.",
        },
        {
          heading: "Equipment & Attire",
          content:
            "You are responsible for bringing appropriate clothing and equipment for the tour conditions. We provide a detailed packing list upon booking. Inadequate preparation may limit your ability to participate fully in some activities.",
        },
      ],
    },
    {
      id: "dispute-resolution",
      title: "Dispute Resolution",
      description:
        "In the event of a dispute, we follow these steps to reach a fair resolution.",
      clauses: [
        {
          heading: "Complaint Procedure",
          content:
            "Any concerns or complaints must be submitted in writing within 30 days of your tour. Please include: (1) your booking reference number, (2) specific details of the issue, (3) date and time of the incident, and (4) supporting documentation. Email complaints to: knowalocaltours@gmail.com",
        },
        {
          heading: "Resolution Process",
          content:
            "Upon receipt of a formal complaint, we will respond within 10 business days with our investigation findings. We will work with you in good faith to resolve the issue. If initial resolution is not reached, we offer mediation through a neutral third party at our expense.",
        },
        {
          heading: "Governing Law",
          content:
            "These Terms and Conditions are governed by the laws of Nova Scotia, Canada. Any legal action or proceeding arising under these terms shall be subject to the exclusive jurisdiction of the courts of Nova Scotia.",
        },
        {
          heading: "Binding Arbitration",
          content:
            "By booking with Know a Local, you agree that any unresolved disputes will be settled through binding arbitration rather than court proceedings. Arbitration will be conducted by a mutually agreed upon arbitrator in accordance with Canadian Arbitration Act rules.",
        },
      ],
    },
  ],
};
