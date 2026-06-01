import mongoose, { Schema, Document } from 'mongoose';

// Role
export interface IRole extends Document {
  key: string;
  name: string;
}
const RoleSchema = new Schema<IRole>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
}, { collection: 'roles' });
export const Role = (mongoose.models.Role as mongoose.Model<IRole>) || mongoose.model<IRole>('Role', RoleSchema);

// Permission
export interface IPermission extends Document {
  key: string;
  label: string;
  description?: string;
}
const PermissionSchema = new Schema<IPermission>({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String },
}, { collection: 'permissions' });
export const Permission = (mongoose.models.Permission as mongoose.Model<IPermission>) || mongoose.model<IPermission>('Permission', PermissionSchema);

// RolePermission
export interface IRolePermission extends Document {
  roleKey: string;
  permissionKey: string;
}
const RolePermissionSchema = new Schema<IRolePermission>({
  roleKey: { type: String, required: true },
  permissionKey: { type: String, required: true },
}, { collection: 'role_permissions' });
RolePermissionSchema.index({ roleKey: 1, permissionKey: 1 }, { unique: true });
export const RolePermission = (mongoose.models.RolePermission as mongoose.Model<IRolePermission>) || mongoose.model<IRolePermission>('RolePermission', RolePermissionSchema);

// Page
export interface IPage extends Document {
  slug: string;
  label: string;
  publicPath: string;
  createdAt: Date;
  updatedAt: Date;
}
const PageSchema = new Schema<IPage>({
  slug: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  publicPath: { type: String, required: true },
}, { timestamps: true, collection: 'pages' });
export const Page = (mongoose.models.Page as mongoose.Model<IPage>) || mongoose.model<IPage>('Page', PageSchema);

// PageSection
export interface IPageSection extends Document {
  pageId: mongoose.Types.ObjectId;
  key: string;
  label: string;
  sortOrder: number;
}
const PageSectionSchema = new Schema<IPageSection>({
  pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true },
  key: { type: String, required: true },
  label: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true, collection: 'page_sections' });
PageSectionSchema.index({ pageId: 1, key: 1 }, { unique: true });
export const PageSection = (mongoose.models.PageSection as mongoose.Model<IPageSection>) || mongoose.model<IPageSection>('PageSection', PageSectionSchema);

// PageContent
export interface IPageContent extends Document {
  pageId: mongoose.Types.ObjectId;
  sectionKey: string;
  fieldKey: string;
  value: any;
  updatedBy?: string;
}
const PageContentSchema = new Schema<IPageContent>({
  pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true },
  sectionKey: { type: String, required: true },
  fieldKey: { type: String, required: true },
  value: { type: Schema.Types.Mixed },
  updatedBy: { type: String },
}, { timestamps: true, collection: 'page_content' });
PageContentSchema.index({ pageId: 1, sectionKey: 1, fieldKey: 1 }, { unique: true });
export const PageContent = (mongoose.models.PageContent as mongoose.Model<IPageContent>) || mongoose.model<IPageContent>('PageContent', PageContentSchema);

// PageSeo
export interface IPageSeo extends Document {
  pageId: mongoose.Types.ObjectId;
  title?: string;
  description?: string;
  keywords: string[];
  ogImageUrl?: string;
  updatedBy?: string;
}
const PageSeoSchema = new Schema<IPageSeo>({
  pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true, unique: true },
  title: { type: String },
  description: { type: String },
  keywords: [{ type: String }],
  ogImageUrl: { type: String },
  updatedBy: { type: String },
}, { timestamps: true, collection: 'page_seo' });
export const PageSeo = (mongoose.models.PageSeo as mongoose.Model<IPageSeo>) || mongoose.model<IPageSeo>('PageSeo', PageSeoSchema);
