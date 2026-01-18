import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'date', 'signature', 'checkbox'],
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    }
  }
}, { _id: true });

const blueprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  fields: [fieldSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

blueprintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Blueprint', blueprintSchema);