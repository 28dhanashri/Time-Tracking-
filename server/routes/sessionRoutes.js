const express = require('express');
const router = express.Router();
const {
  startTimer,
  stopTimer,
  getActiveSession,
  getSessions,
  deleteSession
} = require('../controllers/sessionController');

router.post('/start', startTimer);
router.post('/stop', stopTimer);
router.get('/active', getActiveSession);
router.get('/', getSessions);
router.delete('/:id', deleteSession);

module.exports = router;
