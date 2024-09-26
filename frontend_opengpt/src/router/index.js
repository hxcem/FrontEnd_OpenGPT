import ChatApp from "../pages/ChatApp";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ChatApp />
    },
    {
        path: "/test",
        element: <div>test</div>
    }
])

export default router;