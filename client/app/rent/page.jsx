"use client";
import Form from "@components/Form";
import { Context } from "@context/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ERR_TX } from "web3";

const Page = () => {
  const { push } = useRouter();
  const { data: session } = useSession();
  const { makeReservation } = useContext(Context);

  const [address, setAddress] = useState({
    lat: 25.3176,
    lng: 82.9739,
  });

  const [parkingData, setParkingData] = useState();
  const [markers, setMarkers] = useState([]);

  const [post, setPost] = useState({
    parkingId: "",
    startTime: "",
    endTime: "",
    amount: "",
    txHash: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => {
      return {
        ...prevPost,
        [name]: value,
      };
    });
  };

  const updateAddress = async ({ lat, lng }) => {
    setAddress({
      lat: lat,
      lng: lng,
    });
  };

  const getParkingId = async () => {
    const response = await fetch("api/parkings/getParkingId", {
      method: "POST",
      body: JSON.stringify({
        address: address,
      }),
    });
    const data = await response.json();
    console.log("parking:", data);
    return data;
  };

  const getAllMarkers = async () => {
    const response = await fetch("api/parkings/");
    const data = await response.json();
    const latlng = data.filter(
      (parking) => parking.address && parking.address.lat && parking.address.lng
    );
    const markers = latlng.map((parking) => ({
      lat: parking.address.lat,
      lng: parking.address.lng,
    }));
    return markers;
  };

  useEffect(() => {
    getParkingId().then((data) => setParkingData(data));
  }, [address]);

  useEffect(() => {
    getAllMarkers().then((markers) => setMarkers(markers));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parkingData) return;

    const startTime = new Date(post.startTime);
    const endTime = new Date(post.endTime);
    const timeDifference = (endTime - startTime) / (1000 * 60 * 60);
    const duration = Math.round(timeDifference);
    const amount = parkingData.hourlyRate * duration;

    const tx = await makeReservation(amount, parkingData.wallet);
    console.log(tx);
    const response = await fetch(                           //!bad request
      `api/renters/${session.user.id}/reservations`,
      {
        method: "POST",
        body: JSON.stringify({
          renter: session.user.id,
          parking: parkingData._id,
          startTime: post.startTime,
          endTime: post.endTime,
          amount: amount,
          txHash: tx, 
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    if (data.success === true) {
      toast.success("Parking rented", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      push("/");
    }
  };

  const renterData = {
    lat: address.lat, 
    lng: address.lng, 
    startTime: post.startTime,
    endTime: post.endTime,
  };

  const submit = false;

  return (
    <>
      <ToastContainer />
      <Form
        type="renter"
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        post={renterData}
        submit={submit}
        updateAddress={updateAddress}
        markers={markers}
        address={address}
      />
    </>
  );
};

export default Page;
