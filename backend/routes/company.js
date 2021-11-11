const express = require('express');
// auth middleware to protect the non public routes
const checkAuth = require("../middleware/check-auth");
const CompanyController = require('../controllers/company');

const router = express.Router();

// CRUD reports
router.post("", checkAuth, CompanyController.createReport);

// all viewers can see all reports so no role management needed
router.get("", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompany);


router.delete("/:id", checkAuth, CompanyController.grantAccess('deleteAny', 'company'), CompanyController.deleteCompany);
router.put("/:id", checkAuth, CompanyController.grantAccess('updateAny', 'company'), CompanyController.updateCompany);

module.exports = router;
