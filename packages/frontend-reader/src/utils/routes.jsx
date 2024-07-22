import React from 'react';
import App from '../App'
import SignUpForm from '../../../shared/Components/SignUp'
import Login from '../../../shared/Components/Login'
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
        element: <SignUpForm requester='reader'/>,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ]
  }
];

export default routes;