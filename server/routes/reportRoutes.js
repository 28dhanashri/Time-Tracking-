const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryReport,
  getDailyReport
} = require('../controllers/reportController');

router.get('/summary', getSummary);
router.get('/category', getCategoryReport);
router.get('/daily', getDailyReport);

module.exports = router;
