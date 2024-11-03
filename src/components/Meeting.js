import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";

function Meeting() {
  const [searchParams] = useSearchParams();
  const [hasCaptured, setHasCaptured] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("token");
    const payerID = searchParams.get("PayerID");
    const token = localStorage.getItem("token");

    if (orderId && payerID && !hasCaptured) {
      captureOrder(orderId, payerID, token);
    } else {
        fetchMeetings(token);
        setLoading(false);
    }
  }, [searchParams, hasCaptured]);

  const captureOrder = async (orderId, payerID, token) => {
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_URL}/api/payments/capture-order/`,
        data: {
          orderId,
          payerID,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }}
      );
      setHasCaptured(true);
      fetchMeetings(token);
    } catch (error) {
      console.error("Error capturing order:", error);
      alert("An error occurred while capturing the order.");
    } finally {
        setLoading(false);
    }
  };

  const fetchMeetings = async (token) => {
    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_URL}/api/meetings/`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }
    );
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      alert("An error occurred while fetching the meetings.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {loading ? (
        <>
          <h2>Processing your payment...</h2>
          <p>Please wait while we confirm your payment details.</p>
        </>
      ) : (
        <>
          {meetings.length > 0 ? (
            <div>
              <h3>Your Meetings:</h3>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {meetings.map((meeting) => (
                  <li key={meeting.id} style={{ border: "1px solid #ccc", borderRadius: "5px", margin: "10px", padding: "10px", textAlign: "left" }}>
                    <h4>{meeting.topic}</h4>
                    <p style={{ margin: "10px 0" }}>{meeting.agenda}</p>
                    <Button
                      variant="contained"
                      color="primary"
                      href={meeting.meeting_url}
                      target="_blank"
                      style={{ marginRight: "10px" }}
                    >
                      Join Meeting
                    </Button>
                    <p style={{ fontStyle: "italic", marginTop: "10px" }}>Start Time: {new Date(meeting.start_time).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              href="/book-consultancy"
              sx={{ mt: 2 }}
            >
              Schedule a Consultation
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default Meeting;
