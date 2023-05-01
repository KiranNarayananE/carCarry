import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../api/axios";


const DriverList = () => {
  const [list, setList] = useState([]);
  const [listShow, setListShow] = useState([]);
  const [SearchInput, setSearchInput] = useState("")
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
        let data= list.map((val)=>{
        
          let dataList= {...val}
  
              if(dataList._id==id){
                dataList.verified=!verified
              }
              return dataList
          })
          setList(data)
          setListShow(data)
      }
    } catch (error) {
      return error;
    }
  };
  const handleChange =(event) => {
    setSearchInput(event.target.value)
   
  if(event.target.value){
   let updateUse= list.filter((item)=>item.firstName.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1  )
   if(!updateUse[0]){
    updateUse= list.filter((item)=>item.phone.toString().toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1  )
   }
   setListShow(updateUse)
  }else{
    setListShow(list)
   }

}
  
  useEffect(() => {
    const user = async () => {
      try {
        await getDriverList(token).then((driver) => {
          setList(driver);
          setListShow(driver)
        });
      } catch (error) {
        navigate("/admin/error");
      }
    };
    user();
  }, []);

  return (
    <>
<fieldset className="flex justify-between items-center rounded-md shadow-sm bg-regal-blue h-20">
          <div className="space-y-2 col-span-full lg:col-span-1 flex items-center justify-start ml-4">
            <p className="font-extrabold text-lg text-real-orange">
              Driver Information
            </p>
            </div>
            <div class=" relative  text-gray-600 items-center justify-end mr-4">
        <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none ml-20"
          type="search" name="search" placeholder="Search" value={SearchInput} onChange={handleChange}/>
        <button type="submit" class="absolute right-0 top-0 mt-5 mr-4">
          <svg class="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
             version="1.1" id="Capa_1" x="0px" y="0px"
            viewBox="0 0 56.966 56.966" style={{width:"10px" ,height:"10px"}}
            >
            <path
              d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
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
                            {listShow.map((driver,index)=>
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
