const Activity = require('../models/Activity');
const TimeSession = require('../models/TimeSession');

// @desc    Get all activities
// @route   GET /api/activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
};

// @desc    Get single activity by ID
// @route   GET /api/activities/:id
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    const sessions = await TimeSession.find({ activityId: req.params.id }).sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...activity.toObject(),
        sessions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity details',
      error: error.message
    });
  }
};

// @desc    Create new activity
// @route   POST /api/activities
const createActivity = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Activity name is required'
      });
    }

    const validCategories = ['Development', 'Education', 'Work', 'Personal', 'Meeting', 'Exercise', 'Other'];
    const selectedCategory = validCategories.includes(category) ? category : 'Other';

    const newActivity = await Activity.create({
      name: name.trim(),
      category: selectedCategory,
      description: description ? description.trim() : '',
      totalTime: 0
    });

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: newActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error.message
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
const updateActivity = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    if (name) activity.name = name.trim();
    if (category) {
      const validCategories = ['Development', 'Education', 'Work', 'Personal', 'Meeting', 'Exercise', 'Other'];
      activity.category = validCategories.includes(category) ? category : activity.category;
    }
    if (description !== undefined) activity.description = description.trim();

    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message
    });
  }
};

// @desc    Delete activity & associated time sessions
// @route   DELETE /api/activities/:id
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if activity has a running timer session
    const runningSession = await TimeSession.findOne({ activityId: req.params.id, isRunning: true });
    if (runningSession) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete activity while its timer is actively running. Stop the timer first.'
      });
    }

    // Delete all time sessions linked to this activity
    await TimeSession.deleteMany({ activityId: req.params.id });

    // Delete the activity
    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Activity and linked sessions deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
      error: error.message
    });
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
