import { useState } from "react"
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import useWebSocket, {ReadyState} from 'react-use-websocket';

export interface DataType {
  clients: ClientType[]
  is_started: boolean
  is_ended: boolean
  admin_id: string
  word: {
    id: number
    word: string
    taboos: string[]
  }
  timer:number
  red_team: ClientType[]
  blue_team: ClientType[]
  playing_info: ClientType
}

interface ClientType{
  id: string
  username: string
  team: number
  score: number
  is_admin: boolean 
}

function Room() {
  const navigate = useNavigate();
  const { id, capacity } = useParams();
  
  const [clientID] = useState<string|null>(sessionStorage.getItem('client_id'))
  const [username]= useState<string|null>(sessionStorage.getItem('username'))
  
  const [isValid, setIsValid]= useState<boolean>(false)
  const [isValidErrorShown, setIsValidErrorShown]= useState<boolean>(false)
  const [disableStyles, setDisableStyles]= useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const [isCreating] = useState<boolean>(false)
  const [createColor, setCreateColor] = useState<string>("bg-gray-300")
  
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [thisUserTeam, setThisUserTeam] = useState<number>(0)
  
  const [isTurnEnd, setIsTurnEnd] = useState<boolean>(false)
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false)
  const [winnerTeam, setWinnerTeam] = useState<number>(0)
  const [isAnyAdmin, setIsAnyAdmin] = useState<boolean>(true)

  const [redScore, setRedScore] = useState<number>(0)
  const [blueScorer, setBlueScore] = useState<number>(0)

  const [counter, setCounter] = useState<number>(0)
  const [passed, setPassed] = useState<number>(0)
  const [noPassStyle, setNoPassStyle] = useState<string>("bg-blue-600 hover:bg-blue-700")

  const [currentPlaying, setCurrentPlaying] = useState<ClientType>(
    {id:"0", username:"", team:0, score:0, is_admin:false}
  )

  const [data, setData] = useState<DataType>(
    {
      "clients": [],
      "is_started": false,
      "is_ended": false,
      "admin_id": "",
      "word": {
        'id': 1,
        'word': '',
        'taboos': []
      },
      "timer": 60,
      "red_team": [],
      "blue_team": [],
      "playing_info": {
        id:"0", is_admin:false, score:0, team:0, username:""
      },
    }
  )

  useEffect(()=>{
    if (username === null){
      navigate(`/setNickName/?nexturl=/room/${id}/${capacity}`)
    }    
  },[])

  const { sendJsonMessage, lastMessage, lastJsonMessage, readyState } = useWebSocket(`wss://tabooserver.onrender.com/ws/${id}/${clientID}`);  
  
  useEffect(()=>{
    if (readyState === ReadyState.CLOSED){
      navigate("/?msg=AlreadyStart")
    }
  }, [readyState])

  useEffect(()=>{
    sendJsonMessage(JSON.parse(JSON.stringify({"action":"get_data"})))
    sendJsonMessage(JSON.parse(JSON.stringify({"action":"connect", "client_id":clientID, "username":username})))
  },[])

  useEffect(()=>{
    if (lastJsonMessage || null !== null){
      setIsLoading(false)
    }
    setData((JSON.parse(lastMessage?.data || JSON.stringify(data) )))
  },[lastJsonMessage])


  useEffect(()=>{
    let red_ct = 0   
    let blue_ct = 0
    let teamless_ct = 0
    let red_score = 0
    let blue_score = 0
    let is_any_admin = false
    let is_client_in = false
    for (let c of data.clients){
      if (c.team === 1){
        red_ct += 1
        red_score += c.score
      } else if (c.team === 2){
        blue_ct += 1
        blue_score += c.score
      } else if (c.team == 0){
        teamless_ct += 1
      }
      if (c.id === clientID){
        is_client_in = true
        setThisUserTeam(c.team)
      }
      if (c.id == data.admin_id){
        is_any_admin = true
      }
    }
    if ((data.is_started) && (!(is_client_in))){
      navigate("/?msg=AlreadyStart")
    }

    if ((data.clients.length>=Number(capacity)) && (!(is_client_in))){
      navigate("/?msg=RoomIsFull")
    }

    if (data.clients.length <= 0){
      is_any_admin = true
    }
    setIsAnyAdmin(is_any_admin)

    if ((red_ct!=0)&&(blue_ct!=0)&&(teamless_ct==0)){
      setIsValid(true)
    } else {
      setIsValid(false)
    }
    if (data.admin_id == clientID){
      setIsAdmin(true)
    }
    setIsGameStarted(data.is_started)

    setBlueScore(blue_score)
    setRedScore(red_score)

    setCurrentPlaying(data.playing_info)

    setCounter(data.timer)
  },[data])

  useEffect(()=>{
    if (!isAnyAdmin){
      navigate("/?msg=AdminLeft")
    }
  }, [isAnyAdmin])

  useEffect(()=>{
    if(isValid){
      setDisableStyles("")
      setCreateColor('bg-green-600 hover:bg-green-700')
    } else {
      setDisableStyles("cursor-not-allowed")
      setCreateColor('bg-gray-400')
    }
  },[isValid])

  useEffect(() => {
    if (counter <=0 && isGameStarted){
      setIsTurnEnd(true)
    } else {
      setIsTurnEnd(false)
    }

    const interval = setInterval(() => {
      if (counter > 0 && isAdmin){
        sendJsonMessage(JSON.parse(JSON.stringify({"action":"timer", "client_id":clientID})))
      }
    }, 1000); 
    return () => {
      clearInterval(interval);
    };
  }, [counter]); 

  useEffect(()=>{
    if (passed >=3){
      setNoPassStyle("bg-gray-400 cursor-not-allowed")
    } else {
      setNoPassStyle("bg-blue-600 hover:bg-blue-700")
    }
  }, [passed])

  useEffect(()=>{
    if (redScore >= 15){
      setWinnerTeam(1)
      setIsGameEnd(true)
    } else if (blueScorer >= 15){
      setWinnerTeam(2)
      setIsGameEnd(true)
    }
  }, [redScore, blueScorer])

  const handleStartButton = () =>{
    if (isValid){
      setIsGameStarted(true)
      setCounter(60)
      sendJsonMessage(JSON.parse(JSON.stringify({"action":"start_game"})))
    }
  }

  const setTeam = (client_id:string, team_value:number) => {
    if(isAdmin){
      sendJsonMessage(JSON.parse(JSON.stringify({"action":"set_team", "client_id":client_id, "team":team_value})))
    }
  }

  const sendScore = (value:number) =>{
    if (value == 0){
      setPassed(passed+1)
    }
    sendJsonMessage(JSON.parse(JSON.stringify({"action":"score", "client_id": clientID, "score":value})))
  }

  const handleNextTurn = () =>{
    sendJsonMessage(JSON.parse(JSON.stringify({"action":"next_turn", "client_id": clientID})))
    setCounter(60)
    setPassed(0)
    setIsTurnEnd(false)
  }

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
      <>
        {!isGameEnd &&
          <>
          {!isGameStarted && 
          <div className="w-full max-w-6xl mx-auto p-6 mt-24">
            <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-4 sm:p-7">
                <div className="mt-4 text-center">
                  <h1 className="block text-xl hover:cursor-pointer" onClick={()=>{navigator.clipboard.writeText(window.location.href);setIsCopied(true);}}>
                    <span className="font-bold text-blue-600 underline">Oda Bağlantısı{!isCopied && <span>nı</span>} Kopyala{isCopied && <span>ndı</span>}</span> {!isCopied && <span>🔗</span>} {isCopied && <span>✅</span>}
                  </h1>
                </div>
                <div className="mt-2">
                  <div className="grid gap-y-4 ">
                      <div className="grid grid-cols-3 gap-x-4 text-center mt-6 mb-4">
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border rounded-lg shadow overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="divide-x divide-gray-200">
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-sm text-red-600 font-bold uppercase"
                                    >
                                      Kırmızı Takım
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-x divide-gray-200">
                                {data.clients?.map((cl)=>{
                                  if (cl.team === 1){
                                  return <tr className="divide-x" key={cl.id}>
                                    <td className="grid grid-cols-3 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                      <div className="flex justify-start">
                                      </div>
                                      <div className="flex justify-center">
                                        {cl.username}
                                      </div>
                                      <div className="flex justify-end">
                                        {isAdmin &&
                                          <svg onClick={() => setTeam(cl.id, 0)} className="hover:cursor-pointer"
                                          xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                          </svg>
                                        }
                                      </div>
                                    </td>
                                  </tr>
                                  }
                                })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border rounded-lg shadow overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="divide-x divide-gray-200">
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-sm font-bold text-gray-600 uppercase"
                                    >
                                      Boştakiler
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-x divide-gray-200">
                                {data.clients?.map((cl)=>{
                                  if (cl.team === 0){
                                  return <tr className="divide-x" key={cl.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-800 grid grid-cols-3">
                                      <div className="flex justify-left">
                                        {isAdmin &&
                                          <svg onClick={() => setTeam(cl.id, 1)} className="hover:cursor-pointer"
                                          xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                          </svg>
                                        }
                                      </div>
                                      <div className="flex justify-center">
                                        <p>
                                          {cl.username}
                                        </p>
                                      </div>
                                      <div className="flex justify-end">
                                        {isAdmin &&
                                          <svg onClick={() => setTeam(cl.id, 2)} className="hover:cursor-pointer"
                                          xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                          </svg>
                                        }
                                      </div>
                                    </td>
                                  </tr>
                                  }
                                })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="-m-1.5 overflow-x-auto">
                          <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="border rounded-lg shadow overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="divide-x divide-gray-200">
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-sm text-blue-600 font-bold uppercase"
                                    >
                                      Mavi Takım
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-x divide-gray-200">
                                {data.clients?.map((cl)=>{
                                  if (cl.team === 2){
                                  return <tr className="divide-x" key={cl.id}>
                                    <td className="grid grid-cols-3 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                      <div className="flex justify-start">
                                        {isAdmin &&
                                          <svg onClick={() => setTeam(cl.id, 0)} className="hover:cursor-pointer"
                                          xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                          </svg>
                                        }
                                      </div>
                                      <div className="flex justify-center">
                                        {cl.username}
                                      </div>
                                      <div className="flex justify-end">
                                      </div>
                                    </td>
                                  </tr>
                                  }
                                })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isAdmin &&
                        <button
                            type="button"
                            className= {`mt-6 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent
                            font-semibold ${createColor} text-white ${disableStyles} transition-all text-sm`}
                            onClick={()=>handleStartButton()}
                            onMouseOver={()=>setIsValidErrorShown(true)}
                            onMouseOut={()=>setIsValidErrorShown(false)}
                          >
                            {isCreating &&
                            <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                            </span>
                            }
                            {!isValid && isValidErrorShown && 
                            <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible transition-opacity inline-block absolute z-10 mt-20 py-2 px-4 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm" role="tooltip">
                              Tüm Oyuncuları Yerleştirmelisin ve Boş Takım Olmamalı
                            </span>
                            }
                            Oyunu Başlat
                          </button>
                      }
                      {!isAdmin &&
                      <p className="text-center text-md mt-2 text-gray-600 italic">
                        Adminin Oyunu Başlatması Bekleniyor
                      </p>
                      }
                    </div>
                </div>
              </div>
            </div>
          </div>
          }
          {isGameStarted &&
          <div className="grid grid-rows-6 w-full h-screen">
            <div className="w-full row-span-4 max-w-md mx-auto p-6 mt-6">
              <div className="text-center text-lg grid grid-cols-2">
                <p><span className="font-bold">Süre: </span>{counter}</p>
                <p><span className="font-bold">Anlatan: </span>{currentPlaying.username}</p>
              </div>
              <div className="mt-2 pb-3 bg-white border border-gray-200 rounded-xl">
              {!isTurnEnd &&
                <>
                {(thisUserTeam !== currentPlaying.team || currentPlaying.id === clientID) &&
                  <div className="p-4 sm:p-7">
                    <h2 className="text-center font-bold text-2xl">
                      {data.word.word}
                    </h2>
                    <hr className="my-3" />
                    <div className="text-center">
                      <ul className="list-none list-inside text-gray-900">
                        {data.word.taboos.map((tb)=>(
                          <li className="mt-2 text-lg" key={tb}>{tb}</li>
                        ))}
                      </ul>
                      {currentPlaying.id !== clientID &&
                        <p className="mt-8 text-gray-500 text-sm">Dikkat et ki Tabu kelimeleri kullanmasın</p>
                      }
                    </div>
                  </div>
                }
                {thisUserTeam === currentPlaying.team && currentPlaying.id !== clientID &&
                  <div className="p-4 sm:p-7">
                    <h2 className="text-center font-bold text-2xl">
                      "{currentPlaying.username}" anlatıyor, bilmeye çalış
                    </h2>
                  </div>
                }
                </>
              }
              {isTurnEnd &&
                <div className="p-4 sm:p-7">
                  <h2 className="text-center font-bold text-2xl">
                    {!isAdmin &&
                      <span>Diğer tur için adminin onayı bekleniyor...</span>
                    }
                    {isAdmin &&
                      <span>Herkes, diğer eli başlatmanı bekliyor...</span>
                    }
                  </h2>
                </div>
              }
              </div>
              {clientID === currentPlaying.id && !isTurnEnd &&
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <button 
                    onClick={()=>{sendScore(-1)}}
                    type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent 
                    font-semibold bg-red-600 text-white hover:bg-red-700  transition-all text-sm">
                    Tabu!
                  </button>
                  <button
                    disabled={passed>=3}
                    onClick={()=>{sendScore(0)}}
                    type="button" className={`py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent 
                    font-semibold text-white  transition-all text-sm ${noPassStyle}`}>
                    Pas Geç
                  </button>
                  <button 
                    onClick={()=>{sendScore(1)}}
                    type="button" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent 
                    font-semibold bg-green-600 text-white hover:bg-green-700 transition-all text-sm">
                    Doğru
                  </button>
                </div>
                }
                {isTurnEnd && isAdmin &&
                <div className="flex justify-end">
                  <button
                    onClick={()=>{handleNextTurn()}} 
                    type="button" className="py-3 px-4 mt-4 text-left inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-600 text-white hover:bg-blue-700">
                    Sonraki Anlatıcıya Geç {'>'}
                  </button>
                </div>
                }
            </div>
            <div className="grid grid-cols-2 row-span-2">
              <div className="w-full h-full">
                <div className="pb-3 bg-white border h-full border-gray-200">
                  <div className="p-2">
                    <div className="text-center">
                      <h2 className="text-red-600 text-xl font-bold">
                        Kırmızı Takım
                      </h2>
                      <h2 className="text-xl font-bold">
                        {redScore}
                      </h2>
                    </div>
                  </div>
                  <div className="px-2 mt-2">
                    <div className="flex flex-col">
                      <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                          <div className="flex justify-center">
                            <div className="overflow-hidden max-w-lg">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th scope="col" className="px-12 py-2 text-left text-xs font-medium text-gray-500 uppercase">Oyuncu</th>
                                    <th scope="col" className="px-12 py-2 text-left text-xs font-medium text-gray-500 uppercase">Puan</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {data.clients?.map((cl)=>{
                                  if (cl.team === 1){
                                    return <tr key={cl.id}>
                                      <td className="px-12 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{cl.username}</td>
                                      <td className="px-12 py-2 whitespace-nowrap text-sm text-gray-800">{cl.score}</td>
                                    </tr>
                                  }
                                })}
                                </tbody>
                              </table>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full">
                <div className="pb-3 bg-white border h-full border-gray-200">
                  <div className="p-2">
                    <div className="text-center">
                      <h2 className="text-blue-600 text-xl font-bold">
                        Mavi Takım
                      </h2>
                      <h2 className="text-xl font-bold">
                        {blueScorer}
                      </h2>
                    </div>
                  </div>
                  <div className="px-2 mt-2">
                    <div className="flex flex-col">
                      <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                          <div className="flex justify-center">
                            <div className="overflow-hidden max-w-lg">
                              <table className="min-w-full divide-y divide-gray-200 ">
                                <thead>
                                  <tr>
                                    <th scope="col" className="px-12 py-2 text-left text-xs font-medium text-gray-500 uppercase">Oyuncu</th>
                                    <th scope="col" className="px-12 py-2 text-left text-xs font-medium text-gray-500 uppercase">Puan</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 ">
                                {data.clients?.map((cl)=>{
                                  if (cl.team === 2){
                                    return <tr key={cl.id}>
                                      <td className="px-12 py-2 whitespace-nowrap text-sm font-medium text-gray-800 ">{cl.username}</td>
                                      <td className="px-12 py-2 whitespace-nowrap text-sm text-gray-800 ">{cl.score}</td>
                                    </tr>
                                  }
                                })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
          </>
        }
        {isGameEnd &&
          <div className="w-full max-w-2xl mx-auto p-6 mt-24">
            <div className="mt-7 pb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-4 sm:p-7">
                <div className="mt-4 text-center">
                  <h1 className="block text-3xl hover:cursor-pointer font-bold">
                    {winnerTeam == 1 && <span className="text-red-600">Kırmızı </span>}
                    {winnerTeam == 2 && <span className="text-blue-600">Mavi </span>}
                    Takım Kazandı
                  </h1>
                  <Link to={'/'}>
                    <button 
                    type="button" 
                    className="py-3 mt-10 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all text-md">
                      Ana Menüye Dön
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        }
      </> 
      }
    </div>
  )
}

export default Room

