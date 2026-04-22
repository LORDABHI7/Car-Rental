require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
    try {
        // First connect without database to create it if it doesn't exist
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('Connected to MySQL server.');

        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database '${process.env.DB_NAME}' checked/created.`);

        // Switch to the database
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);

        // Create Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table checked/created.');

        // Create Cars table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cars (
                id INT AUTO_INCREMENT PRIMARY KEY,
                car_name VARCHAR(100) NOT NULL,
                price_per_day DECIMAL(10, 2) NOT NULL,
                fuel_type VARCHAR(50) NOT NULL,
                seats INT NOT NULL,
                availability BOOLEAN DEFAULT true,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Cars table checked/created.');

        // Create Bookings table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                car_id INT NOT NULL,
                pickup_date DATE NOT NULL,
                return_date DATE NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                pickup_location VARCHAR(255) NOT NULL,
                status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
            )
        `);
        console.log('Bookings table checked/created.');

        // Insert Admin User if not exists
        const [adminRows] = await connection.query(`SELECT * FROM users WHERE email = 'admin@carrental.com'`);
        if (adminRows.length === 0) {
            const bcrypt = require('bcrypt');
            const hashedAdminPassword = await bcrypt.hash('admin123', 10);
            await connection.query(`
                INSERT INTO users (name, email, password, phone, role) 
                VALUES ('Admin', 'admin@carrental.com', ?, '0000000000', 'admin')
            `, [hashedAdminPassword]);
            console.log('Default admin user created: admin@carrental.com / admin123');
        }

        console.log('Database initialization complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initializeDatabase();
