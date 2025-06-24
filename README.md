# QuickWheelz - Bike Rental Platform

A modern bike rental platform inspired by Royal Brothers, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Two user roles: Customer and Owner
- Bike listing and management
- Booking system with status tracking
- City-based bike filtering
- Secure API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd quickwheelz
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
npm run dev
```

The server will start on port 5000 by default.

## API Endpoints

### Authentication

- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user

### Bikes

- GET /api/bikes - Get all bikes (optional query param: city)
- GET /api/bikes/:id - Get single bike
- POST /api/bikes - Add new bike (Owner only)
- PUT /api/bikes/:id - Update bike (Owner only)
- DELETE /api/bikes/:id - Delete bike (Owner only)

### Bookings

- POST /api/bookings - Create new booking (Customer only)
- GET /api/bookings/my-bookings - Get user's bookings
- GET /api/bookings/my-bike-bookings - Get owner's bike bookings (Owner only)
- PATCH /api/bookings/:id/status - Update booking status (Owner only)

## Environment Variables

The application uses a config file (`config/config.js`) instead of .env for easier setup. You can modify the configuration values there.

## License

MIT 