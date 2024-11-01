const { Router } = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = Router();

const {
  getEmployees,
  createEmployees,
  exportEmployeesToCSV,
  importEmployeesFromCSV,
} = require("../controllers/index.controller");

router.get("/employees", getEmployees);
router.post("/employees", createEmployees);
router.get("/employees/export", exportEmployeesToCSV);
router.post("/employees/import", upload.single("file"), importEmployeesFromCSV);

module.exports = router;
