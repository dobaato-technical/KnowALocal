export const toursMockData = [
  {
    id: 1,
    slug: "cape-forchu",
    title: "Cape Forchu",
    image: "/LandingImages/cape-forchu.jpg",
    description:
      "A dramatic coastal lighthouse with rugged cliffs, ocean views, and unforgettable sunsets.",
    rating: 4.8,
    location: "Yarmouth, Nova Scotia",
    fullDescription:
      "Experience the iconic Cape Forchu Lightstation, perched on the edge of dramatic cliffs. This scenic coastal tour combines lighthouse history, stunning ocean views, and a chance to witness some of Nova Scotia's most breathtaking sunsets.",
    duration: "4 hours",
    difficulty: "Easy",
    specialties: [
      {
        id: "cape-1",
        name: "Lobster Roll",
        description:
          "Fresh local lobster meat on a toasted bun with a touch of mayo",
        price: 18,
        icon: "🦞",
      },
      {
        id: "cape-2",
        name: "Clam Chowder",
        description:
          "Creamy Nova Scotia clam chowder served with buttered crackers",
        price: 12,
        icon: "🍲",
      },
      {
        id: "cape-3",
        name: "Blueberry Pie",
        description: "Homemade blueberry pie with vanilla ice cream",
        price: 8,
        icon: "🥧",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Lighthouse Tour",
        activities: [
          { time: "9:00 AM", activity: "Meet at parking lot" },
          { time: "9:30 AM", activity: "Guided lighthouse tour and history" },
          { time: "10:30 AM", activity: "Explore the rocky shores" },
          { time: "12:00 PM", activity: "Lunch break at scenic viewpoint" },
        ],
      },
      {
        day: 2,
        title: "Cliff Walking & Sunset",
        activities: [
          { time: "2:00 PM", activity: "Guided cliff-side walking trail" },
          { time: "3:30 PM", activity: "Photography session opportunities" },
          { time: "5:00 PM", activity: "Sunset viewing at prime location" },
          { time: "6:30 PM", activity: "Return to base" },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "port-maitland-beach",
    title: "Port Maitland Beach",
    image: "/LandingImages/port-maitland-beach.jpg",
    description:
      "A peaceful sandy beach perfect for long walks, fresh sea air, and quiet relaxation.",
    rating: 4.6,
    location: "Port Maitland, Nova Scotia",
    fullDescription:
      "Discover the serene Port Maitland Beach, a hidden gem perfect for those seeking tranquility. This pristine sandy beach offers miles of walking space, fresh maritime air, and the perfect backdrop for relaxation and reflection.",
    duration: "Full Day",
    difficulty: "Easy",
    specialties: [
      {
        id: "port-1",
        name: "Scallop Pasta",
        description:
          "Pan-seared local scallops with garlic butter and fresh herbs",
        price: 22,
        icon: "🍝",
      },
      {
        id: "port-2",
        name: "Fish & Chips",
        description: "Crispy battered local fish served with hand-cut fries",
        price: 14,
        icon: "🍟",
      },
      {
        id: "port-3",
        name: "Strawberry Shortcake",
        description:
          "Fresh local strawberries with whipped cream and sponge cake",
        price: 9,
        icon: "🍓",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Beach Exploration & Relaxation",
        activities: [
          { time: "8:00 AM", activity: "Meet at beach entrance" },
          { time: "8:30 AM", activity: "Guided nature walk along shoreline" },
          { time: "10:00 AM", activity: "Shell and sea glass collecting" },
          { time: "12:00 PM", activity: "Picnic lunch on the beach" },
        ],
      },
      {
        day: 2,
        title: "Water Activities & Relaxation",
        activities: [
          { time: "2:00 PM", activity: "Paddle boarding or kayaking lessons" },
          { time: "3:30 PM", activity: "Free time for swimming or walking" },
          { time: "5:00 PM", activity: "Beach bonfire setup" },
          { time: "7:00 PM", activity: "Sunset gathering and return" },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "smuggler-cove",
    title: "Smuggler Cove",
    image: "/LandingImages/smuggler-cove.jpg",
    description:
      "A hidden coastal gem with rocky shores, calm waters, and a sense of untouched beauty.",
    rating: 4.7,
    location: "Smuggler Cove, Nova Scotia",
    fullDescription:
      "Uncover the mysteries of Smuggler Cove, a secluded coastal treasure with rich maritime history. Explore rocky formations, calm azure waters, and pristine beaches in this untouched natural paradise.",
    duration: "Full Day",
    difficulty: "Moderate",
    specialties: [
      {
        id: "smuggler-1",
        name: "Grilled Mussels",
        description:
          "Fresh Prince Edward Island mussels grilled with white wine and garlic",
        price: 16,
        icon: "🐚",
      },
      {
        id: "smuggler-2",
        name: "Smoked Salmon Platter",
        description:
          "Local smoked salmon served with capers, cream cheese, and bagels",
        price: 20,
        icon: "🍣",
      },
      {
        id: "smuggler-3",
        name: "Chocolate Mousse",
        description: "Rich dark chocolate mousse with fresh berries",
        price: 7,
        icon: "🍫",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "History & Exploration",
        activities: [
          { time: "8:00 AM", activity: "Meet and historical briefing" },
          { time: "8:30 AM", activity: "Guided hiking to the cove" },
          { time: "10:00 AM", activity: "Explore hidden caves and formations" },
          { time: "12:00 PM", activity: "Lunch with ocean views" },
        ],
      },
      {
        day: 2,
        title: "Water Adventures",
        activities: [
          { time: "2:00 PM", activity: "Snorkeling in calm waters" },
          { time: "3:30 PM", activity: "Sea creature spotting tour" },
          { time: "5:00 PM", activity: "Photography time" },
          { time: "6:30 PM", activity: "Return journey" },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "lake-adventures",
    title: "Lake Adventures",
    image: "/LandingImages/lake-adventures.jpg",
    description:
      "Enjoy outdoor thrills including mountain biking, kayaking, and paddle boarding in scenic surroundings.",
    rating: 4.9,
    location: "Mountain Lakes, Nova Scotia",
    fullDescription:
      "Get your adrenaline pumping with Lake Adventures! This action-packed tour combines mountain biking, kayaking, and water sports in stunning lakeside settings. Perfect for adventure seekers of all levels.",
    duration: "2 Days",
    difficulty: "Hard",
    specialties: [
      {
        id: "lake-1",
        name: "BBQ Salmon",
        description:
          "Grilled fresh salmon fillet with maple glaze and roasted vegetables",
        price: 24,
        icon: "🍗",
      },
      {
        id: "lake-2",
        name: "Energy Granola Bars",
        description: "Homemade granola bars with nuts, oats, and local honey",
        price: 5,
        icon: "🥜",
      },
      {
        id: "lake-3",
        name: "Apple Crumble",
        description: "Warm apple crumble with cinnamon and vanilla ice cream",
        price: 8,
        icon: "🍎",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Mountain Biking & Lake Exploration",
        activities: [
          { time: "9:00 AM", activity: "Meet and equipment distribution" },
          {
            time: "9:30 AM",
            activity: "Mountain biking trail (beginner friendly)",
          },
          { time: "11:30 AM", activity: "Rest and refreshments" },
          { time: "12:30 PM", activity: "Lunch break" },
          { time: "2:00 PM", activity: "Advanced biking trails" },
          { time: "5:00 PM", activity: "Return to base" },
        ],
      },
      {
        day: 2,
        title: "Water Sports Extravaganza",
        activities: [
          { time: "8:00 AM", activity: "Breakfast and briefing" },
          { time: "9:00 AM", activity: "Kayaking lessons and paddling" },
          { time: "11:00 AM", activity: "Paddle boarding session" },
          { time: "1:00 PM", activity: "Picnic lunch at lakeside" },
          { time: "2:30 PM", activity: "Free time for activities" },
          { time: "4:00 PM", activity: "Closing ceremony and departure" },
        ],
      },
    ],
  },
];
