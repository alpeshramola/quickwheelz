import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bikes');
  const [newBike, setNewBike] = useState({
    title: '',
    description: '',
    price: '',
    city: [],
    address: '',
    pincode: '',
    image: null,
    specifications: {
      brand: '',
      model: '',
      year: '',
      engineCC: '',
      mileage: ''
    }
  });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (user) {
      setUpiId(user.upiId || '');
    }
  }, [user]);

  const uttarakhandCities = [
    'Dehradun', 'Haridwar', 'Rishikesh', 'Roorkee', 'Haldwani', 'Nainital', 'Almora', 'Pauri', 'Rudrapur', 'Kashipur', 'Mussoorie', 'Tehri', 'Uttarkashi', 'Chamoli', 'Bageshwar', 'Pithoragarh', 'Kotdwar', 'Srinagar (Garhwal)'
  ];

  const cityOptions = uttarakhandCities.map(city => ({ value: city, label: city }));

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'owner') {
        const [bookingsRes, bikesRes] = await Promise.all([
          axios.get('/api/bookings/my-bike-bookings'),
          axios.get(`/api/bikes/owner/${user._id}`)
        ]);
        setBookings(bookingsRes.data.data.bookings || []);
        setBikes(bikesRes.data.data.bikes || []);
      } else {
        const bookingsRes = await axios.get('/api/bookings/my-bookings');
        setBookings(bookingsRes.data.data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Could not fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user, navigate, fetchData]);

  const handleNewBikeSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newBike).forEach(key => {
        if (key === 'specifications') {
          formData.append(key, JSON.stringify(newBike[key]));
        } else if (key === 'city') {
          newBike.city.forEach(cityValue => formData.append('city[]', cityValue));
        } else if (key === 'image' && newBike.image) {
          formData.append('image', newBike.image);
        } else if (key !== 'image' && key !== 'specifications' && newBike[key]) {
          formData.append(key, newBike[key]);
        }
      });

      const response = await axios.post('/api/bikes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setBikes(prevBikes => [...prevBikes, response.data.data.bike]);
      setNewBike({
        title: '', description: '', price: '', city: [], address: '', pincode: '', image: null,
        specifications: { brand: '', model: '', year: '', engineCC: '', mileage: '' }
      });
      document.getElementById('addBikeForm').reset();
      toast.success('Bike added successfully!');
    } catch (error) {
      console.error('Error adding bike:', error);
      toast.error(error.response?.data?.message || 'Error adding bike.');
    }
  };

  const handleBikeDelete = async (bikeId) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      try {
        await axios.delete(`/api/bikes/${bikeId}`);
        setBikes(prevBikes => prevBikes.filter(bike => bike._id !== bikeId));
        toast.success('Bike deleted successfully!');
      } catch (error) {
        toast.error('Error deleting bike.');
      }
    }
  };

  const handleImageChange = (e) => {
    setNewBike(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setNewBike(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value }
    }));
  };
  
  const handleUpiUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/auth/details', { upiId });
      setUser(prevUser => ({ ...prevUser, ...response.data.data.user }));
      toast.success('UPI ID updated successfully!');
    } catch (err) {
      toast.error('Failed to update UPI ID.');
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  const serverUrl = 'http://localhost:5003';

  return (
    <div className={`container mt-4 ${user.role === 'owner' ? 'owner-mode' : 'customer-mode'}`}>
      <div className={user.role === 'owner' ? 'owner-dashboard' : 'customer-dashboard'}>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        {user.role === 'owner' && (
          <div className="nav-tabs">
            <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
            <button className={`btn ${activeTab === 'bikes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('bikes')}>My Bikes</button>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{user.role === 'owner' ? 'Bike Bookings' : 'My Bookings'}</h2>
            {bookings.length === 0 ? <p>No bookings found.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="card">
                    <h3 className="card-title">{booking.bike.title}</h3>
                    <p>Start: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p>Status: {booking.status}</p>
                    <p>Total: ₹{booking.totalPrice}</p>
                    {user.role === 'owner' && booking.user && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Booked By:</h4>
                        <p><strong>Name:</strong> {booking.user.name}</p>
                        <p><strong>Contact:</strong> {booking.user.email}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bikes' && user.role === 'owner' && (
          <div className="p-4 rounded-lg">
            <div className="card mb-8">
              <h3 className="card-title">Your UPI Information</h3>
              <form onSubmit={handleUpiUpdate}>
                <div className="form-group">
                  <label htmlFor="upiId" className="form-label">Your UPI ID</label>
                  <div className="flex items-center">
                    <input id="upiId" type="text" className="form-input flex-grow" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="your-upi-id@provider" />
                    <button type="submit" className="btn btn-primary ml-4">Save UPI</button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Listed Bikes</h2>
              <button className="btn add-bike-btn" onClick={() => document.getElementById('addBikeFormWrapper').scrollIntoView({ behavior: 'smooth' })}>+ Add New Bike</button>
            </div>

            {bikes.length === 0 ? <p>You haven't listed any bikes yet.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {bikes.map((bike) => (
                  <div key={bike._id} className="bike-card">
                    <img src={`${serverUrl}${bike.image}`} alt={bike.title} className="bike-image" />
                    <div className="bike-details">
                      <h3 className="bike-title">{bike.title}</h3>
                      <p className="bike-price">₹{bike.price} per day</p>
                      <p className="bike-city">{Array.isArray(bike.city) ? bike.city.join(', ') : bike.city}</p>
                      <div className="flex justify-between mt-4">
                        <Link to={`/bikes/${bike._id}`} className="btn btn-secondary">View Details</Link>
                        <button className="btn btn-primary" onClick={() => handleBikeDelete(bike._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div id="addBikeFormWrapper" className="card mt-8">
              <h3 className="card-title">Add New Bike</h3>
              <form id="addBikeForm" onSubmit={handleNewBikeSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input name="title" type="text" className="form-input" value={newBike.title} onChange={(e) => setNewBike({ ...newBike, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-input" value={newBike.description} onChange={(e) => setNewBike({ ...newBike, description: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Price per day</label>
                    <input name="price" type="number" className="form-input" value={newBike.price} onChange={(e) => setNewBike({ ...newBike, price: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cities</label>
                    <Select name="city" isMulti options={cityOptions} value={cityOptions.filter(o => newBike.city.includes(o.value))} onChange={s => setNewBike({ ...newBike, city: s ? s.map(o => o.value) : [] })} classNamePrefix="react-select" placeholder="Select cities..."/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Shop Address</label>
                  <input name="address" type="text" className="form-input" value={newBike.address} onChange={e => setNewBike({ ...newBike, address: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Shop Pincode</label>
                  <input name="pincode" type="text" className="form-input" value={newBike.pincode} onChange={e => setNewBike({ ...newBike, pincode: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input name="image" type="file" accept="image/*" className="form-input" onChange={handleImageChange} required />
                </div>
                <div className="card bg-gray-50 p-4">
                  <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group"><label className="form-label">Brand</label><input type="text" name="brand" className="form-input" value={newBike.specifications.brand} onChange={handleSpecChange} required /></div>
                    <div className="form-group"><label className="form-label">Model</label><input type="text" name="model" className="form-input" value={newBike.specifications.model} onChange={handleSpecChange} required /></div>
                    <div className="form-group"><label className="form-label">Year</label><input type="number" name="year" className="form-input" value={newBike.specifications.year} onChange={handleSpecChange} required /></div>
                    <div className="form-group"><label className="form-label">Engine (CC)</label><input type="number" name="engineCC" className="form-input" value={newBike.specifications.engineCC} onChange={handleSpecChange} required /></div>
                    <div className="form-group"><label className="form-label">Mileage (km/l)</label><input type="number" name="mileage" className="form-input" value={newBike.specifications.mileage} onChange={handleSpecChange} required /></div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full">Add Bike</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 