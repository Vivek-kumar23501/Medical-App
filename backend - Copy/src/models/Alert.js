import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        outbreak: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outbreak',
            required: true
        },
        disease: {
            type: String,
            required: true
        },
        alertLevel: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        sentVia: {
            type: String,
            enum: ['whatsapp', 'sms', 'both'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed', 'delivered'],
            default: 'pending'
        },
        sentAt: {
            type: Date
        },
        deliveredAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Index
alertSchema.index({ user: 1, createdAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
