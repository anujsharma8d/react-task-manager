import '../index.css'
import { useState, useEffect } from 'react';
import { Trash2, SquarePen, Plus, Circle, CircleCheck, Sun, Moon } from "lucide-react";

const TaskManager = () => {
    const [showInput, setShowInput] = useState(false);
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem("todos");

        return savedTodos ? JSON.parse(savedTodos) : [];

    });
    const [editIndex, setEditIndex] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme")

        return savedTheme ? JSON.parse(savedTheme) : false;

    });
    const [filter, setFilter] = useState("All");

    const handleAdd = () => {
        if (editIndex != null) {
            const updatedTodos = [...todos];
            updatedTodos[editIndex].text = todo;
            setTodos(updatedTodos);
            setEditIndex(null);
        }
        else {
            setTodos([...todos, { text: todo, isCompleted: false }]);
        }
        setTodo("");
    }

    const handleComplete = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
        setTodos(updatedTodos);
    }

    const handleEdit = (index) => {
        setTodo(todos[index].text);
        setEditIndex(index);
        setShowInput(true);
    }
    const handleDelete = (index) => {
        setTodos(todos.filter((todo, i) => i !== index));
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
        console.log("Saving todos:", todos);
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos])



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

                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center
            ${darkMode ? "text-gray-200" : "text-gray-700"}
            `}>TASK MANAGER</h1>

                    <button
                        onClick={() => toggleTheme()}
                        className='border border-gray-500 p-1 rounded-xl absolute top-5 right-5'
                    >
                        {darkMode ? <Sun className='text-white' /> : <Moon />}
                    </button>



                    <div className='flex flex-col items-center sm:flex-row gap-5 sm:justify-between'>
                        <button
                            onClick={() => setShowInput(true)}
                            className='bg-blue-500 text-white p-2 sm:p-3 text-sm sm:text-xl font-bold rounded-xl flex justify-center items-center gap-2'
                            id='add-task'
                        >Add task<Plus /></button>
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
                                <div key={index} className={`overflow-hidden flex p-5 m-3 font-light text-xm sm:text-xl justify-between items-center gap-3
              ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}
              `}>
                                    <button onClick={() => handleComplete(index)}>
                                        {todo.isCompleted ? (
                                            <CircleCheck className="text-green-500" />
                                        ) : (
                                            <Circle />
                                        )}</button>
                                    <p className={todo.isCompleted ? "line-through overflow-auto w-10 sm:w-auto" : "overflow-auto w-10 sm:w-auto"}>{todo.text}</p>
                                    <div className='flex gap-5'>
                                        <button onClick={() => handleEdit(index)} className='cursor-pointer'>
                                            <SquarePen />
                                        </button>

                                        <button onClick={() => handleDelete(index)} className='cursor-pointer'>
                                            <Trash2 className='text-red-500' />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </section>
            </main>
        </>
    )
}

export default TaskManager
