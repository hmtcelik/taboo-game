import axios from "axios";
import { useState } from "react"

function AddWord() {
  const [error, setError] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const [isSuccess, setIsSuccess] = useState<boolean>(true)
  const [isSend, setIsSend] = useState<boolean>(false)

  const [word, setWord] = useState<string>("")
  const [taboo1, setTaboo1] = useState<string>("")
  const [taboo2, setTaboo2] = useState<string>("")
  const [taboo3, setTaboo3] = useState<string>("")
  const [taboo4, setTaboo4] = useState<string>("")
  const [taboo5, setTaboo5] = useState<string>("")

  const submitWord = (e:any) =>{
    e.preventDefault();

    if ((word.trim()!== "")&&(taboo1.trim()!== "")&&(taboo2.trim()!== "")&&(taboo3.trim()!== "")&&(taboo4.trim()!== "")&&(taboo5.trim()!== "")){
      setIsSuccess(false)
      setError(false)
      setIsSend(true)
      axios.post('https://tabooserver.onrender.com/_/word/', {
        word: word,
        taboos: [taboo1,taboo2,taboo3,taboo4,taboo5]
      })
      .then(function (response) {
        console.log(response);
        setIsSuccess(true)
      })
      .catch(function (error) {
        console.log(error);
        setIsSuccess(false)
        setError(true)
        setErrorMsg(error.response.data.message)
      });   
    } else {
      setIsSuccess(false)
      setError(true)
      setErrorMsg("Hepsini Doldur!")
    }

  }

  return (
    <div className="bg-indigo-300 h-screen grid grid-cols-1 justify-items-start content-start">
      <div className="w-full max-w-md mx-auto p-6 mt-24">
        <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 ">
                Oyuna Kelime Ekleme
              </h1>
            </div>
            <form onSubmit={submitWord}>
              <hr className="mt-2" />
                <div className="grid gap-y-4">
                <div >
                <label className="block mt-4 text-sm font-medium mb-2 ">Kelime</label>
                    <input type="text" className="py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setWord(e.target.value)}
                    />
                    <label className="block mt-4 text-sm font-medium mb-2 ">Tabu 1</label>
                    <input type="text" className="py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setTaboo1(e.target.value)}
                    />
                    <label className="block mt-4 text-sm font-medium mb-2 ">Tabu 2</label>
                    <input type="text" className="py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setTaboo2(e.target.value)}
                    />
                    <label className="block mt-4 text-sm font-medium mb-2 ">Tabu 3</label>
                    <input type="text" className="py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setTaboo3(e.target.value)}
                    />
                    <label className="block mt-4 text-sm font-medium mb-2 ">Tabu 4</label>
                    <input type="text" className="py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setTaboo4(e.target.value)}
                    />
                    <label className="block mt-4 text-sm font-medium mb-2 ">Tabu 5</label>
                    <input type="text" className="py-3 px-5 block w-full border-gray-300 border-2 rounded-lg text-sm" placeholder="Bişeyler Gir" 
                      onChange={(e) => setTaboo5(e.target.value)}
                    />
                    {error &&
                      <p className="mt-2 text-md text-red-600 ">
                        {errorMsg}
                      </p>
                    }
                    {isSuccess && isSend &&
                      <p className="mt-2 text-md text-green-700 ">
                        Başarıyla Eklendi !
                      </p>
                    }
                </div>
                <button
                    type="submit"
                    className= {`mt-1 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                     font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-sm `}
                  >
                    Ekle
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddWord

