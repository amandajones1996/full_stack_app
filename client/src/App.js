// import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header'
import './App.css'
import './styles/reset.css';
import './styles/global.css';

function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route element={<PrivateRoute />} >
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/update" element={<UpdateCourse />} />
        </Route>
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signout" element={<UserSignOut />} />
        
      </Routes>
    </div>
  );
}

export default App;