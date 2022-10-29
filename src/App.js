import React from "react";
import {Routes , Route } from 'react-router-dom';
import {useNavigate , useLocation} from 'react-router-dom';
import AuthNav from "./components/AuthNav";
import Header from "./components/Header";
import Login from "./components/pages/Login";
import Main from "./components/pages/Main";
import Register from "./components/pages/Register";
import useAuth from './hooks/useAuth';
import useRefreshToken from './hooks/useRefreshToken';
import Loading from "./components/Loading";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";


function App() {

  const  {auth , setAuth}  = useAuth();

  const [darkAndLight , setDarkAndLight] = React.useState('dark');

  const refresh = useRefreshToken();
  
  const location = useLocation();

  const navigate = useNavigate();

  const [loading , setLoading] = React.useState(false);
  


  const refreshFunction = async () => {
    try {
      const ref = await refresh();
      setLoading(true);
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  }

  React.useEffect(() => {
    refreshFunction() ; 
  },[])

  const settingMood = () => {
    setDarkAndLight(prev => {
      if(prev === 'dark'){
        return 'light';
      }else {
        return 'dark';
      }
    })
  }

  React.useEffect(() => {
    if(window.localStorage.getItem('mood')){
      setDarkAndLight(window.localStorage.getItem('mood'));
    }
  },[])

  React.useEffect(() => {
    window.localStorage.setItem('mood' , darkAndLight);
  },[darkAndLight])



  
  
  

  return (
    <div className={darkAndLight === 'dark' ? "app" : "app light"}>
      <Header darkAndLight={darkAndLight} setDarkAndLight={settingMood}/>
      {loading ? (<AuthNav />) : (<nav><Loading/></nav>)}

      <Routes>
        <Route path="/" element={<Main />} />
        <Route element={<ProtectedRoutes/>}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;
