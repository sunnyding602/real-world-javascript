import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import {createBrowserRouter, RouterProvider, Route, Link, Router} from "react-router-dom";
import Home from "./components/Home";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/home",
      element: <Home/>,
    },
  ]);


function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
