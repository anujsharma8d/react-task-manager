import '../index.css'
import { useState, useEffect } from 'react';
import { Trash2, SquarePen, Plus, Circle, CircleCheck, Sun, Moon } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskManager = () => {
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_API_URL

    const isLoggedIn = !!localStorage.getItem("token");

    const [showInput, setShowInput] = useState(false);
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme")

        return savedTheme ? JSON.parse(savedTheme) : false;

    });
    const [filter, setFilter] = useState("All");

    const handleAdd = async () => {
        if (!todo.trim()) return;

        const token = localStorage.getItem("token")

        if (!token) {
            if (editIndex !== null) {
                setTodos(todos.map(task =>
                    task._id === editIndex
                        ? { ...task, text: todo }
                        : task
                ))
                setEditIndex(null);
            }
            else {
                setTodos([
                    ...todos, { _id: Date.now().toString(), text: todo, isCompleted: false }
                ])
            }

            setEditIndex(null);
            setTodo("")
            return
        }

        if (editIndex !== null) {

            try {
                const res = await axios.put(`${baseUrl}/api/tasks/${editIndex}`, { title: todo }, { headers: { Authorization: `Bearer ${token}` } })

                setTodos(todos.map(task =>
                    task._id === editIndex
                        ? { ...task, text: res.data.title }
                        : task
                ))

                setEditIndex(null);
                setTodo("");
                return;

            } catch (err) {
                console.log(err)
            }

        }
        else {

            if (token) {
                try {
                    const res = await axios.post(`${baseUrl}/api/tasks/add`, { title: todo }, { headers: { Authorization: `Bearer ${token}` } })
                    setTodos([...todos, { _id: res.data._id, text: res.data.title, isCompleted: res.data.completed }]);
                } catch (err) {
                    console.log(err)
                }
            }
        }
        setTodo("");
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setTodos([])
        navigate("/login");
    };

    const handleComplete = async (id) => {
        const token = localStorage.getItem("token")

        if (!token) {
            setTodos(todos.map(task =>
                task._id === id
                    ? { ...task, isCompleted: !task.isCompleted }
                    : task
            ))
            return
        }

        try {
            const res = await axios.patch(`${baseUrl}/api/tasks/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })

            setTodos(todos.map(task =>
                task._id === id
                    ? { ...task, isCompleted: res.data.completed }
                    : task
            ))
        } catch (err) {
            console.log(err)
        }

    }

    const handleEdit = (todo) => {
        setTodo(todo.text);
        setEditIndex(todo._id);
        setShowInput(true);
    }
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token")

        if (!token) {
            setTodos(todos.filter(task => task._id !== id));
            return;
        }

        try {
            await axios.delete(`${baseUrl}/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })

            setTodos(todos.filter(todo => todo._id !== id));

        } catch (err) {
            console.log(err);
        }

    }

    const toggleTheme = () => {
        setDarkMode(darkMode => !darkMode);
    }

    const filterTasks = todos.filter((todo) => {
        if (filter === "Completed") return todo.isCompleted;
        if (filter === "Pending") return !todo.isCompleted;
        return true;
    })

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token")
            if (!token) return;

            try {
                const res = await axios.get(`${baseUrl}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } })
                const tasks = res.data.map(task => ({
                    _id: task._id,
                    text: task.title,
                    isCompleted: task.completed
                }))

                setTodos(tasks)
            } catch (err) {
                console.log(err)
            }

        }

        fetchTasks()

    }, [])



    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(darkMode));

    }, [darkMode])


    return (

        <>
            <main className={`min-h-screen flex flex-col justify-center items-center gap-10 
        ${darkMode ? "bg-black" : "bg-white"}
        `}>
                <section className={`relative rounded-2xl border p-15 min-w-[250px] sm:min-w-[620px] lg:min-w-5xl flex flex-col gap-5
        ${darkMode ? "bg-zinc-900 border border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.45),0_20px_60px_rgba(0,0,0,0.35)]" : "border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_30px_rgba(0,0,0,0.06),0_30px_60px_rgba(0,0,0,0.04)]"}
           `}>

                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center pt-5
            ${darkMode ? "text-gray-200" : "text-gray-700"}
            `}>TASK MANAGER</h1>

                    <button
                        onClick={() => toggleTheme()}
                        className='absolute top-5 left-5'
                    >
                        {darkMode ? <Sun className='text-white' /> : <Moon />}
                    </button>
                    {!isLoggedIn ?
                        <div>
                            <button
                                onClick={() => navigate("/login")}
                                className='bg-blue-500 text-white p-2 sm:p-3 text-sm lg:text-xl font-bold rounded-xl cursor-pointer absolute top-5 right-26 lg:right-40 '
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className='bg-blue-500 text-white p-2 sm:p-3 text-sm lg:text-xl font-bold rounded-xl cursor-pointer absolute top-5 right-5'
                            >
                                Sign Up
                            </button>
                        </div>

                        :

                        <button
                            onClick={handleLogout}
                            className='bg-blue-500 text-white p-2 sm:p-3 text-sm lg:text-xl font-bold rounded-xl cursor-pointer absolute top-5 right-5'
                        >
                            Logout
                        </button>

                    }

                    <div className='flex flex-col items-center sm:flex-row gap-5 sm:justify-between'>
                        <button
                            onClick={() => setShowInput(true)}
                            className='bg-blue-500 text-white p-2 sm:p-3 text-sm sm:text-xl font-bold rounded-xl flex justify-center items-center gap-2'
                            id='add-task'
                        >Add task<Plus className='w-4 sm:w-10 '/></button>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} id="task-progress" className={`${darkMode ? "bg-zinc-700 text-gray-300" : "bg-gray-200 text-gray-800"} outline-0 p-3 font-bold rounded-xl sm:font-bold hidden sm:block`}>
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>


                    <div id='enter-task' className='flex justify-center items-center'>
                        {showInput && (
                            <div className='flex flex-col gap-2 sm:gap-5 sm:flex-row'>
                                <input
                                    value={todo}
                                    onChange={(e) => {
                                        setTodo(e.target.value);
                                    }}
                                    className={`p-3 text-sm sm:text-xl outline-none border-none rounded-xl font-bold ${darkMode ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"}`} type="text" placeholder='Enter the task' id="" />
                                <button onClick={handleAdd} className='bg-blue-500 text-white p-2 sm:p-3 text-sm sm:text-xl font-bold rounded-xl cursor-pointer'>
                                    {editIndex !== null ? "Save" : "Add"}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end sm:hidden'>

                        {/* Mobile Selection */}
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} id="task-progress" className={`${darkMode ? "bg-zinc-700 text-gray-300" : "bg-gray-200 text-gray-800"} outline-0 p-2 sm:p-3 text-sm sm:text-xl rounded-xl font-bold`}>
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>


                    <div id='task' className={`h-[420px] w-auto overflow-y-auto p-0.5 ${darkMode ? "bg-zinc-700 dark-scroll" : "bg-gray-200 light-scroll"}`}>
                        {todos.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-zinc-500 font-bold">
                                No tasks yet
                            </div>) : (
                            filterTasks.map((todo, index) => (
                                <div key={todo._id || index} className={`overflow-hidden flex p-2 sm:p-5 m-3 font-light text-xm sm:text-xl justify-between items-center gap-3
              ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}
              `}>
                                    <button onClick={() => handleComplete(todo._id)}>
                                        {todo.isCompleted ? (
                                            <CircleCheck className="text-green-500 w-4 sm:w-10 " />
                                        ) : (
                                            <Circle className='w-4 sm:w-10 '/>
                                        )}</button>
                                    <p className={todo.isCompleted ? "line-through overflow-auto w-20 sm:w-auto" : "overflow-auto w-20 sm:w-auto"}>{todo.text}</p>
                                    <div className='flex gap-5'>
                                        <button onClick={() => handleEdit(todo)} className='cursor-pointer'>
                                            <SquarePen className='w-4 sm:w-10 '/>
                                        </button>

                                        <button onClick={() => handleDelete(todo._id)} className='cursor-pointer'>
                                            <Trash2 className='text-red-500 w-4 sm:w-10 ' />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                    {isLoggedIn?
                    <p></p>
                    :
                    <p className='text-center text-red-500 font-bold'>Login to save your tasks</p>
                }
                </section>
            </main>
        </>
    )
}

export default TaskManager
