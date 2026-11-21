import mongoose, { Schema, Document } from "mongoose";

export enum AuditAction { 
    Create = 'Create', 
    Update = 'Update', 
    Delete = 'Delete' 
}

export const SystemUser = new mongoose.Types.ObjectId('SYS000000000000000000000');

export interface IAudit extends Document {
    _id: mongoose.Types.ObjectId;
    timestamp: Date;
    user: mongoose.Types.ObjectId;
    action: AuditAction;
    collectionName: string;
    before: Record<string, any> | null;
    after: Record<string, any> | null;
}

const auditSchema = new Schema<IAudit>(
    {
        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true
        },
        action: {
            type: String,
            enum: Object.values(AuditAction),
            required: true
        },
        collectionName: {
            type: String,
            required: true,
        },
        before: {
            type: Schema.Types.Mixed,
            default: null
        },
        after: {
            type: Schema.Types.Mixed,
            default: null
        }
    },
    {
        collection: 'audits'
    });
const Audit = mongoose.models.Audit || mongoose.model<IAudit>('Audit', auditSchema);
export default Audit;