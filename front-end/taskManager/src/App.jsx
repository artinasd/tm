import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Navigate} from "react-router";

import SignUpForm from "./Components/SignUpForm.jsx";
import LogInForm from "./Components/LogInForm.jsx";
import Layout from "./Components/Layout.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Profile from "./Components/Profile.jsx";
import GroupWorkspace from "./Components/GroupWorkspace.jsx";
import CreateTask from "./Components/CreateTask.jsx";
import TaskList from './Components/TaskList.jsx'
import GroupList from './Components/GroupList.jsx'
import OrganizationList from './Components/OrganizationList.jsx'
import CreateOrganization from './Components/CreateOrganization.jsx'
import OrganizationDetails from './Components/OrganizationDetails.jsx'
import CreateUnit from './Components/CreateUnit.jsx'
import UnitDetails from './Components/UnitDetails.jsx'
import EmployeeManagement from './Components/EmployeeManagement.jsx'
import UnitAddMembers from './Components/UnitAddMembers.jsx' // <--- IMPORT ADDED

// ATTENTION: EVERY MAIN CONTAINER MUST HAVE PY-20

function App() {

    const router = createBrowserRouter([
        {path: '/', element: <Navigate to={'/home/dashboard'} />},

        {path: '/home',
            element: <Layout />,
            children: [
                {path: '/home/dashboard', element: <Dashboard />},
                {path: '/home/profile', element: <Profile />},
                {path: '/home/groups', element: <GroupList />},
                {path: '/home/groups/workspace', element: <GroupWorkspace />},
                {path: '/home/new-task', element: <CreateTask />},
                {path: '/home/tasks', element: <TaskList />},

                // --- Organization Routes ---
                {path: '/home/organizations', element: <OrganizationList />},
                {path: '/home/organizations/create', element: <CreateOrganization />},
                {path: '/home/organizations/:orgCode', element: <OrganizationDetails />},

                // --- Unit Routes ---
                {path: '/home/organizations/:orgCode/units/create', element: <CreateUnit />},
                {path: '/home/organizations/:orgCode/units/:unitCode', element: <UnitDetails />},

                // --- New Route for Adding Members to Unit ---
                {path: '/home/organizations/:orgCode/units/:unitCode/add-members', element: <UnitAddMembers />},

                // --- Employee Management Routes ---
                {path: '/home/organizations/:orgCode/employees/manage', element: <EmployeeManagement />},
                {path: '/home/organizations/:orgCode/units/:unitCode/employees', element: <EmployeeManagement />},
            ]},

        {path: '/sign-up', element: <SignUpForm />},
        {path: '/log-in', element: <LogInForm />},
    ])

    return (
        <RouterProvider router={router} />
    )
}

export default App;