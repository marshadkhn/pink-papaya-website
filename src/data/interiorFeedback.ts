export type InteriorFeedbackItem = {
  id: string;
  name: string;
  avatar: string;
  text: string;
  role?: string;
};

export const interiorFeedback: InteriorFeedbackItem[] = [
  {
    id: "if1",
    name: "Elena Park",
    role: "Residential Client",
    avatar: "/logo-files/logo-black.svg",
    text: "The design brought so much light and warmth into our home. Every corner feels intentional.",
  },
  {
    id: "if2",
    name: "Ravi Sharma",
    role: "Hospitality Partner",
    avatar: "/logo-files/logo-white.svg",
    text: "Guests keep complimenting the interiors—calm, layered, and beautifully detailed.",
  },
  {
    id: "if3",
    name: "Nora Williams",
    role: "Homeowner",
    avatar: "/logo-files/logo-black.svg",
    text: "They understood our lifestyle and translated it into a space that truly feels like us.",
  },
  {
    id: "if4",
    name: "Kenji Ito",
    role: "Boutique Owner",
    avatar: "/logo-files/logo-white.svg",
    text: "A thoughtful blend of function and aesthetic. Customers notice the difference.",
  },
];
