import mongoose from 'mongoose';

const outbreakSchema = new mongoose.Schema(
    {
        state: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        district: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        disease: {
            type: String,
            required: true,
            enum: [
                'Dengue',
                'Malaria',
                'COVID-19',
                'Chikungunya',
                'Typhoid',
                'Food Poisoning',
                'Gastroenteritis',
                'Cholera',
                'Measles',
                'Jaundice',
                'Hepatitis',
                'Diarrhoea',
                'Viral Fever',
                'Fever',
                'Rabies',
                'ADD',
                'Unknown'
            ]
        },
        casesCount: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        reportDate: {
            type: Date,
            required: true,
            default: Date.now,
            index: true
        },
        sourceUrl: {
            type: String,
            trim: true
        },
        alertText: {
            type: String,
            trim: true
        },
        alertLevel: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            default: 'LOW'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Compound index for efficient queries
outbreakSchema.index({ district: 1, disease: 1, reportDate: -1 });
outbreakSchema.index({ state: 1, disease: 1 });
outbreakSchema.index({ isActive: 1, reportDate: -1 });

// Method to calculate alert level based on cases
outbreakSchema.methods.calculateAlertLevel = function() {
    if (this.casesCount >= 1000) return 'CRITICAL';
    if (this.casesCount >= 500) return 'HIGH';
    if (this.casesCount >= 100) return 'MEDIUM';
    return 'LOW';
};

// Pre-save hook to auto-calculate alert level
outbreakSchema.pre('save', function(next) {
    if (this.isModified('casesCount')) {
        this.alertLevel = this.calculateAlertLevel();
    }
    next();
});

const Outbreak = mongoose.model('Outbreak', outbreakSchema);

export default Outbreak;