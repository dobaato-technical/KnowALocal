import { defineField, defineType } from "sanity";

export const tour = defineType({
  name: "tour",
  title: "Tour Location",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(5),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Fixed duration for all tours: 2 Hours",
      initialValue: "2 Hours",
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty Level",
      type: "string",
      options: {
        list: ["Easy", "Moderate", "Challenging"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tourType",
      title: "Tour Type",
      type: "string",
      options: {
        list: ["standard", "adventure", "hiking", "water"],
      },
      description:
        "Standard tours use default layout. Adventure/hiking/water tours get specialized design.",
    }),
    defineField({
      name: "basePrice",
      title: "Base Tour Price ($)",
      type: "number",
      description: "Main tour price (e.g., 250 for Cape Forchu)",
    }),
    defineField({
      name: "maxGroupSize",
      title: "Maximum Group Size",
      type: "number",
      description: "Maximum number of people allowed per tour",
    }),
    defineField({
      name: "minHeight",
      title: "Minimum Height (inches)",
      type: "number",
      description: "Minimum height requirement if applicable",
    }),
    defineField({
      name: "maxHeight",
      title: "Maximum Height (inches)",
      type: "number",
      description: "Maximum height limit if applicable",
    }),
    defineField({
      name: "maxWeight",
      title: "Maximum Weight (lbs)",
      type: "number",
      description: "Weight limit if applicable",
    }),
    defineField({
      name: "minAge",
      title: "Minimum Age",
      type: "number",
      description: "Minimum age requirement",
    }),
    defineField({
      name: "maxAge",
      title: "Maximum Age",
      type: "number",
      description: "Maximum age limit if applicable",
    }),
    defineField({
      name: "tourInclusions",
      title: "What's Included",
      type: "array",
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
              description: "Optional icon or emoji (e.g., 📸 for photos)",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "keyRequirements",
      title: "Key Requirements",
      type: "array",
      description:
        "Pre-tour requirements (height, footwear, fitness level, etc.)",
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
            },
          ],
        },
      ],
    }),
    defineField({
      name: "safetyWarnings",
      title: "Safety Warnings & Disclaimers",
      type: "array",
      description: "Important safety information for guests",
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
    defineField({
      name: "towerOrClimbingDetails",
      title: "Tower / Climbing Details",
      type: "object",
      description: "Specific climbing or tower information",
      fields: [
        {
          name: "stepCount",
          title: "Number of Steps",
          type: "number",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
        },
        {
          name: "diameter",
          title: "Tower Diameter (feet)",
          type: "number",
        },
        {
          name: "specialInstructions",
          title: "Special Instructions",
          type: "text",
        },
      ],
    }),
    defineField({
      name: "specialties",
      title: "Add-ons / Specialties",
      type: "array",
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
    defineField({
      name: "itinerary",
      title: "Tour Itinerary",
      description: "Timeline of activities for the 2-hour tour experience",
      type: "array",
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
                      name: "time",
                      title: "Time",
                      type: "string",
                      description: "e.g., '2:00 PM' or '30 mins'",
                    },
                    {
                      name: "activity",
                      title: "Activity",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: {
                      time: "time",
                      activity: "activity",
                    },
                    prepare({ time, activity }) {
                      return {
                        title: `${time || "No time"} - ${activity}`,
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
