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
// import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

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
    {
      path: "/cart",
      element: <Cart/>
    },
    {
      path: "/orders",
      element: <Orders/>
    }
    ]
  },
]);

function App() {
  return <div>
    <RouterProvider router={router}/>
  </div>;
}

export default App;
