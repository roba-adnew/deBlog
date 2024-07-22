import React from 'react';
import App from '../App'
import EditFeed from '../Components/AuthorFeed'
import Login from '../../../shared/Components/Login';

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <EditFeed />
      },
      {
        path: "/login",
        element: <Login />
      }
    ]
  }
];

export default routes;