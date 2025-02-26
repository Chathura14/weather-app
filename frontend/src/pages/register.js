import React, { useState, useCallback } from 'react';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingUnsubscribe, setLoadingUnsubscribe] = useState(false);
  const [currentTab, setCurrentTab] = useState('subscribe');

  const validateEmail = (email) => {
    return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  };

  const sendOTP = useCallback(async () => {
    setLoadingOTP(true);
    try {
      await axios.post('http://localhost:3000/api/users/send-otp', { email });
      setMessage('OTP sent to your email.');
    } catch {
      setMessage('Failed to send OTP. Try again.');
    } finally {
      setLoadingOTP(false);
    }
  }, [email]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    // Added validation for empty fields
    if (!email || !district || !city || !otp) {
      setMessage('All fields including OTP are required.');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email.');
      return;
    }
  
    setLoadingRegister(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/verify-otp', { email, otp });
      if (response.data === 'OTP verified') {
        const registerResponse = await axios.post('http://localhost:3000/api/users/add', { email, location: `${city}, ${district}` });
        if (registerResponse.status === 201) {
          setMessage('User registered successfully!');
          setEmail('');
          setDistrict('');
          setCity('');
          setOtp('');
        } else {
          setMessage('Failed to register user. Try again.');
        }
      } else {
        setMessage('Invalid or expired OTP.');
      }
    } catch {
      setMessage('Server error. Please try again later.');
    } finally {
      setLoadingRegister(false);
    }
  };
  
  const handleUnsubscribe = async () => {
    if (!email || !otp) {
      setMessage('Email and OTP are required to unsubscribe.');
      return;
    }
  
    setLoadingUnsubscribe(true);
    try {
      const otpResponse = await axios.post('http://localhost:3000/api/users/verify-otp', { email, otp });
      if (otpResponse.data === 'OTP verified') {
        const response = await axios.post('http://localhost:3000/api/users/unsubscribe', { email, otp });
        if (response.status === 200) {
          setMessage('Unsubscribed successfully.');
          setEmail('');
          setOtp('');
        } else {
          setMessage('Failed to unsubscribe.');
        }
      } else {
        setMessage('Invalid or expired OTP.');
      }
    } catch {
      setMessage('Server error. Please try again later.');
    } finally {
      setLoadingUnsubscribe(false);
    }
  };  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-blue-600 text-white">
      <div className="bg-white text-gray-900 p-8 rounded-xl shadow-lg w-96">
        <div className="flex mb-6">
          <button onClick={() => setCurrentTab('subscribe')} className={`w-1/2 py-2 text-lg font-semibold rounded-l-lg ${currentTab === 'subscribe' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>Subscribe</button>
          <button onClick={() => setCurrentTab('unsubscribe')} className={`w-1/2 py-2 text-lg font-semibold rounded-r-lg ${currentTab === 'unsubscribe' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>Unsubscribe</button>
        </div>
        {currentTab === 'subscribe' ? (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" required />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" required />
            <input type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" required />
            <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" required />
            <button type="button" onClick={sendOTP} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">{loadingOTP ? 'Sending OTP...' : 'Send OTP'}</button>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">{loadingRegister ? 'Registering...' : 'Register'}</button>
          </form>
        ) : (
          <div className="flex flex-col space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" required />
            <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" required />
            <button type="button" onClick={sendOTP} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">{loadingOTP ? 'Sending OTP...' : 'Send OTP'}</button>
            <button onClick={handleUnsubscribe} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">{loadingUnsubscribe ? 'Unsubscribing...' : 'Unsubscribe'}</button>
          </div>
        )}
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
