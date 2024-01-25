import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Profile from './Maps/Profile';

const Card = ({ data, type }) => {
  const [location, setLocation] = useState('');
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchLocation = async (address) => {
      if (address?.lng) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${address.lat},${address.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const result = await response.json();
          setLocation(result.plus_code.compound_code);
        } catch (error) {
          console.error('location:', error);
        }
      }
    };

    fetchLocation(
      type === 'Parkings' ? data.address : data.parking?.address
    );
  }, [data, type]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/parkings/getParkingId/${data._id}`);
        const res = await response.json();
        console.log(res);
        const revenue =
          res?.reservations
            ?.filter((reservation) => reservation.amount)
            ?.reduce((total, reservation) => total + reservation.amount, 0) ||
          0;
        setFields(
          type === 'Parkings'
            ? [{ label: 'Revenue Generated:', value: `${revenue} wei` }]
            : [
                {
                  label: 'End Time:',
                  value: format(new Date(data.endTime), 'dd MMM yy HH:mm'),
                },
              ]
        );
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [data, type]);

  return (
    <div className="card">
      <div className="flex flex-row items-center justify-around space-x-4">
        <div>
          <Profile
            key={data._id}
            data={
              type === 'Parkings' ? data.address : data.parking?.address
            }
            user={type === 'Parkings' ? null : 'owner'}
          />
        </div>
        <div className="flex flex-col space-y-2 w-[300px]">
          <span className="font-semibold text-sm">
            {type === 'Parkings' ? 'Location:' : 'Start Time:'}
          </span>
          <span className="text-sm">
            {type === 'Parkings'
              ? location
              : format(new Date(data.startTime), 'dd MMM yy HH:mm')}
          </span>
          {fields.map((item, index) => (
            <React.Fragment key={index}>
              <span className="font-semibold text-sm">{item.label}</span>
              <span className="text-sm">{item.value}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
