import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet
} from "react-router-dom";

import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  return(<>
  <Navbar/>
  <Outlet />
  {/* <Footer/> */}
  </>)
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/",
    element: <Layout/>,
    children:[
    {
      path: "/login",
      element: <Login/>
    },
    // {
    //   path: "/register",
    //   element: <Register/>
    // },
    ]
  },
]);

function App() {
  return <div>
    <RouterProvider router={router}/>
  </div>;
}

export default App;
