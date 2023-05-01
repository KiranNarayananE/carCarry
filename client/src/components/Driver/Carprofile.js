import React, { useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import axiosInstance from "../../api/axios";

const CarProfile = () => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    vehicleNo: "",
    place: "",
    kilometer: "",
    model:"",
    picturePath: "",
  });

  const handleImg = (event) => {
    const image = event.target.files[0];
    const previewUrl = URL.createObjectURL(image);
    setPreview(previewUrl);
    setFormData({ ...formData, picturePath: image });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      formData.vehicleNo === "" ||
      formData.place === "" ||
      formData.kilometer === "" ||
      formData.model === "" ||
      formData.picturePath === "" 
    ) {
      setError("All fields are required.");
      return false;
    }


    const form = new FormData();
    form.append("image", formData.picturePath);
    form.append("vehicleNo", formData.vehicleNo);
    form.append("place", formData.place);
    form.append("kilometer", formData.kilometer);
    form.append("model", formData.model);

 const DriverSignup = async (Data) => {
  try {
    const response = await axiosInstance.post(`/driver/car`, Data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = response.data.success;
    if (data) return data;
  } catch (error) {
    return error.response.data.error;
  }
};

    const response = await DriverSignup(form);
    if (response === 11000) {
      setError("User already exist !");
    } else if (response === true) {
      navigate("/driver/approve");
    } else {
      navigate("/driver/error");
    }
  };
  
  useEffect(() => {
    // fetchDetails();
  }, []);

  return (
    <>
     <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-900">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-extrabold text-lg text-real-orange ">
              Car Details
            </p>
            <p className="text-xs text-white  tif (response === 200)racking-wide font-sans">
              Submit an application with their Car information, driving
              history, and vehicle information
            </p>
            <p className="text-xs text-white tracking-wide font-sans">
              The vehicle must pass a vehicle inspection to ensure it meets the
              company's safety standards
            </p>
            <p className="text-xs text-white tracking-wide font-sans">
              The vehicle and driver must continue to meet the company's
              standards, and the driver must regularly update their information
              to maintain their eligibility to drive for the service.
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full sm:col-span-3">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                <span className="label-text text-white">Vehicle No</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleInputChange}
                  className="input input-bordered input-accent w-full max-w-xs text-black"
                />
              </div>
            </div>
            <div className="col-span-full sm:col-span-3">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                <span className="label-text text-white">Vehicle Model</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  name="vehicleNo"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="input input-bordered input-accent w-full max-w-xs text-black"
                />
              </div>
            </div>
            <div className="col-span-full sm:col-span-3">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                <span className="label-text text-white">Vehicle Registration Place</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  name="vehicleModel"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="input input-bordered input-accent w-full max-w-xs text-black"
                />
              </div>
            </div>
          
            <div className="col-span-full sm:col-span-3">
            <div className="form-control w-full  max-w-xs">
              <label className="label">
              <span className="label-text text-white">Total Kilometer Run</span>
              </label>
              <input
                type="text"
                placeholder=""
                name="price"
                value={formData.kilometer}
                onChange={handleInputChange}
                className="input input-bordered input-accent w-full max-w-xs text-black"
              />
            </div>
            </div>
            <div className="col-span-full">
              <label for="bio" className="text-sm text-white">
                Photo
              </label>
              <div className="flex  items-center space-x-2">
                <div className="form-control w-full max-w-xs">
                  <input
                    type="file"
                    name="image"
                    onChange={handleImg}
                    className="file-input file-input-bordered w-full max-w-xs"
                  />
                </div>
                {preview && (
                  <img src={preview} alt="" width="100px" height="100px" />
                )}
              </div>
            </div>
          </div>
          <div className="md:mx-96 md:mt-5 ">
            <button
              className="btn btn-active px-20 md:px-auto  place-items-center "
              type="submit">
              Submit
            </button>
          </div>
        </fieldset>
      
      </>
);
};

export default CarProfile;