export type Stay = {
  slug: string;
  name: string;
  locationLine: string;
  imageSrc: string;
  sqft: string;
  beds: string;
  guests: string;
};

export const stays: Stay[] = [
  {
    slug: "coastal-garden-suite",
    name: "Coastal Garden Suite",
    locationLine: "Location of stay",
    imageSrc: "/img/stay-1.png",
    sqft: "480 sq.ft",
    beds: "1 Queen",
    guests: "2 Guests",
  },
  {
    slug: "ocean-view-king-suite",
    name: "Ocean View King Suite",
    locationLine: "Location of stay",
    imageSrc: "/img/stay-2.png",
    sqft: "550 sq.ft",
    beds: "1 King",
    guests: "2 Guests",
  },
  {
    slug: "sunset-loft",
    name: "Sunset Loft",
    locationLine: "Location of stay",
    imageSrc: "/img/stay-3.png",
    sqft: "650 sq.ft",
    beds: "1 Queen",
    guests: "2 Guests",
  },
  {
    slug: "beachfront-family-suite",
    name: "Beachfront Family Suite",
    locationLine: "Location of stay",
    imageSrc: "/img/stay-4.png",
    sqft: "750 sq.ft",
    beds: "2 King",
    guests: "4-5 Guests",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

// NOTE: The design spec references exact FAQ copy in source PDFs; the repo currently
// does not include those PDFs. Replace these placeholders with the exact source strings.
export const faqs: FaqItem[] = [
  { question: "check-in/out", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "parking", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "pets", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "breakfast", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "ocean views", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { question: "cancel/change", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// NOTE: Replace with the exact quotes from `1920w light.pdf`.
export const testimonials: Testimonial[] = [
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    name: "Lorem Ipsum",
    role: "Lorem",
  },
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    name: "Lorem Ipsum",
    role: "Lorem",
  },
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    name: "Lorem Ipsum",
    role: "Lorem",
  },
];
