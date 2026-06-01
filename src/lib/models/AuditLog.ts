import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  actorId?: string;
  action: string;
  meta?: any;
  createdAt: Date;
}
const AuditLogSchema = new Schema<IAuditLog>({
  actorId: { type: String },
  action: { type: String, required: true },
  meta: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false }, collection: 'audit_logs' });

export const AuditLog = (mongoose.models.AuditLog as mongoose.Model<IAuditLog>) || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
