const mongoose = require('mongoose');

const TimeSessionSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: [true, 'Activity ID is required']
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for easy daily grouping
      required: [true, 'Date string is required']
    },
    isRunning: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for fast querying by date and category
TimeSessionSchema.index({ date: 1 });
TimeSessionSchema.index({ category: 1 });
TimeSessionSchema.index({ isRunning: 1 });

module.exports = mongoose.model('TimeSession', TimeSessionSchema);
