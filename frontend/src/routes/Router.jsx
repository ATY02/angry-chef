import {
    createBrowserRouter,
} from "react-router-dom";
import Chat from "../pages/Chat.jsx";

const chatterbotBaseUrl = 'http://localhost:8001';
const geminiBaseUrl = 'http://localhost:8000';

const Routes = createBrowserRouter([
    {
        path: '/',
        element: '',
    },
    {
        path: '/chatterbot',
        element: <Chat baseUrl={chatterbotBaseUrl}/>,
    },
    {
        path: '/gemini',
        element: <Chat baseUrl={geminiBaseUrl}/>,
    },
]);

export default Routes;
