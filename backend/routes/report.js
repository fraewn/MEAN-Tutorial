const express = require('express');
// auth middleware to protect the non public routes
const checkAuth = require("../middleware/check-auth");
const ReportController = require('../controllers/reports');

const router = express.Router();

// CRUD reports
router.post("", checkAuth, ReportController.createReport);

router.get("", ReportController.getAllReports);
router.get("/:id", ReportController.getReport);

router.delete("/:id", checkAuth, ReportController.deleteReport);

router.put("/:id", checkAuth, ReportController.updateReport);

module.exports = router;
