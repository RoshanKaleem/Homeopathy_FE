import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

function ScheduleMeeting() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [startTime, setStartTime] = useState(dayjs());

  const scheduleAPI = async () => {
    const formattedDateTime = startTime.format("YYYY-MM-DD HH:mm");
    const token = localStorage.getItem("token"); // Retrieve the token

    try {
      const orderRes = await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/payments/create-order/`,
        data: {
          name,
          email,
          query,
          start_time: formattedDateTime,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      // Step 2: Check if the order was created successfully
      if (orderRes.data && orderRes.data.links) {
        const approvalUrl = orderRes.data.links.find(
          (link) => link.rel === "payer-action"
        ).href;
        if (approvalUrl) {
          console.log("Redirecting to PayPal approval URL");
          window.location.href = approvalUrl;
        } else {
          console.error("Approval URL not found");
        }
      } else {
        console.error("Invalid order response:", orderRes.data);
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      alert(
        "An error occurred while creating the order. Please check your input and try again."
      );
    }
  };

  return (
    <Container maxWidth="md" style={{ textAlign: "center", padding: "20px" }}>
      <Box mt={4} mb={2}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Book Your Consultation
        </Typography>
        <Typography variant="h6" component="p" paragraph color="textSecondary">
          Our classical homeopathy practice is here to help you on your healing
          journey. Schedule a personalized consultation with one of our
          experienced practitioners today.
        </Typography>
      </Box>

      <Box mt={4}>
        <TextField
          label="Enter Name"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
          value={name}
          style={{ marginBottom: 16, width: "100%" }}
        />
        <br />
        <TextField
          label="Enter Email"
          variant="outlined"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={{ marginBottom: 16, width: "100%" }}
        />
        <br />
        <TextField
          label="Enter Your Query"
          variant="outlined"
          multiline
          rows={4}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          style={{ marginBottom: 16, width: "100%" }}
        />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select Preferred Date & Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "100%" }} />
            )}
            minDateTime={dayjs().add(3, "hour")}
          />
        </LocalizationProvider>
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={scheduleAPI}
          style={{ marginTop: 20 }}
        >
          Schedule Consultation
        </Button>
      </Box>
    </Container>
  );
}

export default ScheduleMeeting;
