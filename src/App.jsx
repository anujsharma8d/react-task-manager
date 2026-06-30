import './App.css'
import { useState, useEffect } from 'react';
import { Trash2, SquarePen, Plus, Circle, CircleCheck, Sun, Moon } from "lucide-react";

function App() {
  const [showInput, setShowInput] = useState(false);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(()=>{
    const savedTodos = localStorage.getItem("todos");

    return savedTodos ? JSON.parse(savedTodos) : [];
      
  });
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(()=>{
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

  const filterTasks = todos.filter((todo)=>{
    if(filter === "Completed") return todo.isCompleted;
    if(filter === "Pending") return !todo.isCompleted;
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
        ${darkMode? "bg-white" : "bg-black"}
        `}>
      <section className='border-2 border-gray-500 p-5 min-w-5xl'>

        <div className='flex items-center justify-center'>
          <h1 className='text-5xl font-extrabold text-gray-600'>TODO LIST</h1>
          <button 
          onClick={()=>toggleTheme()}
          className='border border-gray-500 p-1 rounded-xl'
          >
            {darkMode? <Moon />: <Sun className='text-white' />  } 
          </button>
        </div>


        <div className='flex justify-between'>
          <button
            onClick={() => setShowInput(true)}
            className='bg-blue-500 text-white p-3 text-xl font-bold rounded-xl flex justify-center items-center gap-2'
            id='add-task'
            >Add task<Plus /></button>
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} id="task-progress" className='bg-gray-400 outline-0 p-3 text-xl rounded-xl font-bold'>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>


        <div id='enter-task' className='flex justify-center items-center'>
          {showInput && (
            <div className='flex gap-5'>
              <input
                value={todo}
                onChange={(e) => {
                  setTodo(e.target.value);
                }}
                className='bg-gray-400 text-xl outline-none border-none p-3 rounded-xl font-bold' type="text" placeholder='Enter the task' id="" />
              <button onClick={handleAdd} className='bg-blue-500 text-white p-3 font-bold rounded-xl cursor-pointer'>
                {editIndex !== null ? "Save" : "Add"}
              </button>
            </div>
          )}
        </div>


        <div id='task' className={`${darkMode? "bg-gray-400" : "bg-gray-200" }`}>
          {filterTasks.map((todo, index) => (
            <div key={index} className={`flex  p-5 m-3 font-light text-xl justify-between items-center gap-3
              ${darkMode? "bg-gray-200 text-black" : "bg-gray-700 text-white" }
              `}>
              <button onClick={() => handleComplete(index)}>
                {todo.isCompleted ? (
                  <CircleCheck className="text-green-500" />
                ) : (
                  <Circle />
                )}</button>
              <p className={todo.isCompleted ? "line-through" : ""}>{todo.text}</p>
              <div className='flex gap-5'>
                <button onClick={() => handleEdit(index)} className='cursor-pointer'>
                  <SquarePen />
                </button>

                <button onClick={() => handleDelete(index)} className='cursor-pointer'>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))
        }

        </div>
        </section>
      </main>
    </>
  )
}

export default App
