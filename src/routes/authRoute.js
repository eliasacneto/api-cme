const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

router.post("/login", login);
router.post("/send-reset-token", sendResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
