import React from 'react';
import App from '../App'
import SignUpForm from '../Components/SignUp'
import Login from '../Components/Login'
import Feed from '../Components/Feed'

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Feed />
      },
      {
        path: "/sign-up",
        element: <SignUpForm />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ]
  }
];

export default routes;