import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

function ScheduleMeeting() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [error, setError] = useState("");
  const [isTimeValid, setIsTimeValid] = useState(false);

  const scheduleAPI = async () => {
    const formattedDateTime = startTime.format("YYYY-MM-DD HH:mm");
    const token = localStorage.getItem("token");

    try {
      const orderRes = await axios({
        method: "post",
        url: `${process.env.REACT_APP_URL}/api/payments/create-order/`,
        data: {
          name,
          email,
          query,
          start_time: formattedDateTime,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (orderRes.data && orderRes.data.links) {
        const approvalUrl = orderRes.data.links.find(
          (link) => link.rel === "payer-action"
        ).href;
        if (approvalUrl) {
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

  const validateTime = (date) => {
    const selectedDate = dayjs(date).tz("Australia/Sydney");
    const day = selectedDate.day();
    const hour = selectedDate.hour();

    if (
      (day >= 1 && day <= 5 && hour >= 16 && hour < 21) || // Mon - Fri: 16:00 - 21:00
      ((day === 0 || day === 6) && hour >= 8 && hour < 20)  // Sat & Sun: 8:00 - 20:00
    ) {
      console.log(hour)
      return true;
    }
    console.log(hour)
    return false;
  };

  useEffect(() => {
    const isValid = validateTime(startTime);
    setIsTimeValid(isValid);
    setError(
      isValid
        ? ""
        : "Appointments are only available between 16:00-21:00 Mon-Fri and 8:00-20:00 Sat & Sun (AEST)"
    );
  }, [startTime]);

  return (
    <Container maxWidth="md" style={{ textAlign: "center", padding: "20px" }}>
      <Box mt={4} mb={2}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Book Your Consultation
        </Typography>
        <Typography variant="h6" component="h1" gutterBottom color="primary">
          15mins only for 25$
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
        {error && (
          <Typography variant="body2" color="error" style={{ marginTop: 10 }}>
            {error}
          </Typography>
        )}
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={scheduleAPI}
          style={{ marginTop: 20 }}
          disabled={!isTimeValid}
        >
          Schedule Consultation
        </Button>
      </Box>
    </Container>
  );
}

export default ScheduleMeeting;
