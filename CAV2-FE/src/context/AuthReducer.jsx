
const AuthReducer = (state, action)=>{
    switch(action.type){
        case "LOGIN" :
            return{
                ...state,
                token: action.payload?.accessToken,
                userId: action.payload?.userId
            }
        case "LOGOUT" :
            return{
                ...state,
                token: null,
                userId: null
            }
        default :
            return state;
    }
}

export default AuthReducer;