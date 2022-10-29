import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom' ;
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading';

const LOGIN_URL = '/login';

function Login() {

  const { setAuth } = useAuth();

  const [errMsg , setErrMsg] = React.useState(null);

  const [inputs , setInputs] = React.useState({
    user : '',
    pwd : ''
  });

  const userRef = React.useRef();
  const pwdRef = React.useRef();

  const navigate = useNavigate();

  const inputsHandler = (e) => {
    const { name , value } = e.target ;
    setInputs((prevInputs) => {
      return {...prevInputs , [name] : value} ;
    })
  }



  React.useEffect(() => {
    userRef.current.classList.remove('invailed');
    pwdRef.current.classList.remove('invailed');
    setErrMsg(null)
  },[inputs])


  const submitHandler = async (e) => {
    setErrMsg('');
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify(inputs),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
      );
      const accessToken = response?.data?.accessToken;
      setAuth({user : inputs.user, pwd : inputs.pwd, accessToken });
      navigate('/')
    } catch (err) {
      if(err?.response?.status === 400) {
          if(inputs.user === ''){
            userRef.current.classList.add('invailed');
          }
          if(inputs.pwd === ''){
            pwdRef.current.classList.add('invailed');
          }
          setErrMsg('All Filed Are Required');
      } else if (err?.response?.status === 401) {
          userRef.current.classList.add('invailed');
          pwdRef.current.classList.add('invailed');
          setErrMsg('Please Enter Vailed User And Password');
      } else {
        setErrMsg('Something Went Wrong Please Try Again Later !');
      }
    }

 
  }



  return (
    <main className='register-main'>
      {errMsg ? (<p className='err-msg'>{errMsg}</p>) 
      : 
        errMsg === '' ? (<Loading spinner={true}/>): (null)
      }
      <form onSubmit={submitHandler}>
        <div className='register-input'>
          <div className='circle'></div>
          <input type='text' placeholder='Username...' name='user' onChange={inputsHandler} value={inputs.user} ref={userRef}/>
        </div>
        <div className='register-input '>
          <div className='circle'></div>
          <input type='password' placeholder='Password...' name='pwd' onChange={inputsHandler} value={inputs.pwd} ref={pwdRef}/>
        </div>
        <button>Login</button>
      </form>
      <p className='to-login'>Need An Acount? <NavLink to='/register'>Register</NavLink></p>
  </main>
  )
}

export default Login