"use client";
import Form from "@components/Form";
import { Context } from "@context/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const { push } = useRouter();
  const { account } = useContext(Context);
  const { data: session } = useSession();

  const [post, setPost] = useState({
    address: {
      lat: 0,
      lng: 0,
    },
    wallet: account,
    hourlyRate: "",
    reservations: "",
  });

  useEffect(() => {
    if (account) {
      setPost((prevPost) => ({
        ...prevPost,
        wallet: account,
      }));
    }
  }, [account]);

  const updateAddress = async ({ lng, lat }) => {
    setPost((prevPost) => ({
      ...prevPost,
      address: {
        lat: lat,
        lng: lng,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("api/parkings/new", {
      method: "POST",
      body: JSON.stringify({
        owner: session.user.id,
        wallet: post.wallet,
        address: post.address,
        hourlyRate: post.hourlyRate,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success === true) {
      toast('Parking listed', {
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

  const ownerFormData = {
    hourlyRate: post.hourlyRate,
    wallet: post.wallet,
    reservations: post.reservations,
  };

  const submit = false;

  return (
    <>
      <ToastContainer /> 
      <Form
        type="owner"
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        post={ownerFormData}
        submit={submit}
        updateAddress={updateAddress}
      />
    </>
  );
};

export default Page;
