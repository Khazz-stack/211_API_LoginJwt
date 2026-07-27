const express = require('express');
const router = express.Router();

const komikController = require('../controller/komikController');
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

//public
router.get("/Komik", komikController.getAllKomik);
router.get("/Komik/:id", komikController.getKomikById);

//protected
router.post("/Komik", authMiddleware, komikController.createKomik);
router.put("/Komik/:id", authMiddleware, komikController.updateKomik);
router.delete("/Komik/:id", authMiddleware, komikController.deleteKomik);
module.exports = router;