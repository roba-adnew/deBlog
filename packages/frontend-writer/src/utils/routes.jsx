import React from 'react';
import App from '../App'
import EditFeed from '../Components/EditFeed'

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <EditFeed />
      }
    //   ,{
    //     path: "/new-post",
    //     element: <PostForm />,
    //   }
    //   ,{
    //     path: "/login",
    //     element: <Login />,
    //   },
    ]
  }
];

export default routes;