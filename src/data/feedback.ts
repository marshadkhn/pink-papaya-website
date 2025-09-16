export type FeedbackItem = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number; // 0-5
  text: string;
};

export const feedback: FeedbackItem[] = [
  {
    id: "f1",
    name: "Ava Moore",
    role: "Weekend Guest",
    avatar: "/logo-files/logo-black.svg",
    rating: 5,
    text:
      "Beautiful spaces and such a calming vibe. The little touches made our stay feel special.",
  },
  {
    id: "f2",
    name: "Lucas Nguyen",
    role: "Business Traveler",
    avatar: "/logo-files/logo-white.svg",
    rating: 4,
    text:
      "Quiet, stylish, and comfortable. The garden patio was my favorite spot to unwind after meetings.",
  },
  {
    id: "f3",
    name: "Mia Patel",
    role: "Couple’s Getaway",
    avatar: "/logo-files/logo-black.svg",
    rating: 5,
    text:
      "We loved the design details and the breakfast. Felt like a boutique home away from home.",
  },
  {
    id: "f4",
    name: "Daniel Kim",
    role: "Solo Retreat",
    avatar: "/logo-files/logo-white.svg",
    rating: 5,
    text:
      "Meditation area and the surrounding nature were perfect. Staff were friendly and attentive.",
  },
  {
    id: "f5",
    name: "Sofia Rossi",
    role: "Family Stay",
    avatar: "/logo-files/logo-black.svg",
    rating: 4,
    text:
      "Rooms were spotless, beds super comfy. Kids loved the open spaces.",
  },
];
