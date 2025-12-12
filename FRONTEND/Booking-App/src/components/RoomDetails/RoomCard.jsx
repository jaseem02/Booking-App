import React, { useContext } from "react";
import RoomImageSlider from "./RoomImageSlider";
import RoomInfo from "./Roominfo";
import "./RoomDetails.css";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleBooking = async () => {
    // Not logged in → redirect
    if (!user) {
      console.warn("User not logged in, redirecting...");
      return navigate("/auth");
    }

    const token = user.token;
    const userId = user.user.id; // Because backend returns { user: {...}, token: "..."}
    const roomId = room.id;

    if (!token) {
      console.error("Token missing in user context!");
      return navigate("/auth");
    }

    // Date range handling
    const startDate = selectedDateRange.startDate;
    const endDate = selectedDateRange.endDate || startDate;

    console.log("📅 Booking room:", roomId, "for user:", userId);
    console.log("➡️ Dates:", startDate, "to", endDate);

    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const formattedDate = currentDate.toISOString().split("T")[0];

      console.log("➡️ Trying date:", formattedDate);

      try {
        const response = await fetch(
          "https://booking-app-1-c1gs.onrender.com/occupied-dates/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              room: roomId, // backend expects integer
              date: formattedDate,
            }),
          }
        );

        console.log("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`Booking failed for ${formattedDate}`);
        }

        const data = await response.json();
        console.log("✅ Booking success:", data);
      } catch (error) {
        console.error("❌ Error:", error);
        alert("Booking failed for date: " + formattedDate);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (onBookingSuccess) onBookingSuccess();
  };

  return (
    <div className="room-card">
      <RoomImageSlider images={room.images} />
      <RoomInfo room={room} />

      {selectedDateRange ? (
        <button
          className="book-room-button"
          onClick={handleBooking}
          disabled={!selectedDateRange.startDate}
        >
          Book Room
        </button>
      ) : null}
    </div>
  );
};

export default RoomCard;
