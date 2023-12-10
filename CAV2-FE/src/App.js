
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";


function App() {

    const { token } = useContext(AuthContext);
    return (
        <>
            {token ? <Home/> : <Login/>}
        </>
        
    );
}

export default App;
