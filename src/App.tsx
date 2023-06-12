import { BrowserRouter, Routes, Route } from "react-router-dom";

import Base from "./pages/base";
import CreateRoom from "./pages/CreateRoom";
import NickName from "./pages/NickName";
import Room from "./pages/Room";
import AddWord from "./pages/AddWord";

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Base />} />
          <Route path="create" element={<CreateRoom />} />
          <Route path="setNickName" element={<NickName/>} />
          <Route path="add-word" element={<AddWord/>} />
        </Route>

          <Route path="/room/:id/:capacity/" element={<Room />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
