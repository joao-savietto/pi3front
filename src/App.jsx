import { useState } from 'react'

import ErrorPage from './pages/error-page.jsx';

import Root from './pages/root.jsx';
import Login from './pages/login.jsx';
import { Outlet } from "react-router-dom";

import ClassroomList from './pages/classroom-list.jsx';
import StudentList from './pages/student-list.jsx';
import OccurrenceList from './pages/occurrence-list.jsx';
import OccurrenceForm from './pages/occurrence-form.jsx';
import ParentChildrenList from './pages/parent-chuldren-list.jsx';
import ClassroomForm from './pages/classroom-form.jsx';
import StudentForm from './pages/admin-student-form.jsx';
import AdminParentList from './pages/admin-parent-list.jsx';
import ParentForm from './pages/admin.parent-form.jsx';
import AdminTeacherList from './pages/admin-teacher-list.jsx';
import TeacherForm from './pages/admin-teacher-form.jsx';


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminStudentList from './pages/admin-student-list.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Root />,   
        children: [
          {
            path: "prof",
            element: <ClassroomList />,
          },
          {
            path: "prof/students",
            element: <StudentList />,
          },     
          {
            path: "prof/students/occurrences",
            element: <OccurrenceList />,
          },      
          {
            path: "prof/students/occurrences/form",
            element: <OccurrenceForm edit={true} />,
          },    
          {
            path: "prof/students/occurrences/new",
            element: <OccurrenceForm edit={false} />,
          },   
          {
            path: "parent",
            element: <ParentChildrenList />,
          },               
          {
            path: "parent/occurrences",
            element: <OccurrenceList parentMode={true} />,
          },   
          {
            path: "admin/classrooms",
            element: <ClassroomList admin={true} />,
          },             
          {
            path: "admin/classrooms/form/new",
            element: <ClassroomForm />,
          },        
          {
            path: "admin/classrooms/form/edit",
            element: <ClassroomForm edit={true} />,
          },                 
          {
            path: "admin/parents",
            element: <AdminParentList />
          },
          {
            path: "admin/parents/new",
            element: <ParentForm />
          },    
          {
            path: "admin/parents/edit",
            element: <ParentForm edit={true} />
          },                
          {
            path: "admin/students",
            element: <AdminStudentList />,
          },                      
          {
            path: "admin/students/new",
            element: <StudentForm />,
          },
          {
            path: "admin/students/edit",
            element: <StudentForm edit={true} />,
          },                     
          {
            path: "admin/teachers",
            element: <AdminTeacherList />,
          },                   
          {
            path: "admin/teachers/new",
            element: <TeacherForm />,
          },    
          {
            path: "admin/teachers/edit",
            element: <TeacherForm edit={true} />,
          },                    
        ],             
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
