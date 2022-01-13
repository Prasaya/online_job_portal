import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header"
import Login from "./Components/Login";
import RegisterAccount from "./Components/RegisterAccount";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Login/>} exact/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<RegisterAccount/>}/>
      </Routes>
      
    </BrowserRouter>
    
  );
}

export default App;
