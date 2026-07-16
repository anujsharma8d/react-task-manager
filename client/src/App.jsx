import { Route,Routes } from 'react-router-dom'
import TaskManager from './pages/TaskManager';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TaskManager />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </>
  )
}

export default App
