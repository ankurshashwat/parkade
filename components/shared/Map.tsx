"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Libraries,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { darkMapStyle } from "@/constants/map";
import { Input } from "../ui/input";
import Image from "next/image";

export interface MapProps {
  updateAddress: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

const containerStyle = {
  width: "100%",
  height: "400px",
  display: "flex",
};

const libraries: Libraries = ["places"];

const Map = ({ updateAddress }: MapProps) => {
  const [marker, setMarker] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  // eslint-disable-next-line no-undef
  const searchBoxRef = useRef<google.maps.places.Autocomplete | null>(null);
  // eslint-disable-next-line no-undef
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // eslint-disable-next-line no-undef
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    const input = document.getElementById("search-box") as HTMLInputElement;
    searchBoxRef.current = new window.google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "IN" },
    });
    searchBoxRef.current.addListener("place_changed", onSearchBoxPlacesChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchBoxPlacesChanged = useCallback(() => {
    if (searchBoxRef.current === null) {
      return;
    }

    const place = searchBoxRef.current.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }

    const newMarker: { address: string; lat: number; lng: number } = {
      address: place.formatted_address!,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMarker(newMarker);

    if (mapRef.current) {
      mapRef.current.panTo(newMarker);
      mapRef.current.setZoom(12);
    }
  }, []);

  // eslint-disable-next-line no-undef
  const onMapClick = (event: any) => {
    // Check if event.latLng is not null
    if (event.latLng) {
      const newMarker = {
        address: event.latLng.toString(),
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setMarker(newMarker);
    }
  };

  useEffect(() => {
    if (marker) {
      updateAddress(marker);
    }
  }, [marker, updateAddress]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {isLoaded && (
        <>
          <div
            className={`background-light800_darkgradient mb-4 flex size-full min-h-[56px] grow items-center gap-4 rounded-[10px] px-4`}
          >
            <Image
              src="assets/icons/search.svg"
              alt="search icon"
              width={24}
              height={24}
              className="cursor-pointer"
            />
            <Input
              id="search-box"
              type="text"
              placeholder="Search for your location"
              className="text-dark400_light700 paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
            />
          </div>
          <div style={{ flex: 1, marginBottom: 16 }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={marker || { lat: 25.3176, lng: 82.9739 }}
              zoom={12}
              onLoad={onMapLoad}
              onClick={onMapClick}
              options={{ styles: darkMapStyle }}
            >
              {marker && <Marker position={marker} />}
            </GoogleMap>
          </div>
        </>
      )}
      {!isLoaded && <div>Loading Google Maps...</div>}
    </div>
  );
};

export default Map;
