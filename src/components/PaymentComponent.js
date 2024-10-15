import React, { useEffect } from 'react';
import axios from 'axios';

import React from 'react';

const PayPalComponent = () => {
  const handlePayment = async () => {
    const response = await fetch('http://localhost:8000/api/create-paypal-order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const paymentData = await response.json();
    
    // Handle PayPal approval here using the response data
    if (paymentData.links) {
      const approvalUrl = paymentData.links.find(link => link.rel === 'approval_url').href;
      window.location.href = approvalUrl; // Redirect to PayPal for approval
    }
  };

  return (
    <button onClick={handlePayment}>Pay with PayPal</button>
  );
};

export default PayPalComponent;

