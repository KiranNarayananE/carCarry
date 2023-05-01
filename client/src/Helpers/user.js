import axiosInstance from "../api/axios";
const getDriver = async (id) => {
    try {
      const response = await axiosInstance.get("/driver-details", { params: { id: id } });
      return response;
    } catch (error) {
      return error.response;
    }
  };

// * Date picker *//
export const options = {
  title: "Select Date",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  maxDate: new Date("2023-04-31"),
  minDate: new Date("2023-02-01"),
  theme: {
    background: "bg-white ",
    // todayBtn: "bg-green-500",
    // clearBtn: "",
    // icons: "",
    // text: "",
    // input: "",
    // inputIcon: "",
    selected: "bg-red-500",
  },
  icons: {
    // () => ReactNode | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-25 ",
  language: "en",
};



export const handleBookTrip = async (details) => {
  const response = await getDriver(details);
  return response;
};
