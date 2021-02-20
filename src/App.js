import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  //Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  //Add Task
  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 10000) + 1

    const res = await fetch('http://localhost:5000/tasks', {
    method: "POST",
    body: JSON.stringify(task),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })

  const data = await res.json()

  setTasks([...tasks, data])
}

//Delete Task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
  method: 'DELETE'
})

setTasks(tasks.filter((task) => task.id !== id))
}

//Toggle Reminder
const toggleReminder = async (id) => {
  const taskToUpdate = tasks.filter((task) => task.id === id)[0]
  const updatedTask = {...taskToUpdate, reminder: !taskToUpdate.reminder}
  await fetch(`http://localhost:5000/tasks/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updatedTask),
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
setTasks(tasks.map((task) => task.id === id ? updatedTask : task))
}

return (
  <Router>
    <div className='container'>
      <Header title='Task Tracker' onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      <Route path='/' exact render={(props) => (
        <>
          {showAddTask && <AddTask onAdd={addTask} />}
          {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No Tasks To Show'}
        </>
      )} />
      <Route path='/about' component={About} />
      <Footer />
    </div>
  </Router>
  )
}

export default App
