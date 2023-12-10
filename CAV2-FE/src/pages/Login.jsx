
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { TextField } from '@mui/material';



const Login = () =>{
    const [isRegisterOpen, SetRegisterOpen] = useState(false)

    return(
        <>{isRegisterOpen ? <RegisterComponent
            SetRegisterOpen={SetRegisterOpen}
        /> : <LoginComponent
            SetRegisterOpen={SetRegisterOpen}
        />}</>
    )

}

export default Login;

const LoginComponent = ({SetRegisterOpen}) => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { dispatch } = useContext(AuthContext);
    const [loging, SetLoging] = useState(false);
    const [errMess, SetErrMess] = useState("");


    const onGooogleLoginSuccess = (credentialResponse) =>{
        GoogleLoginCall(credentialResponse);
    }
    const onGooogleLoginError = (error) =>{
        console.log(error);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        UserNamePassLoginCall();
    }

    const GoogleLoginCall = async (credentialResponse) =>{
        try{
            
            const res = await axios.post('/Auth/GoogleLogin', {
                'credential' : credentialResponse.credential
            })
            dispatch({ type: "LOGIN", payload: res.data})
        }catch (err){
            console.log(err.response.data);
        }
    }

    const UserNamePassLoginCall = async () => {
        try{
            SetLoging(true);
            const res = await axios.post("/Auth/authenticate", {
                "username": usernameRef.current.value,
                "pass": passwordRef.current.value
            });
            dispatch({ type: "LOGIN", payload: res.data})
        }catch (err) {
            SetLoging(false);
            if(!err.response){
                SetErrMess(err.code)
            }else if(err.response.data){
                SetErrMess(err.response.data)
            }else{
                SetErrMess("Login failure")
            }
            console.log(err);
        }
    }
    return(
        <section className="bg-[url('../public/img/gradient-login-bg.jpg')]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen md:h-screen lg:py-0">
                <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 bg-white backdrop-blur-lg bg-opacity-50">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Welcome back
                        </h1>
                        <div className='justify-self-center flex justify-center'>
                            
                            <GoogleOAuthProvider clientId="925058501432-phs4e38ds1883dno0nut6dvh2ntbmlfa.apps.googleusercontent.com">
                                <div className='mx-auto'>
                                    <GoogleLogin
                                        auto_select = {false}
                                        onSuccess={credentialResponse => onGooogleLoginSuccess(credentialResponse)}
                                        onError={error => onGooogleLoginError(error)}
                                    />
                                </div>
                            </GoogleOAuthProvider>
                        </div>

                        
                        <div className="flex flex-row gap-4">
                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 flex-1 my-auto"/>
                            <div className="opacity-50">or</div>
                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 flex-1 my-auto"/>
                        </div>

                        <form className="space-y-4 md:space-y-6" onSubmit={e=>{handleSubmit(e)}}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                                <input ref={usernameRef} autoComplete="off" type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="admin" required=""/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input ref={passwordRef} autoComplete="off" type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                            </div>
                            <div className="text-center text-red-600">{errMess}</div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</p>
                            </div>
                            <button type="submit" disabled={loging} className={`${!loging ? "bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700" : "bg-red-500"} w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>Sign in</button>
                            <span className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <p className="cursor-pointer inline-block font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    onClick={()=>{
                                        SetRegisterOpen(true)
                                    }}
                                >Sign up</p>
                            </span>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

const RegisterComponent = ({SetRegisterOpen}) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const usernameRef = useRef();
    const genderRef = useRef();
    const phoneNumberRef = useRef();
    const birthdayRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const [err, SetErr] = useState("")
    const [isRegisterLoading, startRegister] = useState(false)

    const HandleRegister =async ()=>{
        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const username = usernameRef.current.value;
        const gender = genderRef.current.value;
        const phoneNumber = phoneNumberRef.current.value;
        const birthday = birthdayRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if(firstName === ""){
            SetErr("Please enter first name")
        }else if(lastName === ""){
            SetErr("Please enter last name")
        }else if(username === ""){
            SetErr("Please enter username")
        }else if(phoneNumber === ""){
            SetErr("Please enter phone number")
        }else if(password === ""){
            SetErr("Please enter password")
        }else if(password.length < 8){
            SetErr("Please enter valid password")
        }else if(birthday === ""){
            SetErr("Please enter birthday")
        }else if(!emailRegex.test(email)){
            SetErr("Please enter valid email")
        }else{
            console.log(isRegisterLoading);
            SetErr("")
            startRegister(true)
            let registerModel = {
                firstName : firstName,
                lastName : lastName,
                gender : gender,
                userName : username,
                dob : birthday,
                email : email,
                phoneNumber : phoneNumber,
                password : password
            }
            SetRegisterOpen(false)
            try{
                await axios.post("/Auth/register", registerModel);
            }catch(e){
                startRegister(false)
                console.log(e);
                SetErr(e.response.data)
            }
        }

    }
    return (
        <section className="bg-[url('../public/img/gradient-login-bg.jpg')]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen md:h-screen lg:py-0">
                
                <div className="re w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 bg-white backdrop-blur-lg bg-opacity-50">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign up
                        </h1>
                        <p className='text-xs text-red-600 text-center'>{err}</p>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row gap-2'>
                                <TextField fullWidth size="small" label="First name" inputRef={firstNameRef}/>
                                <TextField fullWidth size="small" label="Last name" inputRef={lastNameRef}/>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <TextField fullWidth size="small" label="Username" inputRef={usernameRef}/>
                                <select ref={genderRef} className="block p-2 bg-transparent text-sm text-gray-900 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500"                                >
                                    <option value="OTHER">Other</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>
                            
                            <div className='flex flex-row gap-2'>
                                <TextField fullWidth size="small" label="Phone number" inputRef={phoneNumberRef}/>
                                <input ref={birthdayRef} className='w-48 bg-transparent text-gray-900 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500' type="date"/>
                            </div>

                            <TextField fullWidth size="small" label="Email" inputRef={emailRef}/>
                            <TextField fullWidth size="small" label="Password" type='password' inputRef={passwordRef}/>

                            <button type="button" disabled={isRegisterLoading} className={`${!isRegisterLoading ? "bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700" : "bg-red-500"} w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                                onClick={()=>{
                                    HandleRegister()
                                }}
                            >Sign up</button>

                            <span className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <p className="cursor-pointer inline-block font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    onClick={()=>{
                                        SetRegisterOpen(false)
                                    }}
                                >Login here</p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

