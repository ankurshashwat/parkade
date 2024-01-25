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

const Owner = ({ updateAddress }) => {
  const [markers, setMarkers] = useState([]);
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
      return;
    }

    const newMarker = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

    if (mapRef.current) {
      mapRef.current.panTo(newMarker);
      mapRef.current.setZoom(12);
    }
  };

  const onMapClick = (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  useEffect(() => {
    if (markers.length > 0) {
      updateAddress(markers[markers.length - 1]);
    }
  }, [markers]);

  return isLoaded ? (
    <div style={{ width: "100%", height: "100%" }}>
      <input
        id="search-box"
        type="text"
        placeholder="Search for a location"
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
          color: "black",
          outline: "none",
          textOverflow: "ellipsis",
        }}
      />
      <div style={{ flex: 1, marginBottom: 16 }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            markers.length > 0
              ? markers[markers.length - 1]
              : { lat: 25.3176, lng: 82.9739 }
          }
          zoom={10}
          onLoad={onMapLoad}
          onClick={onMapClick}
          options={{ styles: darkMapStyle }}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <div>Loading Google Maps...</div>
  );
};

export default Owner;
