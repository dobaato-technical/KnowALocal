import { defineField, defineType } from "sanity";

export const tour = defineType({
  name: "tour",
  title: "Tour Location",
  type: "document",
  fieldsets: [
    {
      name: "basicInfo",
      title: "Basic Info",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "tourInfoCard",
      title: "Tour Info Card",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "detailedItinerary",
      title: "Detailed Itinerary",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "tourSpecialty",
      title: "Tour Specialty",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "whatsIncluded",
      title: "What's Included",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "keyRequirements",
      title: "Key Requirements",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "gallery",
      title: "Gallery",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "advanced",
      title: "Advanced Settings",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // BASIC INFO SECTION
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      fieldset: "basicInfo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "basicInfo",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      fieldset: "basicInfo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      fieldset: "basicInfo",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "text",
      fieldset: "basicInfo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Hero Image",
      type: "image",
      fieldset: "basicInfo",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      fieldset: "basicInfo",
      validation: (Rule) => Rule.required().min(0).max(5),
    }),
    defineField({
      name: "basePrice",
      title: "Base Tour Price ($)",
      type: "number",
      fieldset: "basicInfo",
      description: "Main tour price (e.g., 250 for Cape Forchu)",
    }),

    // TOUR INFO CARD SECTION
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      fieldset: "tourInfoCard",
      validation: (Rule) => Rule.required(),
      description: "Fixed duration for all tours: 2 Hours",
      initialValue: "2 Hours",
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty Level",
      type: "string",
      fieldset: "tourInfoCard",
      options: {
        list: ["Easy", "Moderate", "Challenging"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tourType",
      title: "Tour Type",
      type: "string",
      fieldset: "tourInfoCard",
      options: {
        list: ["standard", "adventure", "hiking", "water"],
      },
      description:
        "Standard tours use default layout. Adventure/hiking/water tours get specialized design.",
    }),
    defineField({
      name: "maxGroupSize",
      title: "Maximum Group Size",
      type: "number",
      fieldset: "tourInfoCard",
      description: "Maximum number of people allowed per tour",
    }),

    // DETAILED ITINERARY SECTION
    defineField({
      name: "itinerary",
      title: "Tour Itinerary",
      description: "Timeline of activities for the 2-hour tour experience",
      type: "array",
      fieldset: "detailedItinerary",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Section Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "activities",
              title: "Activities",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "activity",
                      title: "Activity",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: {
                      activity: "activity",
                    },
                    prepare({ activity }) {
                      return {
                        title: activity,
                      };
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: "title",
            },
            prepare({ title }) {
              return {
                title: title,
              };
            },
          },
        },
      ],
    }),

    // TOUR SPECIALTY SECTION
    defineField({
      name: "specialties",
      title: "Add-ons / Specialties",
      type: "array",
      fieldset: "tourSpecialty",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "price",
              title: "Price ($)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "icon",
              title: "Icon/Emoji",
              type: "string",
            },
            {
              name: "isClimbing",
              title: "Is Climbing/Tower Activity",
              type: "boolean",
              description: "Check if this add-on involves climbing",
            },
          ],
        },
      ],
    }),

    // WHAT'S INCLUDED SECTION
    defineField({
      name: "tourInclusions",
      title: "What's Included",
      type: "array",
      fieldset: "whatsIncluded",
      description: "Structured list of what's included in the tour",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Inclusion Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "icon",
              title: "Icon/Emoji",
              type: "string",
              description: "Icon or emoji (defaults to ✓)",
              initialValue: "✓",
            },
          ],
        },
      ],
    }),

    // KEY REQUIREMENTS SECTION
    defineField({
      name: "keyRequirements",
      title: "Key Requirements",
      type: "array",
      fieldset: "keyRequirements",
      description:
        "Leave empty if none. Pre-tour requirements (height, footwear, fitness level, etc.)",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Requirement Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "severity",
              title: "Severity",
              type: "string",
              options: {
                list: ["info", "warning", "critical"],
              },
              description: "Visual importance level",
            },
            {
              name: "icon",
              title: "Icon/Emoji",
              type: "string",
              description: "Icon or emoji (defaults to ✓)",
              initialValue: "✓",
            },
          ],
        },
      ],
    }),

    // GALLERY SECTION
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      fieldset: "gallery",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // ADVANCED SETTINGS SECTION
    defineField({
      name: "safetyWarnings",
      title: "Safety Warnings & Disclaimers (Optional)",
      type: "array",
      fieldset: "advanced",
      description:
        "Leave empty if none. Important safety information for guests",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Warning Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "level",
              title: "Alert Level",
              type: "string",
              options: {
                list: ["info", "warning", "danger"],
              },
              description: "Visual alert level",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      image: "image",
      rating: "rating",
      location: "location",
    },
    prepare(selection) {
      const { title, image, rating, location } = selection;
      return {
        title,
        subtitle: `${location} • ${rating}/5 ⭐`,
        media: image,
      };
    },
  },
});
