export type Stay = {
  id: string; title: string; imageUrl: string; area: string; bed: string;
  guests: string; category?: string; propertyType?: string; description?: string; pricePerNight?: string;
  images?: string[]; amenities?: string[]; location?: string; aboutContent?: string;
  locationMapUrl?: string; nearbyPlaces?: { name: string; distance: string }[];
  faqs?: { question: string; answer: string }[];
  featuredOnHome?: boolean;
};

export type Collection = { id: string; name: string };
export type PropertyType = { id: string; name: string };
