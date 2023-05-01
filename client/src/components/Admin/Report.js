import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReportDetails from "./ReportDetails";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AxiosInstance from "../../api/axios";

const UpcomingTrips = () => {
  const token = useSelector((state) => state.adminLogin.token);
  const [report, setReport] = useState([]);
  const [reportShow, setReportShow] = useState([])
  const [error, setError] = useState();

  const fetchBookingHistory = async (token) => {
    try {
      const response = await AxiosInstance.get("/admin/report", { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const fetchHistory = async () => {
    const response = await fetchBookingHistory(token);
    if (response.status === 200) return setReport(response.data.saleReport);
    if (response.status === 500) return setError("Try again after some time");
  };

  useEffect(() => {
    fetchHistory();

  }, []);


  return (
    <>
      <section class="text-white body-font">
        <div class="container px-5 py-10 mx-auto">
          <div class="flex flex-col text-start w-full mb-20">
            {error && (
              <div className="flex justify-center ">
                <div className="alert alert-error shadow-lg w-80">
                  <div>
                    <ErrorOutlineIcon className="stroke-current flex-shrink-0 h-6 w-6" />
                    <span>{error}</span>
                  </div>
                </div>
              </div>
            )}

<fieldset className="grid grid-cols-4 gap-6 p-6 pt-0 rounded-md shadow-sm bg-regal-blue">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-extrabold text-lg text-real-orange">
              REPORT
            </p>
            </div>
        </fieldset>
            <div className="h-1 w-44 bg-indigo-500 rounded"></div>
          </div>
          {report.length !== 0 ? (
              
    <div className="">
        <div className="min-w-screen  bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
            <div className="w-full lg:w-5/6">
                <div className="bg-white shadow-md rounded my-6 overflow-x-scroll scrollbar-hide">
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-center">Date</th>
                                <th className="py-3 px-6 text-center">Total amount</th>
                                <th className="py-3 px-6 text-center">Profit</th>
                                <th className="py-3 px-6 text-center">No of rides</th>
                                
                            </tr>
                        </thead>
              {report.map((report, _id) => (
                <ReportDetails key={_id} trip={report} />
              ))}
              </table>
                </div>
            </div>
        </div>
    </div>
  
          ) : (
            <div class="flex flex-wrap -m-4 justify-center md:justify-start">
              <h1>No avaible bookings</h1>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default UpcomingTrips;
