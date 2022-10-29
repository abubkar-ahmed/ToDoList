import React from 'react'
import { nanoid } from 'nanoid';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import Loading from '../Loading';
import check from '../../images/icon-check.svg'
import cross from '../../images/icon-cross.svg'

function Main() {

    const  {auth}  = useAuth();

    const [loading , setLoading] = React.useState(false)

    const [tasks , setTasks] = React.useState([]);


    const [inputs , setInputs] = React.useState({description : ''});

    const [filter , setFilter] = React.useState('all');

    const [counter , setCounter] = React.useState(0);

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${auth?.accessToken}`
        },
        withCredentials: true
    });


    React.useEffect(() => {
        if(!auth.accessToken){
            getFromLocalStorage();
        }else {
            getTasks();
        }
    },[auth]);

    const getTasks = async () => {
        try {
            const response = await axiosPrivate.get('/tasks');
            console.log(response);
            setTasks(response.data);
            setLoading(true);
        } catch (err) {
            console.error(err);
            
        }
    }
    
    React.useEffect(() => {
        if(!auth.accessToken){
            toLocalStorage();
        }
    },[tasks]);


    const addNewTask = () => { 
        const addTasks = async () => {
            try {
                const response = await axiosPrivate.post('/tasks',inputs);
                getTasks();
                
            } catch (err) {
                console.error(err);
                
            }
        }
        addTasks();   
    }

    const toLocalStorage = () => {
        window.localStorage.setItem('task' , JSON.stringify(tasks));
    }
    const getFromLocalStorage = () => {
        setTimeout(() => {
            setLoading(true)
        }, 2000);
        if(window.localStorage.getItem('task')) {
            setTasks(JSON.parse(window.localStorage.getItem('task')));
        }
    }

    const inputsHandler = (e) => {
        const { name , value} = e.target ;
        setInputs((prevInputs) => {
            if(!auth.accessToken){
                return {...prevInputs,id : nanoid() ,compileted : false , [name] : value }
            } else {
                return {...prevInputs ,compileted : false , [name] : value }
            }
        });
    }
    const handleClick =  (event) => {
        if (event.keyCode === 13) {
            setTasks(prev => {
                return [...prev ,  inputs ]
            })
            if(auth.accessToken){
                addNewTask();
            }
            setInputs({description : ''})
        }
        
    };


    React.useEffect( () => {
        window.addEventListener('keypress', handleClick);
        
        return () => {
          window.removeEventListener('keypress', handleClick);
        };
    });
    
    const deleteTask = (id) => {
        const newTasks = tasks.filter((task) => {
            if(task.id){
                return task.id !== id;
            }else {
                return task._id !== id;
            }
        })
        setTasks(newTasks);
        if(!auth.accessToken) {
            toLocalStorage();
        }else {          
            const deleteTasksReq = async () => {
                try {
                    const response = await axiosPrivate.delete(`/tasks/${id}`);
                    console.log(response);
                    getTasks();
                } catch (err) {
                    console.error(err);
                    
                }
            }
            deleteTasksReq();
        }
    }

    const checkedTask = (id, compileted) => {
        const newTasks = tasks.map((task) => {
            if(task.id){
                if(task.id === id){
                    return {...task, compileted : true}
                }else{
                    return {...task} ;
                }
            }else {
                if(task._id === id){
                    return {...task, compileted : true}
                }else{
                    return {...task} ;
                }
            }

        })
        setTasks(newTasks);
        if(!auth.accessToken) {
            toLocalStorage();
        }else {
            const updateTask = async () => {
                try {
                    const response = await axiosPrivate.put(`/tasks`,
                    {
                        id : id,
                        compileted : true
                    });
                    getTasks();
                } catch (err) {
                    console.error(err);
                    
                }
            }
            updateTask();
        }
    }

    const TaskComponentsNotFilterd = ((props) => {
        const task = props.task ;
        return (
            <div className='task' key={task.id || task._id}>
                {task.compileted || task.compileted ?  
                <div className='part-1'>
                    <div className='circle checked' onClick={() => checkedTask(task.id || task._id , task.compileted)}>
                        <img src={check} alt='done' />
                    </div> 
                    <p className='checked'>{task.description}</p>
                </div>
                :
                <div className='part-1'>
                    <div className='circle' onClick={() => checkedTask(task.id || task._id, task.compileted)}>
                </div>
                <p>{task.description}</p>
            </div> 
            }
                
            <img src={cross} alt='delete' className='delete' onClick={() => deleteTask(task.id || task._id)}/>
            </div>
        )
    })

    const TaskComponents = tasks.map((task) => {
        if(filter === 'all'){
            return (
                <TaskComponentsNotFilterd task={task} key={task.id || task._id}/>
            )
        } else if (filter === 'active'){
            if(task.compileted === false){
                return (
                    <TaskComponentsNotFilterd task={task} key={task.id || task._id}/>
                )
            }
        } else if (filter === 'complated' ) {
            if(task.compileted === true){
                return (
                    <TaskComponentsNotFilterd task={task} key={task.id || task._id}/>
                )
            }
        }
    })

    const allRef = React.useRef();
    const activeRef = React.useRef();
    const complatedRef = React.useRef();

    const allFilter = () => {
        activeRef.current.classList.remove('active')
        complatedRef.current.classList.remove('active')
        allRef.current.classList.add('active')
        setFilter('all');
    }

    const activeFilter = () => {
        activeRef.current.classList.add('active')
        complatedRef.current.classList.remove('active')
        allRef.current.classList.remove('active')
        setFilter('active');
    }

    const complatedFilter = () => {
        activeRef.current.classList.remove('active')
        complatedRef.current.classList.add('active')
        allRef.current.classList.remove('active')
        setFilter('complated');
    }

    React.useEffect(() => {
        setCounter(0);
        for (let i = 0 ; i<tasks.length ; i++){
            if(tasks[i].compileted === false) {
                setCounter(prev => prev + 1);
            }
        }
        
    },[tasks]);


    const clear = async () => {
        const newTasks = tasks.filter((task) => {
            return task.compileted === false ;
        })
        setTasks(newTasks);
        if(auth.accessToken){
            setLoading(false);
            try {
                const response = await axiosPrivate.get(`/tasks/clear`);
                console.log(response);
                setTasks(response.data);
                setLoading(true)
            } catch (err) {
                console.error(err);
                setLoading(true);
                
            }
        }
    }


  return (
    <main>
        <div className='input'>
            <div className='circle'></div>
            <input type='text' placeholder='Creat a new todo...' name='description' onChange={inputsHandler} value={inputs.description}/>
        </div>
        <div className='main-container'>
            <div>
                {loading ? TaskComponents : (<Loading spinner={true}/>)}
            </div>

            <div className='controls'>
                <div className='items-left'>
                    {counter} items left
                </div>
                <div className='filter'>
                    <ul>
                        <li className='active' ref={allRef} onClick={allFilter}>All</li>
                        <li ref={activeRef} onClick={activeFilter}>Active</li>
                        <li ref={complatedRef} onClick={complatedFilter}>Complated</li>
                    </ul>
                </div>
                <div className='cleare-complated' onClick={clear}>
                    Clear complated
                </div>
            </div>
        </div>
    </main>
  )
}

export default Main