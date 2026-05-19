export type Stay = {
  id: string;
  title: string;
  imageUrl: string;
  area: string;
  bed: string;
  guests: string;
  /** category/collection id */
  category?: string;
  /** property type id (e.g. villas, apartments) */
  propertyType?: string;
  description?: string;
  pricePerNight?: string;
  images?: string[];
  amenities?: string[];
  location?: string;
  aboutContent?: string;
  locationMapUrl?: string;
  nearbyPlaces?: { name: string; distance: string }[];
  faqs?: { question: string; answer: string }[];
  /** show this stay in the home page 6×2 featured grid */
  featuredOnHome?: boolean;
};

export const stayCategories = [
  { id: "luxury-villas", name: "Luxury Villas", description: "Private villas with elevated finishes and personalised service." },
  { id: "walk-to-beach", name: "Walk to the Beach", description: "Short strolls to sandy shores and sunset views." },
  { id: "expansive-views", name: "Expansive Views", description: "Rooms and villas with sweeping outlooks and terraces." },
  { id: "romantic-jacuzzi-escapes", name: "Romantic Jacuzzi Escapes", description: "Cozy suites with private jacuzzis for romantic getaways." },
];

export const stays: Stay[] = [
  {
    id: "test-stay",
    propertyType: "villas",
    title: "Royal Palms Garden Suite",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
    area: "650 sq. ft.",
    bed: "1 King Bed",
    guests: "2 Guests",
    category: "luxury-villas",
    description: "An exquisite blend of Indo-Portuguese architecture and modern luxury in the heart of Assagao.",
    pricePerNight: "$240/night",
    location: "Assagao, Goa",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590392847226-d95245220a22?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496048977749-6c44d362880c?q=80&w=2070&auto=format&fit=crop"
    ],
    amenities: [
      "Garden Patio",
      "King Bed",
      "Rain Shower",
      "Breakfast",
      "Meditation Area",
      "Smart TV",
      "Yoga Mat",
      "Tea Set"
    ],
    aboutContent: "Nestled in the heart of Assagao, the Royal Palms Garden Suite offers a tranquil escape from the bustling beaches. This boutique suite features high-vaulted ceilings, handcrafted teak furniture, and large French windows that open directly into a private botanical garden. \n\nDesigned for the discerning traveler, the suite includes a plush king-sized bed with organic linens, a dedicated meditation nook, and a spa-inspired bathroom with a signature rain shower. Every morning, wake up to the sound of tropical birds and enjoy a chef-prepared Goan breakfast served on your private patio.",
    locationMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.249454378949!2d73.74317137578207!3d15.525287453303666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfe96435c2b0c1%3A0xc0f19c35546b4f7a!2sPink%20Papaya%20Stay!5e0!3m2!1sen!2sin!4v1714856000000!5m2!1sen!2sin",
    nearbyPlaces: [
      { "name": "Gunpowder Restaurant", "distance": "2 mins walk" },
      { "name": "Anjuna Beach", "distance": "12 mins drive" },
      { "name": "Vagator Cliffs", "distance": "15 mins drive" },
      { "name": "Saturday Night Market", "distance": "8 mins drive" }
    ],
    faqs: [
      { "question": "Is the pool accessible from this suite?", "answer": "Yes, the Garden Suite has direct access to the central lap pool through the garden path." },
      { "question": "Can I request an early check-in?", "answer": "Early check-in is subject to availability. Please notify us 24 hours in advance, and we will do our best to accommodate you." },
      { "question": "Is there a safe in the room?", "answer": "Yes, every suite is equipped with a digital safe for your valuables." }
    ]
  },
  {
    id: "seafront-villa-vagator",
    propertyType: "villas",
    title: "Seafront Villa Suite",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    area: "800 sq. ft.",
    bed: "1 King Bed",
    guests: "2 Guests",
    category: "walk-to-beach",
    description: "Waking up to the sound of waves with panoramic views of the Arabian Sea from your private terrace.",
    pricePerNight: "$320/night",
    location: "Vagator, Goa",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
    ],
    amenities: ["Sea View Terrace", "King Bed", "Infinity Pool", "Breakfast", "Beach Access", "Smart TV"],
    featuredOnHome: true,
  },
  {
    id: "jungle-pool-villa-morjim",
    propertyType: "villas",
    title: "Jungle Pool Villa",
    imageUrl: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=2070&auto=format&fit=crop",
    area: "1200 sq. ft.",
    bed: "2 King Beds",
    guests: "4 Guests",
    category: "luxury-villas",
    description: "A secluded villa submerged in lush jungle canopy with a private plunge pool and outdoor shower.",
    pricePerNight: "$480/night",
    location: "Morjim, Goa",
    images: [
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596436816851-d0c77bc2b3c6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop",
    ],
    amenities: ["Private Pool", "2 King Beds", "Outdoor Shower", "Breakfast", "Jungle Walk", "Smart TV"],
    featuredOnHome: true,
  },
  {
    id: "heritage-courtyard-fontainhas",
    propertyType: "apartments",
    title: "Heritage Courtyard Room",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
    area: "550 sq. ft.",
    bed: "1 Queen Bed",
    guests: "2 Guests",
    category: "expansive-views",
    description: "A lovingly restored Indo-Portuguese townhouse room in the colourful lanes of Fontainhas.",
    pricePerNight: "$180/night",
    location: "Fontainhas, Goa",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2070&auto=format&fit=crop",
    ],
    amenities: ["Courtyard Garden", "Queen Bed", "Rain Shower", "Breakfast", "Heritage Tour", "Smart TV"],
    featuredOnHome: true,
  },
  {
    id: "cliffside-ocean-suite-arambol",
    propertyType: "villas",
    title: "Cliffside Ocean Suite",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    area: "720 sq. ft.",
    bed: "1 King Bed",
    guests: "2 Guests",
    category: "expansive-views",
    description: "Perched on Arambol's dramatic cliffs with floor-to-ceiling glass and 270° ocean views.",
    pricePerNight: "$360/night",
    location: "Arambol, Goa",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618245318763-453825cd2b0f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
    ],
    amenities: ["Ocean View", "King Bed", "Jacuzzi", "Breakfast", "Cliff Walk", "Smart TV"],
    featuredOnHome: true,
  },
  {
    id: "white-house-studio-anjuna",
    propertyType: "apartments",
    title: "The White House Studio",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    area: "450 sq. ft.",
    bed: "1 Double Bed",
    guests: "2 Guests",
    category: "romantic-jacuzzi-escapes",
    description: "A minimalist whitewashed studio with a private jacuzzi, steps from Anjuna's famous flea market.",
    pricePerNight: "$160/night",
    location: "Anjuna, Goa",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618245318763-453825cd2b0f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496048977749-6c44d362880c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590392847226-d95245220a22?q=80&w=2070&auto=format&fit=crop",
    ],
    amenities: ["Private Jacuzzi", "Double Bed", "Rain Shower", "Breakfast", "Market Access", "Smart TV"],
    featuredOnHome: true,
  },
];
