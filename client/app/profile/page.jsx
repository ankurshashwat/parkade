"use client";
import Card from "@components/Card";
import { LoadScript } from "@react-google-maps/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Profile = () => {
  const { data: session, status } = useSession();
  const [parkingDetails, setParkingDetails] = useState([]);
  const [reservationsData, setReservationsData] = useState([]);

  const hasParking = parkingDetails.length > 0 ? true : false;
  const hasReservations = reservationsData.length > 0 ? true : false;

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await fetch(`api/parkings/${session.user.id}`);
        const data = await response.json();
        setParkingDetails(data);
        console.log(data);
      } catch (error) {
        console.log("no parking space found:", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `api/renters/${session.user.id}/reservations`
        );
        const data = await response.json();
        setReservationsData(data);
        console.log(data);
      } catch (error) {
        console.log("no reservations found:", error);
      }
    };

    if (status === "authenticated") {
      fetchParking();
      fetchReservations();
    }
  }, [status]);

  return (
    <div className="p-4">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        {hasParking && (
          <>
            <h2 className="text-2xl font-bold mb-4">Parking Spaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parkingDetails.map((p) => (
                <Card type="Parkings" key={p._id} data={p} />
              ))}
            </div>
          </>
        )}

        {hasReservations && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">Reservations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservationsData.map((r) => (
                <Card type="Reservations" key={r._id} data={r} />
              ))}
            </div>
          </>
        )}
      </LoadScript>
      {!hasReservations && !hasParking && <p>Loading...</p>}
    </div>
  );
};

export default Profile;
