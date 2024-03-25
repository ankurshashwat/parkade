"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const Checkout = () => {
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState();
  return (
    <div>
      <Button className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500">
        <Image
          src="/assets/icons/stars.svg"
          alt="star"
          width={12}
          height={12}
          className={`object-contain ${isProcessing && "animate-pulse"}`}
        />
        {isProcessing ? "Processing..." : "Make a booking"}
      </Button>
    </div>
  );
};

export default Checkout;
