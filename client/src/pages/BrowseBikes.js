import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CitySelector from '../components/CitySelector';
import '../styles/BrowseBikes.css';

const BrowseBikes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBikes = async () => {
      try {
        const url = selectedCity ? `/api/bikes?city=${selectedCity}` : '/api/bikes';
        const response = await axios.get(url);
        setBikes(response.data.data.bikes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bikes:', error);
        setLoading(false);
      }
    };

    fetchBikes();
  }, [selectedCity, user, navigate]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleBookNow = (bikeId) => {
    navigate(`/bikes/${bikeId}`);
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="browse-bikes-container">
      <h1>Browse Available Bikes</h1>
      
      <CitySelector onCitySelect={handleCitySelect} />

      {selectedCity ? (
        <>
          <h2>Available Bikes in {selectedCity}</h2>
          {bikes.length === 0 ? (
            <p className="no-bikes-message">No bikes available in {selectedCity}.</p>
          ) : (
            <div className="bikes-grid">
              {bikes.map((bike) => (
                <div key={bike._id} className="bike-card">
                  <img src={bike.image} alt={bike.title} className="bike-image" />
                  <div className="bike-details">
                    <h3 className="bike-title">{bike.title}</h3>
                    <p className="bike-price">₹{bike.price} per day</p>
                    <p className="bike-description">{bike.description}</p>
                    <div className="bike-specs">
                      <p>Brand: {bike.specifications?.brand}</p>
                      <p>Model: {bike.specifications?.model}</p>
                      <p>Year: {bike.specifications?.year}</p>
                      <p>Engine: {bike.specifications?.engineCC}cc</p>
                      <p>Mileage: {bike.specifications?.mileage} km/l</p>
                    </div>
                    <button
                      className="book-now-btn"
                      onClick={() => handleBookNow(bike._id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="select-city-message">
          Please select a city to view available bikes
        </div>
      )}
    </div>
  );
};

export default BrowseBikes; 