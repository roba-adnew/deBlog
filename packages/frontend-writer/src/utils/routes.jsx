import React from 'react';
import App from '../App'
import EditFeed from '../Components/EditFeed'
import WriterLogin from '../Components/WriterLogin'

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
        element: <WriterLogin />,
      }
       //   ,{
    //     path: "/new-post",
    //     element: <PostForm />,
    //   }
    ]
  }
];

export default routes;