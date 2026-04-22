const db = require('../config/db');

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Public (Should be protected)
exports.createBooking = async (req, res) => {
    try {
        const { user_id, car_id, pickup_date, return_date, total_price, pickup_location } = req.body;

        if (!user_id || !car_id || !pickup_date || !return_date || !total_price || !pickup_location) {
            return res.status(400).json({ message: 'All booking fields are required' });
        }

        // Check availability
        const [carRow] = await db.query('SELECT availability FROM cars WHERE id = ?', [car_id]);
        if (carRow.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        if (!carRow[0].availability) {
            return res.status(400).json({ message: 'Car is currently not available' });
        }

        const [result] = await db.query(
            'INSERT INTO bookings (user_id, car_id, pickup_date, return_date, total_price, pickup_location) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, car_id, pickup_date, return_date, total_price, pickup_location]
        );

        res.status(201).json({
            message: 'Booking successful',
            bookingId: result.insertId
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error while creating booking' });
    }
};

// @route   GET /api/bookings
// @desc    Get all bookings (Admin maybe, but open for now)
// @access  Public
exports.getAllBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.*, u.name as user_name, u.email, c.car_name 
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN cars c ON b.car_id = c.id
            ORDER BY b.created_at DESC
        `;
        const [bookings] = await db.query(query);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings' });
    }
};
