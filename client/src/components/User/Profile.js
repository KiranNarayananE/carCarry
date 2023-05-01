import React, { useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import axiosInstance from "../../api/axios";

const Profile = () => {
  const token = useSelector((state) => state.userLogin.token);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    pending: "",
    confirmed: "",
  });

  useEffect(() => {
    fetchDetails();
  }, []);
  const fetchUserDetails = async (token) => {
    try {
      const response = await axiosInstance.get("/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  
   const updateUserProfile = async (image, token) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
  
      const response = await axiosInstance.post("/profile", formData, {
        headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const fetchDetails = async () => {
    const response = await fetchUserDetails(token);

    if (response.status === 201) {
      setUser({
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone,
      });
    }

    if (response.status === 200) {
      setUser({
        image: response.data.user.profile,
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone,
        pending: response.data.pending,
        confirmed: response.data.conform,
      });
    }

    if (response.status === 500) return navigate("/error");
  };

  const uploadImage = async (event) => {
    const image = event.target.files[0];
    const response = await updateUserProfile(image, token);
    if (response.status === 200) return setUser({ ...user,image: response.data.userProfile });
    if (response.status === 500) return navigate("/error");
  };

  return (
    <>
      <div class=" font-sans mt-36 w-8/12 flex justify-start items-start text-black">
        <div class=" w-full ">
        {/* <form > */}
          <label htmlFor="profile-picture">
            <div class="relative">
              {user.image ? (
                <img className="w-32 h-32 mx-auto rounded-full  brightness-50 -mt-20" src={`/images/${user.image}`} alt="" />
              ) : (
                <img className="w-32 mx-auto rounded-full  brightness-50 -mt-20" src="https://dummyimage.com/80x80" alt="" />
              )}
              <div class="absolute inset-0 flex items-end justify-center text-white mb-2">
                <DriveFileRenameOutlineIcon />
              </div>
            </div>
            
          </label>
          <input type="file" id="profile-picture" name="profile-picture" className="hidden" onChange={uploadImage} />
          {/* </form> */}
          <div>
            <div class="text-center mt-2 text-3xl font-medium">{user.name}</div>
            <div class="text-center mt-4 font-light text-sm">{user.email}</div>
            <div class="text-center mt-1 font-normal text-lg">+91{user.phone}</div>

            <hr class="mt-8" />
            <div class="flex p-4">
              <div class="w-1/2 text-center">
                <span class="font-bold">{user.pending ? user.pending : 0}</span> Pending
              </div>
              <div class="w-0 border border-gray-300"></div>
              <div class="w-1/2 text-center">
                <span class="font-bold">{user.confirmed ? user.confirmed : 0}</span> Confirm
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="leading-10">
      <h1 className="text-2xl text-black font-semibold"> Get a ride in minutes</h1>
      <p className="text-black">Plan a trip,But book a taxi as before your plan a trip.</p>
      <Link to="/" className="btn">
        Request a Booking
      </Link>
    </div>
    </>
  );
};

export default Profile;
