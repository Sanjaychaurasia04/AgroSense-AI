import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get stored location
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
      setLoading(false);
    } else {
      // Get user's current location
      getUserLocation();
    }
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode to get location details
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            
            const locationData = {
              lat: latitude,
              lng: longitude,
              state: response.data.address.state || 'Unknown',
              district: response.data.address.county || response.data.address.city || 'Unknown',
              pincode: response.data.address.postcode || '',
            };
            
            setUserLocation(locationData);
            localStorage.setItem('userLocation', JSON.stringify(locationData));
          } catch (error) {
            console.error('Error getting location details:', error);
            // Set basic location without details
            setUserLocation({ lat: latitude, lng: longitude });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Please enable location services for better experience');
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const updateLocation = (newLocation) => {
    setUserLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
    toast.success('Location updated successfully');
  };

  const value = {
    userLocation,
    loading,
    updateLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};