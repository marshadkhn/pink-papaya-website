import mongoose, { Schema, Document } from 'mongoose';

export interface INearbyPlace {
  name: string;
  distance: string;
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface IStay extends Document {
  id: string;
  title: string;
  imageUrl: string;
  area: string;
  bed: string;
  guests: string;
  category?: string;
  categories?: string[];
  propertyType?: string;
  description?: string;
  pricePerNight?: string;
  images?: string[];
  amenities?: string[];
  location?: string;
  aboutContent?: string;
  locationMapUrl?: string;
  nearbyPlaces?: INearbyPlace[];
  faqs?: IFaq[];
  featuredOnHome?: boolean;
}

const NearbyPlaceSchema = new Schema<INearbyPlace>({
  name: { type: String, required: true },
  distance: { type: String, required: true },
}, { _id: false });

const FaqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const StaySchema = new Schema<IStay>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  area: { type: String, required: true },
  bed: { type: String, required: true },
  guests: { type: String, required: true },
  category: { type: String },
  categories: { type: [String], default: undefined },
  propertyType: { type: String },
  description: { type: String },
  pricePerNight: { type: String },
  images: { type: [String], default: undefined },
  amenities: { type: [String], default: undefined },
  location: { type: String },
  aboutContent: { type: String },
  locationMapUrl: { type: String },
  nearbyPlaces: { type: [NearbyPlaceSchema], default: undefined },
  faqs: { type: [FaqSchema], default: undefined },
  featuredOnHome: { type: Boolean },
}, { timestamps: true, collection: 'stays' });

export const Stay = (mongoose.models.Stay as mongoose.Model<IStay>) || mongoose.model<IStay>('Stay', StaySchema);
