import React from 'react';
import App from '../App'
import AuthorFeed from '../Components/AuthorFeed'
import Login from '../../../shared/Components/Login';

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
      }
    ]
  }
];

export default routes;