"use client";
import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const BiddingPage = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [highestBid, setHighestBid] = useState(0); 

  const vehicleDetails = {
    name: "TOYOTA C-HR 2017/6",
    location: "No 23, Yokoma, Japan.",
    modelCode: "C-HR18-6",
    acceptedPrice: "2000yen",
    productId: "#NK92",
    specs: [
      "YOM 2018/06", "YOR 2019/06", "PETROL",
      "3300CC", "3300DKM", "AUTOMATIC",
      "LEFT DRIVE", "2 WHEEL DRIVE", "5 SEATS",
      "5 DOORS", "1000KM", "MEROON"
    ],
    accessories: [
      "Sunroof", "Ac", "ABS", "Air Bag", "CD Player", "Central Locking",
      "Radio", "Fog Light", "360 Camera", "Pwr Mirror", "Push Start", "Back Camera"
    ],
    userDetails: {
      userName: "C-HR18-6",
      userId: "2000yen",
      email: "mark@gmail.com",
      address: "No 23, Yokoma, Japan.",
      prefecture: "Yokohoma.",
      lineNumber: "+9957944443",
      whatsApp: "+9957944443"
    }
  };

  // Initialize Pusher and subscribe to updates
  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('1e34549e90f59174565d', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('bids');
    channel.bind('App\\Events\\NewBidPlaced', function(data) {
      console.log(data); // Check this output

      if (data && data.highest_bid !== undefined) {
        setHighestBid(data.highest_bid);
      } else {
        console.error('Unexpected data format:', data);
      }
    });

    return () => {
      pusher.unsubscribe('bids');
    };
  }, []);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (bidAmount && !isNaN(bidAmount)) {
      const response = await fetch('http://127.0.0.1:8000/api/place-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ car_id: 1, amount: bidAmount, user: 1 }), 
      });

      const result = await response.json();
      if (response.ok) {
        setFeedbackMessage(`Your bid of ${bidAmount} yen has been placed successfully.`);
        setBidAmount('');
        // Update the highest bid with the result from the backend
        setHighestBid(result.highest_bid);
      } else {
        setFeedbackMessage("Bid limit reached or an error occurred.");
      }

      setTimeout(() => setFeedbackMessage(''), 3000);
    } else {
      setFeedbackMessage("Please enter a valid bid amount.");
    }
  };

  return (
    <div className="bg-gray-700 p-6 min-h-screen">
      <button className="bg-red-500 text-white px-4 py-2 rounded mb-4">
        ← Back
      </button>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{vehicleDetails.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{vehicleDetails.location}</p>
            
            <div className="relative aspect-video bg-gray-300 rounded-lg overflow-hidden mb-4">
              <img src="https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/rolls_royce_phantom_top_10.jpg?itok=XjL9f1tx" alt="Vehicle" className="object-cover w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <button className="bg-white/50 p-2 rounded-full">←</button>
                <button className="bg-white/50 p-2 rounded-full">→</button>
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white" />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {vehicleDetails.specs.map((spec, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-center text-sm">
                  {spec}
                </span>
              ))}
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-center">Place Your Bid</h4>
              <div className="text-center text-lg mb-2">Highest Bid: {highestBid} yen</div> 
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Enter bid amount in yen"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-grow px-3 py-2 border rounded"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Bid Now
                  </button>
                </div>
                {feedbackMessage && (
                  <p className={`text-center ${feedbackMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {feedbackMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold">Model Code</p>
                <p>{vehicleDetails.modelCode}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Accepted Price</p>
                <p>{vehicleDetails.acceptedPrice}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Product Id</p>
                <p>{vehicleDetails.productId}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Accessories & Options</h4>
              <div className="grid grid-cols-2 gap-2">
                {vehicleDetails.accessories.map((accessory, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-sm">{accessory}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">User Details</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(vehicleDetails.userDetails).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingPage;
