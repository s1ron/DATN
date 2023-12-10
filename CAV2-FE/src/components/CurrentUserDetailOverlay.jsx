import { useState, useContext } from 'react';
import { TextField } from '@mui/material';
import { CheckValidHttpUrl } from '../constant/CheckValidHttpUrl';
import { AuthContext } from '../context/AuthContext';


const CurrentUserDetailOverlay = ({ user, openState, DisconnectWS }) => {
    console.log(user);

    //const [editedInfo, setEditedInfo] = useState(user);
    const { userId, dispatch } = useContext(AuthContext);
    const [changePasswordOpen, SetChangePasswordOpen] = useState(false);
    const [infoCardOpen, SetInfoCardOpen] = useState(false);
    const imageAvartar = !user.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(user.profileImagePath) ? user.profileImagePath : `${process.env.REACT_APP_BASEURL}${user.profileImagePath}`

return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 font-mono z-20">
        <div className="bg-white w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 p-4 rounded-lg flex flex-col relative">
            <button className='opacity-60 absolute top-6 right-6 bg-slate-200 rounded-full'
                onClick={()=>{
                    openState(false)
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="bg-[url('../public/img/profile-gb.webp')] bg-no-repeat bg-cover h-48 rounded-xl">
            </div>
            <div className='h-24 mt-[-72px] ml-9'>
                <img className="w-24 h-24 rounded-3xl border-4 border-white" src={imageAvartar} alt="" />
            </div>
            <div className='ml-9'>
                <p className='text-lg '>{`${user.firstName} ${user.lastName}`}</p>
                <p className=''>{user?.profileDescription}</p>
            </div>
            {/* <div className='flex items-center justify-center gap-3 mt-3'>
                <button className='flex flex-row bg-green-400 p-1 rounded-xl'>
                    Message  
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                </button>
                <button className='flex flex-row bg-green-400 p-1 rounded-xl'>
                    Add Friend 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </button>
            </div> */}
            <div className='flex items-center justify-center gap-3 mt-3'>
                <button className='flex flex-row bg-blue-300 p-1 rounded-xl'
                    onClick={()=>{
                        SetInfoCardOpen(!infoCardOpen)
                    }}
                >
                    Infomation
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                    </svg>
                </button>   
            </div>

            {infoCardOpen &&
                <div className='flex items-center justify-center gap-3 mt-3'>
                    <div className='rounded-xl border-2 border-slate-200 p-2 flex flex-col gap-1 opacity-70'>
                        <p>{`Name: ${user.firstName} ${user.lastName}`}</p>
                        <p>{`Email: ${user.email}`}</p>
                        <p>{`Dob: ${user.dob.slice(0,10)}`}</p>
                        <p>{`PhoneNumber: ${user.phoneNumber}`}</p>
                        <button className='mx-auto bg-fuchsia-400 p-1 rounded-xl w-fit justify-center'>
                            Update
                        </button>
                    </div>
                </div>
            }

            <div className='flex items-center justify-center gap-3 mt-3'>
                <button className='flex flex-row bg-pink-300 p-1 rounded-xl'
                    onClick={()=>{
                        SetChangePasswordOpen(!changePasswordOpen)
                        console.log("dad");
                    }}
                >
                    Change Password  
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </button>
            </div>

            {changePasswordOpen &&
                <div className='flex items-center justify-center gap-3 mt-3'>
                    <div className='rounded-xl border-2 border-slate-200 p-2 flex flex-col gap-1'>
                        <TextField id="standard-basic" label="Old Password" variant="standard" />
                        <TextField id="standard-basic" label="New Password" variant="standard" />
                        <button className='mx-auto bg-cyan-300 p-1 rounded-xl w-fit justify-center'>
                            Save
                        </button>
                    </div>
                </div>
            }

            <div className='flex items-center justify-center gap-3 mt-3'>
                <button className='flex flex-row bg-red-400 p-1 rounded-xl'
                    onClick={()=>{
                        DisconnectWS()
                        dispatch({ type: "LOGOUT" })
                    }}
                >
                    Logout 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                </button>
            </div>

        </div>
    </div>
  );
};

export default CurrentUserDetailOverlay;
