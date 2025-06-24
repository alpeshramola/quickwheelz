import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BikeList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(selectedCity ? `/api/bikes?city=${selectedCity}` : '/api/bikes');
        setBikes(response.data.data.bikes);
        
        // Extract unique cities
        const uniqueCities = [...new Set(response.data.data.bikes.map(bike => bike.city))];
        setCities(uniqueCities);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bikes:', error);
        setLoading(false);
      }
    };

    fetchBikes();
  }, [selectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-2xl font-bold mb-4">Available Bikes</h1>
      
      <div className="mb-4">
        <label className="form-label">Select City</label>
        <select 
          className="form-input" 
          value={selectedCity} 
          onChange={handleCityChange}
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {bikes.length === 0 ? (
        <p>No bikes available in this city.</p>
      ) : (
        <div className="grid grid-cols-3">
          {bikes.map((bike) => (
            <div key={bike._id} className="bike-card">
              <img src={bike.image} alt={bike.title} className="bike-image" />
              <div className="bike-details">
                <h3 className="bike-title">{bike.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <p className="bike-price">₹{bike.price} per day</p>
                  <span className={`status ${bike.available ? 'text-success' : 'text-error'}`}>
                    {bike.available ? 'Available' : 'Booked'}
                  </span>
                </div>
                <p className="mb-2">{bike.city}</p>
                {bike.specifications && (
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Brand: {bike.specifications.brand}</p>
                    <p>Model: {bike.specifications.model}</p>
                    <p>Engine: {bike.specifications.engineCC}cc</p>
                  </div>
                )}
                <Link
                  to={`/bikes/${bike._id}`}
                  className={`btn ${bike.available ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                >
                  {bike.available ? 'Book Now' : 'View Details'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BikeList; 