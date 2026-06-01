import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaLibrary extends Document {
  key: string;
  url: string;
  fileName: string;
  contentType: string;
  size: number;
  alt?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
const MediaLibrarySchema = new Schema<IMediaLibrary>({
  key: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  alt: { type: String },
  createdBy: { type: String },
}, { timestamps: true, collection: 'media_library' });

export const MediaLibrary = (mongoose.models.MediaLibrary as mongoose.Model<IMediaLibrary>) || mongoose.model<IMediaLibrary>('MediaLibrary', MediaLibrarySchema);
