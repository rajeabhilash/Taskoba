import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Admin/Dashboard'
import CreateTask from './pages/Admin/CreateTask'
import ManageTasks from './pages/Admin/ManageTasks'

import MyTasks from './pages/User/MyTasks'
import UserDashboard from './pages/User/UserDashboard';
import ViewTaskDetails from './pages/User/ViewTaskDetails';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create_task" element={<CreateTask />} />
            <Route path="/admin/users" element={<CreateTask />} />
          </Route>
          
          {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/task_details/:id" element={<ViewTaskDetails />} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
