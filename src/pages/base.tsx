import { useState } from "react"
import { Link } from "react-router-dom"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Base() {

  const navigate = useNavigate();

  useEffect(()=>{
    let username = sessionStorage.getItem('username')
    if (username === null){
      navigate('/setNickName/?nexturl=/')
    }
  },[])

  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createColor, setCreateColor] = useState<string>("bg-blue-500")

  const [isJoining, setIsJoining] = useState<boolean>(false)
  const [joinColor, setJoinColor] = useState<string>("bg-blue-500")

  return (
    <div className="bg-indigo-300 h-screen grid grid-cols-1 justify-items-center content-start">
      <div className="w-full max-w-md mx-auto p-6 mt-24">
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
  )
}

export default Base
