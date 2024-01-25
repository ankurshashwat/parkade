"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const setupProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    setupProviders();
  }, []);

  console.log("session: ", session);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <p className="logo_text">Parkade</p>
      </Link>

      <div className="sm:flex hidden items-center gap-3 md:gap-5">
        <Link href="/list">
          <button className="font-satoshi px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold glassmorphism">
            List
          </button>
        </Link>

        <Link href="/rent">
          <button className="font-satoshi px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold glassmorphism">
            Rent
          </button>
        </Link>

        {session?.user ? (
          <>
            <button
              type="button"
              onClick={signOut}
              className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
            >
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                src={session?.user.image}
                alt="profile"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
            />

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/list"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  List Parking Space
                </Link>
                <Link
                  href="/rent"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Rent Parking Space
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  className="px-4 md:px-4 py-2 md:py-2 text-xs md:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
