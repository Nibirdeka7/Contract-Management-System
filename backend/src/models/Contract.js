import mongoose from 'mongoose';

const fieldValueSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'date', 'signature', 'checkbox'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { _id: false });

const contractSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  blueprintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blueprint',
    required: true
  },
  blueprintName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['CREATED', 'APPROVED', 'SENT', 'SIGNED', 'LOCKED', 'REVOKED'],
    default: 'CREATED'
  },
  fieldValues: [fieldValueSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// contractSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

contractSchema.index({ status: 1 });
contractSchema.index({ blueprintId: 1 });
contractSchema.index({ createdAt: -1 });

export default mongoose.model('Contract', contractSchema);