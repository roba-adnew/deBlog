import React from 'react';
import App from '../App'
import SignUpForm from '../Components/SignUp'
import Login from '../Components/Login'

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <SignUpForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default routes;