import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [bikes, setBikes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all cities from bikes
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/bikes');
        const uniqueCities = [...new Set(response.data.map(bike => bike.city))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        let url = '/api/bikes';
        if (selectedCity) {
          url += `?city=${selectedCity}`;
        }
        const response = await axios.get(url);
        setBikes(response.data);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };
    fetchBikes();
  }, [selectedCity]);

  useEffect(() => {
    const fetchShops = async () => {
      if (!selectedCity) return;
      try {
        const response = await axios.get(`/api/bikes?city=${selectedCity}`);
        // Collect unique shops by shopName and address
        const shopMap = {};
        response.data.forEach(bike => {
          if (!shopMap[bike.shopName]) {
            shopMap[bike.shopName] = bike.address;
          }
        });
        const uniqueShops = Object.entries(shopMap).map(([shopName, address]) => ({ shopName, address }));
        setShops(uniqueShops);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };
    fetchShops();
  }, [selectedCity]);

  useEffect(() => {
    const fetchBikesByShop = async () => {
      if (!selectedShop) return;
      try {
        const response = await axios.get(`/api/bikes?city=${selectedCity}&shopName=${selectedShop}`);
        setBikes(response.data);
      } catch (error) {
        console.error('Error fetching bikes by shop:', error);
      }
    };
    fetchBikesByShop();
  }, [selectedShop, selectedCity]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedShop(null);
  };

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Premium Bike Rentals in India</h1>
          <p className="hero-subtitle">Rent the premium bikes for your dream ride</p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose QuickWheelz?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-motorcycle"></i>
            <h3>Wide Selection</h3>
            <p>Choose from our extensive fleet of well-maintained bikes</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Safe & Secure</h3>
            <p>All bikes are regularly sanitized and maintained</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-clock"></i>
            <h3>24/7 Support</h3>
            <p>Round the clock customer support for your needs</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Multiple Locations</h3>
            <p>Convenient pickup and drop points across cities</p>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account with basic details</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Choose Your Bike</h3>
            <p>Select from our wide range of premium bikes</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Make Payment</h3>
            <p>Complete the secure payment process</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Enjoy Your Ride</h3>
            <p>Pick up your bike and start your journey</p>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <h1>Available Bikes</h1>
        <div className="mb-4">
          <select
            className="form-select"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {selectedCity && !selectedShop && (
          <div className="mb-4">
            <h3>Shops in {selectedCity}</h3>
            <ul className="list-group">
              {shops.map((shop) => (
                <li
                  key={shop.shopName}
                  className="list-group-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleShopClick(shop.shopName)}
                >
                  <div><strong>{shop.shopName}</strong></div>
                  <div style={{ fontSize: '0.95em', color: '#555' }}><strong>Address:</strong> {shop.address}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedShop && (
          <div>
            <h3>Bikes in {selectedShop}</h3>
            <div className="row">
              {bikes.map((bike) => (
                <div key={bike._id} className="col-md-4 mb-4">
                  <div className="card">
                    {bike.image && (
                      <img
                        src={`/uploads/${bike.image}`}
                        className="card-img-top"
                        alt={bike.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{bike.name}</h5>
                      <p className="card-text">
                        <strong>Price:</strong> ₹{bike.price}/day
                      </p>
                      <p className="card-text">
                        <strong>City:</strong> {bike.city}
                      </p>
                      <p className="card-text">
                        <strong>Shop:</strong> {bike.shopName}
                      </p>
                      <Link
                        to={`/bikes/${bike._id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 