const db = require('../config/db');

// @route   GET /api/cars
// @desc    Get all cars
// @access  Public
exports.getAllCars = async (req, res) => {
    try {
        const [cars] = await db.query('SELECT * FROM cars');
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error while fetching cars' });
    }
};

// @route   GET /api/cars/:id
// @desc    Get single car by ID
// @access  Public
exports.getCarById = async (req, res) => {
    try {
        const [cars] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (cars.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(cars[0]);
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ message: 'Server error while fetching car' });
    }
};

// @route   POST /api/cars
// @desc    Add a new car (Admin only ideally, but we'll keep it simple for now)
// @access  Public (Should be protected in production)
exports.addCar = async (req, res) => {
    try {
        const { car_name, price_per_day, fuel_type, seats, availability } = req.body;
        
        let image_url = req.body.image_url;
        if (req.file) {
            image_url = '/uploads/cars/' + req.file.filename;
        }
        
        if (!car_name || !price_per_day || !fuel_type || !seats) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        let isAvailable = true;
        if (availability !== undefined) {
             isAvailable = availability === 'true' || availability === true;
        }

        const [result] = await db.query(
            'INSERT INTO cars (car_name, price_per_day, fuel_type, seats, availability, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [car_name, parseFloat(price_per_day), fuel_type, parseInt(seats), isAvailable, image_url || null]
        );

        res.status(201).json({
            message: 'Car added successfully',
            carId: result.insertId
        });
    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({ message: 'Server error while adding car' });
    }
};

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Public (Should be protected)
exports.updateCar = async (req, res) => {
    try {
        const { car_name, price_per_day, fuel_type, seats, availability } = req.body;
        
        let image_url = req.body.image_url;
        if (req.file) {
            image_url = '/uploads/cars/' + req.file.filename;
        }

        let isAvailable = true;
        if (availability !== undefined) {
             isAvailable = availability === 'true' || availability === true;
        }

        let queryParams = [car_name, parseFloat(price_per_day), fuel_type, parseInt(seats), isAvailable];
        let queryStr = 'UPDATE cars SET car_name = ?, price_per_day = ?, fuel_type = ?, seats = ?, availability = ?';
        
        if (image_url) {
            queryStr += ', image_url = ?';
            queryParams.push(image_url);
        }
        
        queryStr += ' WHERE id = ?';
        queryParams.push(req.params.id);

        const [result] = await db.query(queryStr, queryParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car updated successfully' });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Server error while updating car' });
    }
};

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Public (Should be protected)
exports.deleteCar = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Server error while deleting car' });
    }
};
