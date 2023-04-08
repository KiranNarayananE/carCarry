import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../api/axios";
 
const set_location = async (location, status, token) => {
  try {
    const response = await AxiosInstance.patch(
      "/driver/set-location",
      { location, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
}
const initialState = {
  user: null,
  name: null,
  token: null,
  approve:null,
  location: null,
  coordinates: [],
  active: false,
  driving: false,
};


export const DriverLoginSlice = createSlice({
  name: "driverLogin",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.name = action.payload.name;
      state.token = action.payload.token
      state.approve = action.payload.approve;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.name = null;
      state.token = null;
      state.location = null;
      state.coordinates = [];
      state.active = false;
      state.driving = false;
    },
    setLocation: (state, action) => {
      state.location = action.payload.location;
      state.coordinates = [action.payload.coordinates];
      state.active = action.payload.active;
      state.driving = action.payload.driving;
    },
    setActive: (state, action) => {
      state.active = true;
      state.driving = false;
    },
    setInactive: (state, action) => {
      state.location = null;
      state.coordinates = [];
      state.active = false;
    },
    setLocationData: (state, action) => {
      set_location(state.coordinates, state.active, state.token);
    },

    setStartDrive: (state, action) => {
      state.driving = action.payload.driving;
    },
  },
});

export const { setLogin, setLogout, setActive, setLocation,setInactive, setLocationData, setStartDrive } = DriverLoginSlice.actions;

export default DriverLoginSlice.reducer;
