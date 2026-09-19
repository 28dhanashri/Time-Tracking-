const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Development', 'Education', 'Work', 'Personal', 'Meeting', 'Exercise', 'Other'],
      default: 'Other'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    totalTime: {
      type: Number, // Total tracked time in seconds
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Activity', ActivitySchema);
