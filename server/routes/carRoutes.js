const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/cars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'car-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/', upload.single('image'), carController.addCar);
router.put('/:id', upload.single('image'), carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;
