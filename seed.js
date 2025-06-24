const mongoose = require('mongoose');
const User = require('./models/user.model');
const Bike = require('./models/bike.model');
const config = require('./config/config');

async function seed() {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Remove old data
  await User.deleteMany({ email: 'owner@example.com' });
  await User.deleteMany({ email: 'nehanegi123@gmail.com' });
  await Bike.deleteMany({ title: /Seed Bike/ });

  // Create owner user
  const owner = new User({
    name: 'Test Owner',
    email: 'owner@example.com',
    password: 'password123',
    role: 'owner',
    city: 'Dehradun',
    bookingLicenseId: 'OWN12345'
  });
  await owner.save();

  // Create customer user
  const customer = new User({
    name: 'Neha Negi',
    email: 'nehanegi123@gmail.com',
    password: 'nehaneGI@123',
    role: 'customer'
  });
  await customer.save();

  // Create bikes
  // const bikes = [
  //   {
  //     title: 'Seed Bike 1',
  //     description: 'A great bike for city rides.',
  //     pricePerDay: 500,
  //     price: 500,
  //     city: 'Dehradun',
  //     owner: owner._id,
  //     address: '123 Main Street',
  //     pincode: '248001',
  //     image: 'https://via.placeholder.com/300x200.png?text=No+Image',
  //     specifications: {
  //       engineSize: '150cc',
  //       mileage: 45,
  //       fuelType: 'Petrol'
  //     }
  //   },
  //   {
  //     title: 'Seed Bike 2',
  //     description: 'Perfect for mountain trips.',
  //     pricePerDay: 700,
  //     price: 700,
  //     city: 'Dehradun',
  //     owner: owner._id,
  //     address: '456 Hill Road',
  //     pincode: '249201',
  //     image: 'https://via.placeholder.com/300x200.png?text=No+Image',
  //     specifications: {
  //       engineSize: '200cc',
  //       mileage: 40,
  //       fuelType: 'Petrol'
  //     }
  //   }
  // ];

  // await Bike.insertMany(bikes);
  console.log('Seed data inserted!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
}); 