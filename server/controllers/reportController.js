const TimeSession = require('../models/TimeSession');
const Activity = require('../models/Activity');
const { getFormattedDate, formatSeconds, formatDurationHuman } = require('../utils/timeHelpers');

// @desc    Get dashboard summary statistics
// @route   GET /api/reports/summary
const getSummary = async (req, res) => {
  try {
    const todayStr = getFormattedDate();

    // Today's total tracked time
    const todaySessions = await TimeSession.find({ date: todayStr, isRunning: false });
    const todayTotalSeconds = todaySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    // Overall total tracked time
    const allCompletedSessions = await TimeSession.find({ isRunning: false });
    const overallTotalSeconds = allCompletedSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    // Total activities count
    const totalActivities = await Activity.countDocuments();

    // Total completed sessions count
    const totalSessions = allCompletedSessions.length;

    // Currently running timer session
    const activeTimer = await TimeSession.findOne({ isRunning: true }).populate('activityId');

    // Most used category
    const categoryAggregation = await TimeSession.aggregate([
      { $match: { isRunning: false } },
      { $group: { _id: '$category', totalDuration: { $sum: '$duration' } } },
      { $sort: { totalDuration: -1 } },
      { $limit: 1 }
    ]);

    const mostUsedCategory = categoryAggregation.length > 0 ? categoryAggregation[0]._id : 'None';

    res.status(200).json({
      success: true,
      data: {
        todayTotalSeconds,
        todayTotalFormatted: formatSeconds(todayTotalSeconds),
        todayTotalHuman: formatDurationHuman(todayTotalSeconds),
        overallTotalSeconds,
        overallTotalFormatted: formatSeconds(overallTotalSeconds),
        overallTotalHuman: formatDurationHuman(overallTotalSeconds),
        totalActivities,
        totalSessions,
        activeTimer,
        mostUsedCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary report',
      error: error.message
    });
  }
};

// @desc    Get time breakdown category-wise
// @route   GET /api/reports/category
const getCategoryReport = async (req, res) => {
  try {
    const categoryStats = await TimeSession.aggregate([
      { $match: { isRunning: false } },
      {
        $group: {
          _id: '$category',
          totalDuration: { $sum: '$duration' },
          sessionCount: { $sum: 1 }
        }
      },
      { $sort: { totalDuration: -1 } }
    ]);

    const totalTrackedOverall = categoryStats.reduce((acc, curr) => acc + curr.totalDuration, 0);

    const formattedStats = categoryStats.map((item) => ({
      category: item._id,
      duration: item.totalDuration,
      formattedDuration: formatSeconds(item.totalDuration),
      humanDuration: formatDurationHuman(item.totalDuration),
      hours: +(item.totalDuration / 3600).toFixed(2),
      sessionCount: item.sessionCount,
      percentage: totalTrackedOverall > 0 ? +((item.totalDuration / totalTrackedOverall) * 100).toFixed(1) : 0
    }));

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category report',
      error: error.message
    });
  }
};

// @desc    Get daily totals for recent days
// @route   GET /api/reports/daily
const getDailyReport = async (req, res) => {
  try {
    const daysLimit = parseInt(req.query.days, 10) || 7;
    const resultDays = [];
    const today = new Date();

    // Generate date strings for last N days (including today)
    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getFormattedDate(d);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = i === 0 ? 'Today' : `${dayNames[d.getDay()]} (${d.getMonth() + 1}/${d.getDate()})`;

      resultDays.push({
        date: dateStr,
        dayName,
        duration: 0,
        formattedDuration: '00:00:00',
        humanDuration: '0m',
        hours: 0
      });
    }

    // Aggregate sessions grouped by date
    const dailyStats = await TimeSession.aggregate([
      { $match: { isRunning: false } },
      {
        $group: {
          _id: '$date',
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    // Map aggregated statistics onto the result days array
    const statsMap = {};
    dailyStats.forEach((stat) => {
      statsMap[stat._id] = stat.totalDuration;
    });

    const finalReport = resultDays.map((item) => {
      const duration = statsMap[item.date] || 0;
      return {
        ...item,
        duration,
        formattedDuration: formatSeconds(duration),
        humanDuration: formatDurationHuman(duration),
        hours: +(duration / 3600).toFixed(2)
      };
    });

    res.status(200).json({
      success: true,
      data: finalReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily report',
      error: error.message
    });
  }
};

module.exports = {
  getSummary,
  getCategoryReport,
  getDailyReport
};
