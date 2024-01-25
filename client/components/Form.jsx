import Link from "next/link";
import Owner from "./Maps/Owner";
import Renter from "./Maps/Renter";

const Form = ({
  type,
  handleSubmit,
  handleChange,
  post,
  submit,
  updateAddress,
  markers,
}) => {
  const Config = {
    owner: {
      title: "Owners Form",
      map: <Owner updateAddress={updateAddress} />,
      fields: [
        {
          name: "hourlyRate",
          label: "Hourly Rate",
          type: "number",
          placeholder: "Enter hourly rate",
        },
        {
          name: "wallet",
          label: "Wallet Address",
          type: "text",
          placeholder: "Enter wallet address",
        },
        {
          name: "reservations",
          label: "Reservations",
          type: "textarea",
          placeholder: "Enter existing reservations",
        },
      ],
    },
    renter: {
      title: "Renters Form",
      map: <Renter updateAddress={updateAddress} markers={markers} />,
      fields: [
        {
          name: "lat",
          label: "Latitude",
          type: "text",
          placeholder: "select a marker on the map",
        },
        {
          name: "lng",
          label: "Longitude",
          type: "text",

          placeholder: "select a marker on the map",
        },
        {
          name: "startTime",
          label: "Start Time",
          type: "datetime-local",
          placeholder: "Enter start time",
        },
        {
          name: "endTime",
          label: "End Time",
          type: "datetime-local",
          placeholder: "Enter end time",
        },
      ],
    },
  };

  const { title, map, fields } = Config[type];

  return (
    <section className="w-full max-w-full flex-start flex-col mb-8">
      <h1 className="head_text text-left">
        <span className="orange_gradient">{title}</span>
      </h1>
      <p className="desc text-left max-w-md">Fill in the form details below.</p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label className="flex flex-col">
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Select Your Parking Space Location
          </span>
          {map}
        </label>

        {fields.map((field) => (
          <label key={field.name} className="flex flex-col">
            <span className="font-satoshi font-semibold text-base text-gray-700">
              {field.label}
            </span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={post[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="form_textarea"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={post[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="form_input"
              />
            )}
          </label>
        ))}

        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm underline">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submit}
            className="px-5 py-2 text-sm bg-primary-orange rounded-full text-white"
          >
            {submit ? (type === "owner" ? "Listing..." : "Renting...") : type === "owner" ? "List" : "Rent"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;