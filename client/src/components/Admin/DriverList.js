import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../api/axios";

const DriverList = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.adminLogin);
 
  const getDriverList = async (token) => {
    try {
      const response = await AxiosInstance.get("/admin/driverList", {
        headers: { Authorization: `Bearer  ${token}` },
      });
      const data = response.data.driver;
      return data;
    } catch (error) {
      return error;
    }
  };
  const block= async (id,verified) => {
    try {
      const response = await AxiosInstance.patch("/admin/driver",{id:id,verified:verified}, {
        headers: { Authorization: `Bearer  ${token}` },
      });
      if(response.status==200){
       let data= list.filter((val)=>{
            if(val._id!=id){
                return val
            }
        })
        setList([...data,response.data.driver])
      }
    } catch (error) {
      return error;
    }
  };
  
  useEffect(() => {
    const user = async () => {
      try {
        await getDriverList(token).then((driver) => {
          setList(driver);
        });
      } catch (error) {
        navigate("/admin/error");
      }
    };
    user();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
<fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-regal-blue">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-extrabold text-lg text-real-orange">
              Driver Information
            </p>
            </div>
        </fieldset>
        <div className="">
        <div className="min-w-screen  bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
            <div className="w-full lg:w-5/6">
                <div className="bg-white shadow-md rounded my-6 overflow-x-scroll scrollbar-hide">
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Driver</th>
                                <th className="py-3 px-6 text-center">Contact</th>
                                <th className="py-3 px-6 text-center">Rides</th>
                                <th className="py-3 px-6 text-center">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {list?.map((driver,index)=>
                            <tr className="border-b border-gray-200 hover:bg-gray-100">
                                
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <div className="mr-2">
                                            <img className="w-6 h-6 rounded-full" src="/images/1.jpg"/>
                                        </div>
                                        <span>{driver.firstName}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center whitespace-nowrap">
                                    <div className=" text-center">
                                     
                                        <span className="font-medium ">{driver.phone}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center">
                                        0
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                {driver.verified?
                                    <span  className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Active</span>:
                                    <span  className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Blocked</span>

                                }
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                       
                                        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" onClick={()=>block(driver._id,driver.verified)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                        
                                    </div>
                                </td>
                            </tr>
                            )
                        }
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</>
  );
};

export default DriverList;
