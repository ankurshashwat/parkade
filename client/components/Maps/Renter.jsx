import { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { darkMapStyle } from "@utils/constants";

const containerStyle = {
  width: "100%",
  height: "400px",
  display: "flex",
  flexDirection: "column",
};

const libraries = ["places"];

const Renter = ({ markers, updateAddress }) => {
  const [currentPosition, setCurrentLocation] = useState({
    lat: 0.00,
    lng: 0.00,
  });

  const [closestMarker, setClosestMarker] = useState({
    lat: 25.3176,
    lng: 82.9739,
  });

  const searchBoxRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onMapLoad = (map) => {
    mapRef.current = map;
    searchBoxRef.current = new window.google.maps.places.Autocomplete(
      document.getElementById("search-box")
    );
    searchBoxRef.current.addListener("place_changed", onSearchBoxPlacesChanged);
  };

  const onSearchBoxPlacesChanged = () => {
    const place = searchBoxRef.current.getPlace();

    if (!place.geometry) {
      console.error("No geometry available for the selected place.");
      return;
    }

    setCurrentLocation({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  const findClosestMarker = () => {
    if (!markers || markers.length === 0) {
      return null;
    }

    let closestMarker = markers[0];
    let closestDistance = Number.MAX_VALUE;
    markers.forEach((marker) => {
      const distance = Math.sqrt(
        Math.pow(marker.lat - currentPosition.lat, 2) +
          Math.pow(marker.lng - currentPosition.lng, 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMarker = marker;
      }
    });
    console.log(closestMarker);
    return closestMarker;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error current position:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (currentPosition.lat !== 0 && currentPosition.lng !== 0) {
      const closest = findClosestMarker();
      if (closestMarker) {
        updateAddress(closestMarker);
        setClosestMarker(closest);
      }
    }
  }, [currentPosition]);

  return isLoaded ? (
    <div style={{ width: "100%", height: "100%" }}>
      <input
        id="search-box"
        type="text"
        placeholder="Search for a location to get the closest parking spaces"
        style={{
          boxSizing: "border-box",
          border: "1px solid transparent",
          width: "100%",
          height: "32px",
          padding: "8px",
          margin: "8px 0",
          borderRadius: "3px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          outline: "none",
          textOverflow: "ellipsis",
        }}
      />
      <div style={{ flex: 1, marginBottom: 16 }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={closestMarker}
          zoom={10}
          onLoad={onMapLoad}
          options={{ styles: darkMapStyle }}
        >
          {markers?.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              clickable={true}
              onClick={() => updateAddress(marker)}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <div>Loading Google Maps...</div>
  );
};

export default Renter;
