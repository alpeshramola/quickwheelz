import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CitySelector.css';

const CitySelector = ({ onCitySelect }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/bikes/cities');
        const uniqueCities = [...new Set(response.data.data.cities)];
        setCities(uniqueCities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    onCitySelect(city);
  };

  const handleSearch = () => {
    if (selectedCity && pincode) {
      onCitySelect({ city: selectedCity, pincode });
    }
  };

  if (loading) {
    return <div className="city-selector-loading">Loading cities...</div>;
  }

  return (
    <div className="city-selector">
      <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem' }}>Select a City</h2>
      <div className="city-grid">
        {cities.map((city) => (
          <button
            key={city}
            className={`city-button ${selectedCity === city ? 'selected' : ''}`}
            onClick={() => handleCityChange(city)}
            style={{ margin: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #FFD600', background: selectedCity === city ? '#FFD600' : '#fff', color: selectedCity === city ? '#000' : '#333', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
          >
            {city}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={e => setPincode(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', marginRight: '0.5rem' }}
        />
        <button
          onClick={handleSearch}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: '6px' }}
          disabled={!selectedCity || !pincode}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default CitySelector; 