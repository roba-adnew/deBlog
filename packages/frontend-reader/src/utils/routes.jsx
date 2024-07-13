import React from 'react';
import App from '../App'
import SignUpForm from '../Components/SignUp'

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <SignUpForm />,
  },
];

export default routes;