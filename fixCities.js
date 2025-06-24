const mongoose = require('mongoose');
const Bike = require('./models/bike.model');

// Replace with your actual MongoDB connection string if different
const MONGODB_URI = 'mongodb://localhost:27017/quickwheelz';

async function fixCities() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const bikes = await Bike.find({});
  let updatedCount = 0;

  for (const bike of bikes) {
    if (Array.isArray(bike.city)) {
      // If any city entry is a string with commas, split it
      let changed = false;
      let newCities = [];
      for (const c of bike.city) {
        if (typeof c === 'string' && c.includes(',')) {
          newCities.push(...c.split(',').map(s => s.trim()).filter(Boolean));
          changed = true;
        } else {
          newCities.push(c);
        }
      }
      // Remove duplicates
      newCities = [...new Set(newCities)];
      if (changed) {
        bike.city = newCities;
        await bike.save();
        updatedCount++;
      }
    } else if (typeof bike.city === 'string' && bike.city.includes(',')) {
      // If city is a single string with commas
      bike.city = bike.city.split(',').map(s => s.trim()).filter(Boolean);
      await bike.save();
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} bikes.`);
  await mongoose.disconnect();
}

fixCities().catch(err => {
  console.error(err);
  process.exit(1);
}); 