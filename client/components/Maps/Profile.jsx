import { GoogleMap, Marker } from "@react-google-maps/api";
import { darkMapStyle } from "@utils/constants";

const Profile = ({ data }) => {
  console.log(data);

  const containerStyle = {
    width: "150px",
    height: "150px",
  };

  const center = {
    lat: data.lat,
    lng: data.lng,
  };

  return (
    data && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{ styles: darkMapStyle }}
        >
          <Marker position={center} />
        </GoogleMap>
    )
  );
};

export default Profile;
