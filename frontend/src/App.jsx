import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet
} from "react-router-dom";

import Home from "./pages/Home"
import Login from "./pages/Login"
import ResetPassword from "./pages/ResetPassword";
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
    {
      path: "/reset",
      element: <ResetPassword/>
    },
    ]
  },
]);

function App() {
  return <div>
    <RouterProvider router={router}/>
  </div>;
}

export default App;
