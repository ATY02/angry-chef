import {
    createBrowserRouter,
} from "react-router-dom";
import Chat from "../pages/Chat.jsx";

const Routes = createBrowserRouter([
    {
        path: '/',
        element: '',
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
