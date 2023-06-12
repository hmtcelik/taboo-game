import { useState } from "react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';

function CreateRoom() {
  const navigate = useNavigate();

  useEffect(()=>{
    let username = sessionStorage.getItem('username')
    if (username === null){
      navigate('/setNickName/?nexturl=/create/')
    }
  },[])

  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createColor, setCreateColor] = useState<string>("bg-blue-500")

  const [capacity, setCapacity] = useState<number>(6)

  return (
    <div className="bg-indigo-300 h-screen grid grid-cols-1 justify-items-center content-start">
      <div className="w-full max-w-md mx-auto p-6 mt-24">
        <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
          <Link to={'/'} className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:underline " >
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Geri Dön
          </Link>
            <div className="mt-4 text-center">
              <h1 className="block text-2xl font-bold text-gray-800 ">
                Oda Oluştur
              </h1>
              <p className="mt-2 text-sm text-gray-600 ">
                Oda oluşturmak için gerekli bilgileri gir
              </p>
            </div>
            <div >
              <hr className="my-7" />
                <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">
                    Oda Kapasitesi
                  </label>
                  <div className="relative">
                    <select className="py-3 px-4 pr-9 block w-full bg-white border-gray-300 border-2 rounded-lg text-sm hover:cursor-pointer"
                      defaultValue={6} onChange={(e)=>setCapacity(Number(e.target.value))}
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                    </select>
                  </div>
                </div>
                {/* <div className="mt-2">
                  <label htmlFor="email" className="block text-sm mb-2">
                    Şifre Koy
                  </label>
                    <input onClick={()=> {setIsPass(!isPass);setPassword('')}} type="checkbox" id="hs-basic-usage" className={`
                    relative w-[3.25rem] h-7 bg-gray-300 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent focus:border-blue-600 focus:ring-blue-600 ring-offset-white focus:outline-none appearance-none 
                    before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200`} /> 
                    {isPass &&
                    <input type="text" 
                    className="mt-2 py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Şifre Giriniz" 
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    }
                </div> */}
                <Link
                to={`/room/${uuidv4()}/${capacity}`}
                className= {`mt-1 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                 font-semibold ${createColor} text-white hover:bg-blue-600 transition-all text-sm `}
                onClick={()=>{setIsCreating(true);setCreateColor('bg-blue-600');}}
              >
                <button
                    type="button"
                    >
                    {isCreating &&
                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                    </span>
                    }
                    Oluştur
                  </button>
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRoom

