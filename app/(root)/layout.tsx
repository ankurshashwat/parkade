import React from "react";
// import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/shared/navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </div>
      {/* <Toaster /> */}
    </main>
  );
};

export default Layout;
