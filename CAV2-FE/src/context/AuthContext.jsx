import { useReducer, createContext, useEffect } from "react";
import AuthReducer from "./AuthReducer";

const INIT_STATE = {
    token: null,
    userId: null
}
//console.log(process.env.REACT_APP_BASEURL);

export const AuthContext = createContext(INIT_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INIT_STATE);

    useEffect(()=>{
        //localStorage.setItem("token", state.token)
    },[state])

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                userId: state.userId,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

