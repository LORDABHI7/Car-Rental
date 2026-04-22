# DriveX - Premium Car Rental System
A full-stack, responsive car rental application built as a college project. 

## Features
- **Modern UI**: Fully responsive, CSS variables, micro-animations, premium aesthetic.
- **User Auth**: Secure Registration and Login with JWT and Bcrypt hashing.
- **Dynamic Fleet Display**: Filterable car listings mapping to a database.
- **Live Bookings**: Date duration calculation and booking validation.
- **Admin Dashboard**: Manage the vehicle fleet (Add, Edit, Delete) and overview of all bookings.

## Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3 Flexbox/Grid
- **Backend**: Node.js, Express.js
- **Database**: MySQL 
- **Libraries**: `mysql2`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`

## Prerequisites
- Node.js (v14 or newer)
- MySQL Server (Running locally or hosted)

## Installation & Setup

1. **Clone the repository** (or download the source).
   ```bash
   cd CAR-RENTAL-SYSTEM
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (if not exists) and configure your MySQL credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=car_rental
   JWT_SECRET=supersecretjwtkey_12345
   ```

4. **Initialize Database Schema**
   Run the setup script. This will automatically create the `car_rental` database, necessary tables, and a default admin account.
   ```bash
   node server/config/init_db.js
   ```

## Running the Application

Start the backend server:
```bash
node server/server.js
```
*Note: For development with auto-restarts, you can use `npm run dev` if configured, or `npx nodemon server/server.js`.*

Once the server says `Server is running on http://localhost:3000`, your API is live.

**To access the frontend**, simply open `public/index.html` in your favorite web browser (or serve it via Live Server in VSCode).

## Admin Access
When the database initializes, it automatically generates a default administrator account:
- **Email**: `admin@carrental.com`
- **Password**: `admin123`

Log in using these credentials to access the Admin Dashboard located at `public/admin.html` where you can add cars and view all customer bookings!

## License
MIT License - Developed for Academic Purposes.
