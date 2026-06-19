import './App.css'
import { useState } from 'react';
import { Trash2, SquarePen, Plus, Circle, CircleCheck} from "lucide-react";

function App() {
  const [showInput, setShowInput] = useState(false);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    if(editIndex != null){
      const updatedTodos = [...todos];
      updatedTodos[editIndex].text=todo;
      setTodos(updatedTodos);
      setEditIndex(null);
    }
    else{
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
  const handleDelete = () => {

  }

  return (

    <>
      <main className='flex flex-col justify-center items-center gap-10'>
        <h1 className='text-5xl font-extrabold text-gray-600'>TODO LIST</h1>


        <div className='flex gap-40'>
          <button
            onClick={() => setShowInput(true)}
            className='bg-blue-500 text-white p-3 text-xl font-bold rounded-xl flex justify-center items-center gap-2'
            id='add-task'
          >Add task<Plus /></button>
          <select name="" id="task-progress" className='bg-gray-400 outline-0 p-3 text-xl rounded-xl font-bold'>
            <option value="">All</option>
            <option value="">Completed</option>
          </select>
        </div>


        <div id='enter-task'>
          {showInput && (
            <div className='flex gap-5'>
              <input
                value={todo}
                onChange={(e) => {
                  setTodo(e.target.value);
                }}
                className='bg-gray-400 text-xl outline-none border-none p-3 rounded-xl font-bold' type="text" placeholder='Enter the task' id="" />
              <button onClick={handleAdd} className='bg-blue-500 text-white p-3 font-bold rounded-xl'>
                {editIndex !== null ? "Save" : "Add"}
              </button>
            </div>
          )}
        </div>


        <div id='task' className='bg-gray-200'>
          {todos.map((todo, index) => (
            <div key={index} className='flex bg-white p-5 m-3 font-light text-xl justify-between items-center gap-3'>
              <button onClick={()=>handleComplete(index)}>
                {todo.isCompleted ? (
                  <CircleCheck className="text-green-500" />
                ) : (
                  <Circle />
                )}</button>
              <p className={todo.isCompleted? "line-through":""}>{todo.text}</p>
              <div className='flex gap-5'>
                <button onClick={()=>handleEdit(index)}>
                  <SquarePen />
                </button>

                <button onClick={handleDelete}>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))
          }

        </div>
      </main>
    </>
  )
}

export default App
