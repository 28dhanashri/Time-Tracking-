const TimeSession = require('../models/TimeSession');
const Activity = require('../models/Activity');
const { getFormattedDate, calculateDurationInSeconds } = require('../utils/timeHelpers');

// @desc    Start timer for an activity
// @route   POST /api/sessions/start
const startTimer = async (req, res) => {
  try {
    const { activityId } = req.body;

    if (!activityId) {
      return res.status(400).json({
        success: false,
        message: 'Activity ID is required to start a timer'
      });
    }

    // Check if ANY timer is currently running (single running timer constraint)
    const existingRunning = await TimeSession.findOne({ isRunning: true }).populate('activityId');
    if (existingRunning) {
      const activeActivityName = existingRunning.activityId ? existingRunning.activityId.name : 'another activity';
      return res.status(400).json({
        success: false,
        message: `A timer is already running for "${activeActivityName}". Please stop the running timer first before starting a new one.`,
        activeSession: existingRunning
      });
    }

    // Verify activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    const startTime = new Date();
    const dateStr = getFormattedDate(startTime);

    const newSession = await TimeSession.create({
      activityId,
      startTime,
      category: activity.category,
      date: dateStr,
      isRunning: true,
      duration: 0
    });

    const populatedSession = await TimeSession.findById(newSession._id).populate('activityId');

    res.status(201).json({
      success: true,
      message: `Timer started for "${activity.name}"`,
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start timer',
      error: error.message
    });
  }
};

// @desc    Stop currently running timer
// @route   POST /api/sessions/stop
const stopTimer = async (req, res) => {
  try {
    const { sessionId, activityId } = req.body || {};

    let session = null;

    if (sessionId) {
      session = await TimeSession.findById(sessionId);
    } else if (activityId) {
      session = await TimeSession.findOne({ activityId, isRunning: true });
    } else {
      // If neither is passed, stop whichever session is currently running
      session = await TimeSession.findOne({ isRunning: true });
    }

    if (!session || !session.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'No active running timer was found to stop'
      });
    }

    const endTime = new Date();
    const durationInSeconds = calculateDurationInSeconds(session.startTime, endTime);

    session.endTime = endTime;
    session.duration = durationInSeconds;
    session.isRunning = false;
    await session.save();

    // Update parent Activity totalTime
    const activity = await Activity.findById(session.activityId);
    if (activity) {
      activity.totalTime = (activity.totalTime || 0) + durationInSeconds;
      await activity.save();
    }

    const populatedSession = await TimeSession.findById(session._id).populate('activityId');

    res.status(200).json({
      success: true,
      message: `Timer stopped. Tracked ${durationInSeconds} seconds.`,
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to stop timer',
      error: error.message
    });
  }
};

// @desc    Get currently active running timer session
// @route   GET /api/sessions/active
const getActiveSession = async (req, res) => {
  try {
    const activeSession = await TimeSession.findOne({ isRunning: true }).populate('activityId');

    res.status(200).json({
      success: true,
      data: activeSession || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active timer session',
      error: error.message
    });
  }
};

// @desc    Get all session records (history) with optional filtering
// @route   GET /api/sessions
const getSessions = async (req, res) => {
  try {
    const { category, date, activityId } = req.query;
    const filter = { isRunning: false }; // history shows completed sessions

    if (category) filter.category = category;
    if (date) filter.date = date;
    if (activityId) filter.activityId = activityId;

    const sessions = await TimeSession.find(filter)
      .populate('activityId')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session history',
      error: error.message
    });
  }
};

// @desc    Delete a time session
// @route   DELETE /api/sessions/:id
const deleteSession = async (req, res) => {
  try {
    const session = await TimeSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an active running session. Stop it first.'
      });
    }

    // Deduct duration from activity totalTime
    if (session.duration > 0 && session.activityId) {
      const activity = await Activity.findById(session.activityId);
      if (activity) {
        activity.totalTime = Math.max(0, (activity.totalTime || 0) - session.duration);
        await activity.save();
      }
    }

    await TimeSession.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
      error: error.message
    });
  }
};

module.exports = {
  startTimer,
  stopTimer,
  getActiveSession,
  getSessions,
  deleteSession
};
