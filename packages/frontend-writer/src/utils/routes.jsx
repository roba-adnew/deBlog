import React from 'react';
import App from '../App'
import EditFeed from '../Components/EditFeed'
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
       //   ,{
    //     path: "/new-post",
    //     element: <PostForm />,
    //   }
    ]
  }
];

export default routes;