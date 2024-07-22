import React from 'react';
import App from '../App'
import AuthorFeed from '../Components/AuthorFeed'
import Login from '../../../shared/Components/Login';
import SignUpForm from '../../../shared/Components/SignUp';

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AuthorFeed />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/sign-up",
        element: <SignUpForm requester='author'/>
      }
    ]
  }
];

export default routes;