import { useState } from "react"
import { Link } from "react-router-dom"
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Base() {

  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();

  useEffect(()=>{
    let username = sessionStorage.getItem('username')
    if (username === null){
      navigate('/setNickName/?nexturl=/')
    }
    if (searchParams.get("msg") === "AdminLeft"){
      setIsError(true)
      setErrorMsg("Admin Lobiden Ayrıldı !")
    } else if (searchParams.get("msg") === "AlreadyStart"){
      setIsError(true)
      setErrorMsg("Oyun Çoktan Başlamış !")
    } else if (searchParams.get("msg") === "RoomIsFull"){
      setIsError(true)
      setErrorMsg("Odada Yer Yok !")
    }
  },[])

  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createColor, setCreateColor] = useState<string>("bg-blue-500")

  const [isError, setIsError] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>("")

  
  return (
    <>
    <div className="bg-indigo-300 h-screen grid grid-cols-1 justify-items-center content-start">
      <div className="w-full max-w-md mx-auto p-6 mt-24">
        {isError &&
          <div className="bg-red-50 border hover:cursor-pointer border-red-200 rounded-md p-4" role="alert"
          onClick={()=>{setIsError(false)}} 
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                className="hover:cursor-pointer h-4 w-4 text-red-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-red-800 font-semibold">
                  {errorMsg}
                </h3>
              </div>
            </div>
          </div>
          }
        <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 ">
                Tabu
              </h1>
              <p className="mt-2 text-sm text-gray-600 ">
                Oda oluştur veya odaya katıl
              </p>
            </div>
            <div >
              <hr className="my-7" />
                <div className="grid gap-y-4">
                <Link to={'create/'}  className= {`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                      font-semibold ${createColor} text-white hover:bg-blue-600 transition-all text-sm `}
                      onClick={()=>{setIsCreating(true);setCreateColor('bg-blue-600');}}
                      >
                  <button                      
                    >
                      {isCreating &&
                      <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                      </span>
                      }
                      {!isCreating&&
                      <p>Oda Oluştur</p>
                      }
                    </button>
                  </Link>
                  {/* <Link to={'join/'}  className= {`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                      font-semibold ${joinColor} text-white hover:bg-blue-600 transition-all text-sm `}
                      onClick={()=>{setIsJoining(true);setJoinColor('bg-blue-600');}}
                      >
                  <button                      
                    >
                      {isJoining &&
                      <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                      </span>
                      }
                      {!isJoining&&
                      <p>Odaya Katıl</p>
                      }
                    </button>
                  </Link> */}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </> 
  )
}

export default Base
