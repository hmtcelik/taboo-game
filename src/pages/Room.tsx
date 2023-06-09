import { useState } from "react"
import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';

export interface DataType {
  clients: {
    id: string
    username: string
    team: number
    score: number 
  }[]
  is_started: boolean
  is_ended: boolean
}

function Room() {
  const [clientID, setClientID] = useState<string|null>(null)
  const [username, setUsername]= useState<string|null>(sessionStorage.getItem('username'))
  const navigate = useNavigate();
  const { id, capacity } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [data, setData] = useState<DataType>(
    {
      "clients": [],
      "is_started": false,
      "is_ended": false
    }
  )

  useEffect(()=>{
    if (username === null){
      navigate(`/setNickName/?nexturl=/room/${id}/${capacity}`)
    }    
  },[])

  const { sendJsonMessage, lastMessage, lastJsonMessage } = useWebSocket(`ws://localhost:8000/ws/${id}/${clientID}`);  
  
  useEffect(()=>{
    let client_id = uuidv4()
    setClientID(client_id)

    sendJsonMessage(JSON.parse(JSON.stringify({"action":"get_data"})))
    sendJsonMessage(JSON.parse(JSON.stringify({"action":"connect", "client_id":client_id, "username":username})))
  },[])

  useEffect(()=>{
    if (lastJsonMessage || null !== null){
      setIsLoading(false)
    }

    setData((JSON.parse(lastMessage?.data || JSON.stringify(data) )))

  },[lastJsonMessage])

  console.log(typeof(data))
  console.log(lastJsonMessage);
  console.log(data);
  

  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createColor, setCreateColor] = useState<string>("bg-green-600")
  

  return (
    <div className="bg-indigo-300 h-screen grid grid-cols-1 justify-items-center content-start">
      {isLoading && 
      <div
        className="mt-12 animate-spin inline-block w-12 h-12 border-[4px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
        >
        <span className="sr-only">Loading...</span>
      </div>
      }
      {!isLoading  && 
      <div className="w-full max-w-6xl mx-auto p-6 mt-24">
        <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="mt-4 text-center">
              <h1 className="block text-2xl font-bold text-gray-800 ">
                Takımları Dağıt
              </h1>
            </div>
            <div >
              <hr className="my-7" />
                <div className="grid gap-y-4">
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow overflow-hidden dark:border-gray-700 dark:shadow-gray-900">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.clients?.map((cl)=>(
                                  <tr key={cl.id} >
                                  <td className="px-6 py-4 whitespace-nowrap text-md font-semibold	 text-gray-800 dark:text-gray-200">
                                      {cl.username}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <p className="text-red-500 hover:cursor-pointer hover:text-red-700">
                                      Kırmızı Takım
                                      </p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <p className="text-blue-500 hover:cursor-pointer hover:text-blue-700">
                                      Mavi Takım
                                      </p>
                                  </td>
                                  </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>


                <button
                    type="button"
                    className= {`mt-2 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                     font-semibold ${createColor} text-white hover:bg-green-700 transition-all text-sm `}
                    onClick={()=>{setIsCreating(true);setCreateColor('bg-green-700');}}
                  >
                    {isCreating &&
                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                    </span>
                    }
                    Oyunu Başlat
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Room

