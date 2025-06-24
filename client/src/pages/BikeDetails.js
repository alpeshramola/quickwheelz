import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './../styles/BikeDetails.css';

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedBike, setEditedBike] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/bikes/${id}`);
        setBike(response.data.data.bike);
        setEditedBike(response.data.data.bike);
        setError('');
      } catch (err) {
        setError('Bike not found or could not be loaded.');
        setBike(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [id]);

  useEffect(() => {
    if (bike && bookingDates.startDate && bookingDates.endDate) {
      const start = new Date(bookingDates.startDate);
      const end = new Date(bookingDates.endDate);
      if (end >= start) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        setTotalPrice(days * bike.price);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [bike, bookingDates]);

  const handleDateChange = (e) => {
    setBookingDates({
      ...bookingDates,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to book a bike.');
      navigate('/login');
      return;
    }
    
    setError('');
    setBookingLoading(true);
    try {
      await axios.post('/api/bookings', {
        bike: id,
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
        totalPrice: totalPrice,
      });
      toast.success('Booking successful! The owner will contact you shortly.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedBike(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editedBike).forEach(key => {
        if (typeof editedBike[key] !== 'object' || editedBike[key] === null) {
          formData.append(key, editedBike[key]);
        }
      });
       if (imageFile) formData.append('image', imageFile);

      const response = await axios.put(`/api/bikes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBike(response.data.data.bike);
      setEditMode(false);
      toast.success('Bike updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating bike');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      try {
        await axios.delete(`/api/bikes/${id}`);
        toast.success('Bike deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting bike');
      }
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error && !bike) return <div className="error-message container mt-4">{error}</div>;
  if (!bike) return <div className="container mt-4">No bike data available.</div>;

  const safeJoin = (field) => (Array.isArray(field) ? field.join(', ') : field);
  const isOwner = user && bike.owner._id === user._id;

  return (
    <div className="bike-details-container">
      <img src={bike.image} alt={bike.title} className="bike-image" />
      <div className="bike-info">
        <h1 className="bike-title">{bike.title}</h1>
        <p className="bike-description">{bike.description}</p>
        
        <div className="details-grid">
          <p className="detail-item"><span>Price per Day:</span> ₹{bike.price}</p>
          <p className="detail-item"><span>Location:</span> {safeJoin(bike.city)}</p>
          <p className="detail-item"><span>Address:</span> {bike.address}</p>
        </div>

        <div className="section-divider"></div>

        <h2 className="section-title">Owner Information</h2>
        <div className="owner-info-card">
          <p><span>Name:</span> {bike.owner.name}</p>
          <p><span>Contact:</span> {bike.owner.email}</p>
          {bike.owner.upiId && <p><span>UPI for Payment:</span> {bike.owner.upiId}</p>}
        </div>

        {!isOwner && bike.available && (
          <>
            <div className="section-divider"></div>
            <h2 className="section-title">Book This Bike</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleBooking} className="booking-form">
              <div className="date-inputs">
                <div>
                  <label htmlFor="startDate">Start Date</label>
                  <input id="startDate" type="date" name="startDate" value={bookingDates.startDate} onChange={handleDateChange} required />
                </div>
                <div>
                  <label htmlFor="endDate">End Date</label>
                  <input id="endDate" type="date" name="endDate" value={bookingDates.endDate} onChange={handleDateChange} required />
                </div>
              </div>
              
              {totalPrice > 0 && (
                <div className="total-price">
                  <p>Total Price: ₹{totalPrice}</p>
                </div>
              )}

              <button type="submit" disabled={bookingLoading} className="confirm-booking-btn">
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        )}
        
        {!bike.available && <p className="mt-4 text-yellow-600">This bike is not available for booking.</p>}
      </div>
    </div>
  );
};

export default BikeDetails; 