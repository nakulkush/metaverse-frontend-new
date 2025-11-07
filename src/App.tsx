// import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import JoinRoom from "./components/JoinRoom";
// import Room from "./components/Room";
// // import RoomPage from "./components/Room";

// import RoomPage from "./components/RoomPage";
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<JoinRoom />} />
//         <Route path="/room/:roomID" element={<Room />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SetupPage from "./components/SetupPage";
import Room from "./components/Room";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/room/:roomID" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
