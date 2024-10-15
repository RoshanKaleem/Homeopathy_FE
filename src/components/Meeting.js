import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Meeting() {
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const orderId = localStorage.getItem("orderId"); // Ensure this is set properly

  const captureOrder = async (orderId) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")); // Retrieve user details
    if (!userDetails) {
      console.error("User details not found");
      return;
    }

    const { name, email, query , startTime} = userDetails; // Destructure user details

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/payments/capture-order/`, 
        { order_id: orderId }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        console.log("Order captured successfully:", response.data);
        
        const payload = {
          name: name, 
          email: email,
          query: query,
          start_time: startTime,
          // You might want to include additional data like start_time if needed
        };
        
        const meetingRes = await axios.post(`http://127.0.0.1:8000/api/admin/create-meeting/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Meeting created:', meetingRes.data);
      } else {
        console.error("Failed to capture order:", response.data);
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error capturing order:", error);
      alert("An error occurred while capturing the order. Please try again.");
    }
  };  

  // Fetch meetings when component mounts
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/meetings/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();

    // Capture the order if orderId is available
    if (orderId) {
      captureOrder(orderId);
      localStorage.removeItem("orderId"); // Clear orderId after capturing
    }
  }, [orderId, token]); // Adding orderId as a dependency

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>Meetings</Typography>
      <Grid container spacing={3}>
        {meetings.map(meeting => (
          <Grid item xs={12} sm={6} md={4} key={meeting.id}>
            <Card 
              sx={{
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                }
              }}
            >
              <CardContent>
                <Typography variant="h5">{meeting.topic}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {meeting.agenda}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: 'blue', color: 'white', '&:hover': { backgroundColor: 'darkblue' } }}
                  endIcon={<ArrowForwardIcon />} 
                  onClick={() => navigate(`/meetings/${meeting.id}`)}
                >
                  Start Meeting
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Meeting;
