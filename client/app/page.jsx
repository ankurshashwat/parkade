"use client";

import Map from "@components/Maps/Map";

const Home = () => {
  return (
    <section className="w-full text-white flex items-center justify-center flex-col min-h-screen">
      <h1 className="head_text text-center">
        Your Gateway to Effortless
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> Parking Solutions </span>
      </h1>
      <p className="desc text-center">
        Turn Your Parking Space into Profit or Find Hassle-Free Parking
        Solutions.
      </p>

      <Map />
    </section>
  );
};

export default Home;
