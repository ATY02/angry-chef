import {
    createBrowserRouter,
} from "react-router-dom";
import Chat from "../pages/Chat.jsx";
import Home from "../pages/Home.jsx"

const Routes = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/chatterbot',
        element: <Chat/>,
    },
    {
        path: '/gemini',
        element: <Chat/>,
    },
]);

export default Routes;
