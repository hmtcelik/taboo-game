import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


function NickName() {
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [createColor, setCreateColor] = useState<string>("bg-blue-500")
  
  const [error, setError] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [username, setUsername] = useState<string>('')
  
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const submitUsername = (e:any) =>{
    e.preventDefault();
    setIsCreating(true);setCreateColor('bg-blue-600');setError(false)

    if (username.trim() === ''){
      setIsCreating(false);setCreateColor('bg-blue-500');setError(true)
      setErrorMsg("Boş Bırakılamaz!")
    } else if (username.length > 12) {
      setIsCreating(false);setCreateColor('bg-blue-500');setError(true)
      setErrorMsg("En Fazla 12 Karakterden Oluşabilir!")
    } else {
      sessionStorage.setItem('username', username)
      sessionStorage.setItem('client_id', uuidv4())
      navigate((searchParams.get("nexturl") !== null) ? '' + searchParams.get("nexturl")! : '/' )
    }
  }

  return (
    <div className="bg-indigo-300 h-screen grid grid-cols-1 justify-items-center content-start">
      <div className="w-full max-w-md mx-auto p-6 mt-24">
        <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 ">
                Kullanıcı Adın
              </h1>
              <p className="mt-2 text-sm text-gray-600 ">
                Oyunda kullanılacak olan kullanıcını adını gir.
              </p>
            </div>
            <form onSubmit={submitUsername}>
              <hr className="my-7" />
                <div className="grid gap-y-4">
                <div >
                    <input type="text" className="mt-2 py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {error &&
                      <p className="mt-2 text-sm text-red-600 ">
                        {errorMsg}
                      </p>
                    }
                </div>
                <button
                    type="submit"
                    className= {`mt-1 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                     font-semibold ${createColor} text-white hover:bg-blue-600 transition-all text-sm `}
                  >
                    {isCreating &&
                    <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                    </span>
                    }
                    Devam Et
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NickName

