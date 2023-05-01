import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import AxiosInstance from "../../api/axios";
import BarChart from "./BarGraph"
import moment from "moment";
import Doughnut from "./DoughNutGraph";
 

const Report = () => {
    const [data, setData] = useState()
    const [pieData, setPieData] = useState();
    const [error, setError] = useState();
    const token = useSelector((state) => state.driverLogin.token);
    let count
    let earning
    if(pieData){
        
        count= pieData.reduce((acc,curr)=>{
            if(curr._id=="Driver_Canceled"){
             acc.cancelled=curr.count
            }
            else if(curr._id=="Completed"){
                acc.completed=curr.count
               }
               return acc
        },{cancelled:0,completed:0})
    }
    if(data){
        
        earning= data.reduce((acc,curr)=>acc+=curr.totalPrice,0)
    }
    
    
    
  
    const fetchGraphData = async (token) => {
        try {
          const response = await AxiosInstance.get(`/driver/salesProject`, { headers: { Authorization: `Bearer ${token}` } },{
            params: {
              from: "2020-01-11",
              to:moment(new Date()).format('YYYY-MM-DD'),
              filter:"%m"
            }});
          return response;
        } catch (error) {
          return error.response;
        }
      };
    const fetchData = async () => {
        const response = await fetchGraphData(token);
        if (response.status === 200) return setData(response.data.saleReport);
        if (response.status === 500) return setError("Try again after some time");
      };
      const fetchGraphPie = async (token) => {
        try {
          const response = await AxiosInstance.get(`/driver/graph`, { headers: { Authorization: `Bearer ${token}` } },{
            params: {
              from: "2020-01-11",
              to:moment(new Date()).format('YYYY-MM-DD'),
              filter:"%m"
            }});
          return response;
        } catch (error) {
          return error.response;
        }
      };
    const fetchpie = async () => {
        const response = await fetchGraphPie(token);
        if (response.status === 200) return setPieData(response.data.saleReport);
        if (response.status === 500) return setError("Try again after some time");
      };
    useEffect(() => {
        fetchData();
        fetchpie();
    
      }, []);
    

    return (
        <>
         <div class="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">

<div class="grid grid-cols-12 gap-6">
    <div class="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
        <div class="col-span-12 mt-8">
            <div class="flex items-center h-10 intro-y">
                <h2 class="mr-5 text-lg font-medium truncate">Dashboard</h2>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-5">
                <a class="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                    href="#">
                    <div class="p-5">
                        <div class="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <div
                                class="bg-green-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                <span class="flex items-center">30%</span>
                            </div>
                        </div>
                        <div class="ml-2 w-full flex-1">
                            <div>
                                <div class="mt-3 text-3xl font-bold leading-8">Rs {earning*.9??0}</div>

                                <div class="mt-1 text-base text-gray-600">Total Earnings</div>
                            </div>
                        </div>
                    </div>
                </a>
                <a class="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                    href="#">
                    <div class="p-5">
                        <div class="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-400"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <div
                                class="bg-red-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                <span class="flex items-center">30%</span>
                            </div>
                        </div>
                        <div class="ml-2 w-full flex-1">
                            <div>
                                <div class="mt-3 text-3xl font-bold leading-8">Rs {earning*.27??0}</div>

                                <div class="mt-1 text-base text-gray-600">Total profit</div>
                            </div>
                        </div>
                    </div>
                </a>
                <a class="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                    href="#">
                    <div class="p-5">
                        <div class="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-pink-600"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            <div
                                class="bg-yellow-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                <span class="flex items-center">30%</span>
                            </div>
                        </div>
                        <div class="ml-2 w-full flex-1">
                            <div>
                                <div class="mt-3 text-3xl font-bold leading-8">{count?.completed}</div>

                                <div class="mt-1 text-base text-gray-600">Completed Rides</div>
                            </div>
                        </div>
                    </div>
                </a>
                <a class="transform  hover:scale-105 transition duration-300 shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 intro-y bg-white"
                    href="#">
                    <div class="p-5">
                        <div class="flex justify-between">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-400"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <div
                                class="bg-blue-500 rounded-full h-6 px-2 flex justify-items-center text-white font-semibold text-sm">
                                <span class="flex items-center">30%</span>
                            </div>
                        </div>
                        <div class="ml-2 w-full flex-1">
                            <div>
                                <div class="mt-3 text-3xl font-bold leading-8">{count?.cancelled}</div>

                                <div class="mt-1 text-base text-gray-600">Cancelled RIdes</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        </div>
        </div>
        </div>
        <div class="col-span-12 mt-5">
                                <div class="grid gap-2 grid-cols-1 lg:grid-cols-2">
                                    <div class="bg-white shadow-lg " id="chartline">{data&&<BarChart saleReport={data}/>}</div>
                                    <div class="bg-white shadow-lg flex  pl-20" id="chartpie" style={{ height: '300px'}}>{pieData&&<Doughnut saleReport={pieData}/>}</div>
                                </div>
                            </div>
            </>
    )
}
export default Report