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
      name: "specialties",
      title: "Specialties (Food/Experiences)",
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
          ],
        },
      ],
    }),
    defineField({
      name: "itinerary",
      title: "Itinerary",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              title: "Day Number",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: "title",
              title: "Day Title",
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
              day: "day",
              title: "title",
            },
            prepare({ day, title }) {
              return {
                title: `Day ${day}: ${title}`,
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
