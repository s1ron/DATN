import { useState, useContext, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import { CheckValidHttpUrl } from '../constant/CheckValidHttpUrl';
import { AuthContext } from '../context/AuthContext';
import { GetUserAndFriendStatusGQL } from '../constant/GraphQLGQLQuery';
import { useLazyQuery } from '@apollo/client';
import axios from 'axios';


const UserDetailOverlay = ({ friendId, openState, SetCurrentConversationId, ChangeAvatarImage, DisconnectWS }) => {

    const { userId, dispatch } = useContext(AuthContext);
    const [ GetUser ] = useLazyQuery(GetUserAndFriendStatusGQL, { fetchPolicy: "no-cache" });
    const [user, SetUser] = useState();
    const [changePasswordOpen, SetChangePasswordOpen] = useState(false);
    const [infoCardOpen, SetInfoCardOpen] = useState(false);
    const imageAvartar = !user?.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(user?.profileImagePath) ? user?.profileImagePath : `${process.env.REACT_APP_BASEURL}${user?.profileImagePath}`
    const AvatarImgRef = useRef();

    useEffect(()=>{
        GetUser({variables : {"userId" : userId, "friendId": friendId}}).then((res)=>{
            SetUser(res.data?.GetUserAndFriendStatus)
        })
    },[])

    var avatarFile;

    const AvatarInputChange = (e) => {
        var file = e.target.files[0];
        
        if(file){
            AvatarImgRef.current.src = URL.createObjectURL(file)
            avatarFile = file
        }
    }

    const SubmitAvatar = () =>{
        const formData = new FormData();
        formData.append("File", avatarFile);
        formData.append("UserId", userId)

        axios.post('File/avatar', formData).then((res)=>{
            ChangeAvatarImage(res.data)
            SetUser(pre=>{
                return({
                    ...pre,
                    profileImagePath: res.data
                })
            })
        })
    }

    const SendFriendRequest = async () =>{
        try{
            const res = await axios.post('Friend/sendFriendRequest', {
                'senderId' : userId,
                'receiverId' : friendId
            })
            SetUser((pre)=>{
                return ({
                    ...pre,
                    friendStatus : {
                        ...pre.friendStatus,
                        isSendingRequest : true,
                        friendRequestId : res.data
                    }
                })
            })

        }catch(err){
            console.log(err);
        }
    }

    const GetOrCreateConversation = async () =>{
        //console.log("send req");
        try{
            const res = await axios.post('Conversation/getOrCreateConversation', {
                'senderId' : userId,
                'receiverId' : friendId
            })
            SetCurrentConversationId(res.data)

        }catch(err){
            console.log(err);
        }
    }

    const AcceptFriend = async (isaccept) => {
        try{
            const res = await axios.post('Friend/acceptFriend', {
                'friendRequestId' : user.friendStatus.friendRequestId,
                'isAccept' : isaccept
            })
            SetUser((pre)=>{
                return ({
                    ...pre,
                    friendStatus : {
                        isFriend : isaccept,
                        isReceiverRequest : false,
                        friendRequestId : res.data,
                        isSendingRequest : false
                    }
                })
            })

        }catch(err){
            console.log(err);
        }
    }

    const RemoveFriend = async () => {
        try{
            await axios.post('Friend/removeFriends', {
                'senderId' : userId,
                'receiverId' : friendId
            })
            SetUser((pre)=>{
                return ({
                    ...pre,
                    friendStatus : {
                        ...pre.friendStatus,
                        isFriend : false,
                    }
                })
            })
        }catch(e){
            console.log(e);
        }
    }
    

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
                <img className="w-24 h-24 rounded-3xl border-4 border-white relative" src={imageAvartar} alt="" />
            </div>
            <div className='ml-9'>
                <p className='text-lg '>{`${user?.firstName} ${user?.lastName}`}</p>
                <p className=''>{user?.profileDescription}</p>
            </div>
            <div className='flex items-center justify-center gap-3 mt-3'>
                {userId !== friendId &&
                    <button className='flex flex-row bg-green-400 p-1 rounded-xl'
                        onClick={()=>{
                            GetOrCreateConversation()
                            openState(false)
                        }}
                    >
                        Message  
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                    </button>
                }
                {(userId !== friendId && user?.friendStatus?.isFriend) &&
                    <button className='flex flex-row bg-green-400 p-1 rounded-xl'>
                        Friends
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                            onClick={()=>{
                                RemoveFriend()
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                }

                {(userId !== friendId && !user?.friendStatus?.isFriend && user?.friendStatus?.isReceiverRequest && !user?.friendStatus?.isSendingRequest) && 
                    <div className="flex flex-row gap-2">
                        <svg className="bg-green-500 rounded-full p-1 box-content w-6 h-6 hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            onClick={(e)=>{
                                e.stopPropagation();
                                AcceptFriend(true)
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <svg className="bg-red-500 rounded-full p-1 box-content w-6 h-6 hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            onClick={(e)=>{
                                e.stopPropagation();
                                AcceptFriend(false)
                            }} 
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                }

                {(userId !== friendId && !user?.friendStatus?.isFriend && !user?.friendStatus?.isReceiverRequest && !user?.friendStatus?.isSendingRequest) && 
                    <button className='flex flex-row bg-green-400 p-1 rounded-xl'
                        onClick={()=>{
                            SendFriendRequest()
                        }}
                    >
                        Add friend
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </button>
                }
                {(userId !== friendId && !user?.friendStatus?.isFriend && !user?.friendStatus?.isReceiverRequest && user?.friendStatus?.isSendingRequest) && 
                    <button className='flex flex-row bg-green-400 p-1 rounded-xl'>
                        Sending request
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                            onClick={()=>{
                                AcceptFriend(false)
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                } 
            </div>
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
                        <p>{`Name: ${user?.firstName} ${user?.lastName}`}</p>
                        <p>{`Email: ${user?.email}`}</p>
                        <p>{`Dob: ${user?.dob?.slice(0,10)}`}</p>
                        <p>{`PhoneNumber: ${user?.phoneNumber}`}</p>
                        <button className='mx-auto bg-fuchsia-400 p-1 rounded-xl w-fit justify-center'>
                            Update
                        </button>
                    </div>
                </div>
            }

            {userId === friendId &&
                <div className='flex items-center justify-center gap-3 mt-3'>
                    <button className='flex flex-row bg-pink-300 p-1 rounded-xl'
                        onClick={()=>{
                            SetChangePasswordOpen(!changePasswordOpen)
                        }}
                    >
                        Change Avatar
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                </div>
            }

            {changePasswordOpen &&
                <div className='flex items-center justify-center gap-3 mt-3'>
                    <div className='rounded-xl border-2 border-slate-200 p-2 flex flex-col gap-1'>
                        <img className="mx-auto w-24 h-24 rounded-3xl border-4 border-white relative" ref={AvatarImgRef} src={imageAvartar} alt="" />
                        <div className='gap-2 flex'>
                            <input 
                                type="file"
                                accept='image/*'
                                id='inputImage'
                                className='hidden'
                                onChange={(e)=>{AvatarInputChange(e)}}
                            />
                            <label htmlFor="inputImage" className='mx-auto bg-cyan-300 p-1 rounded-xl w-fit justify-center'>
                                Choose
                            </label>
                            <button className='mx-auto bg-cyan-300 p-1 rounded-xl w-fit justify-center'
                                onClick={()=>{
                                    SubmitAvatar()
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            }

            {userId === friendId &&
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
            }

        </div>
    </div>
  );
};

export default UserDetailOverlay;
