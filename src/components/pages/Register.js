import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom' ;
import Loading from '../Loading';

function Register() {

  // React Hooks
  const [inputs , setInputs] = React.useState({
    user : '' ,
    email : '',
    pwd : '' ,
    rPwd : ''
  });
  const [errMsg , setErrMsg] = React.useState(null);

  const userRef = React.useRef();
  const emailRef = React.useRef();
  const pwdRef = React.useRef();
  const rPwdRef = React.useRef();

  const navigate = useNavigate();



  // Handle Register Form
  const inputsHandler = (e) => {
    const { name , value } = e.target ;
    setInputs((prevInputs) => {
      return {...prevInputs , [name] : value} ;
    })
  }


  // Clear The Error Message
  React.useEffect(() => {
    userRef.current.classList.remove('invailed');
    emailRef.current.classList.remove('invailed');
    pwdRef.current.classList.remove('invailed');
    rPwdRef.current.classList.remove('invailed');
    setErrMsg(null)
  },[inputs])



  // Register Submit
  const submitHandler = async (e) => {
    setErrMsg('');
    e.preventDefault();
    try{
      const reg = await axios.post('/register',inputs).then(res => {
        if(res.status === 201) {
          navigate('/login')
        }
      });
    }catch (err) {
      if(err?.response?.status === 400) {
        emptyInputs();
        setErrMsg('All Fileds Are Required');
      } else if (err?.response?.status === 409) {
        if(err?.response?.data?.message === 'Username is Already Taken'){
          userRef.current.classList.add('invailed');
          setErrMsg('Username is Already Taken');
        }
        if(err?.response?.data?.message === 'Email is Already Registerd'){
          emailRef.current.classList.add('invailed');
          setErrMsg('Email is Already Taken');
        }
        if(err?.response?.data?.message === 'Password Must Be same As Repeated Password'){
          rPwdRef.current.classList.add('invailed');
          setErrMsg('Passwords do not match');
        }
      }else{
        setErrMsg('Something Went Wrong Please Try Again Later!')
      }
      
    }
  }


  const emptyInputs = () => {
    if(inputs.user === ''){
      userRef.current.classList.add('invailed');
    }
    if(inputs.email === ''){
      emailRef.current.classList.add('invailed');
    }
    if(inputs.pwd === ''){
      pwdRef.current.classList.add('invailed');
    }
    if(inputs.rPwd === ''){
      rPwdRef.current.classList.add('invailed');
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
        <div className='register-input'>
          <div className='circle'></div>
          <input type='email' placeholder='Email...' name='email' onChange={inputsHandler} value={inputs.email} ref={emailRef}/>
        </div>
        <div className='register-input '>
          <div className='circle'></div>
          <input type='password' placeholder='Password...' name='pwd' onChange={inputsHandler} value={inputs.pwd} ref={pwdRef}/>
        </div>
        <div className='register-input'>
          <div className='circle'></div>
          <input type='password' placeholder='Reapeted Password...' name='rPwd' onChange={inputsHandler} value={inputs.rPwd} ref={rPwdRef}/>
        </div>
        <button>Register</button>
      </form>
      <p className='to-login'>Already Have An Account? <NavLink to='/login'>Login</NavLink></p>
    </main>
  )
}

export default Register