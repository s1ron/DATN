import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CheckFriendStatusGQL, GetSystemImagesGQL, GetListConversationThemeGQL, GetConversationAttachmentGQL } from "../constant/GraphQLGQLQuery";
import axios from "axios";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";



const RightBar = ({ data, ChangeEmoji, ChangeThemeFn, CloseState })=>{
    const { userId } = useContext(AuthContext);
    let ConvsersationInFo;
    if(data?.isGroup){
        ConvsersationInFo = {
            isGroup : true,
            isMessageRequest : data.isMessageRequest,
            conversationName : data.conversationName,
            conversationImage : data.conversationImagePath ? process.env.REACT_APP_BASEURL+data.conversationImagePath : "./img/group-no-avartar.jpg",
            isBlock : data.isBlock,
            blockBy : data.blockBy,
            userName : ""
        }
    }
    else{
        const par = data.participantUser?.find(x=> x.userId !== userId);
        //console.log(par, userId);
        ConvsersationInFo = {
            friendId : par.userId,
            isGroup : false,
            isMessageRequest : data.isMessageRequest,
            conversationName : par.firstName + ' ' + par.lastName,
            conversationImage : !par.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(par.profileImagePath) ? par.profileImagePath : `${process.env.REACT_APP_BASEURL}${par.profileImagePath}`,
            isBlock : data.isBlock,
            blockBy : data.blockBy,
            userName : par.userName
        }
    }

    return(
        <div className="rounded-2xl flex flex-col w-80 m-3 ml-0 bg-transparent custom_box_shadow">
            <div className="bg-[url('../public/img/bg-gradient.jpg')] bg-no-repeat bg-cover w-full h-28 rounded-t-xl relative">
                <button className='opacity-60 absolute top-3 right-3 bg-slate-200 rounded-full'
                    onClick={()=>{
                        CloseState(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="h-28 visible">
                </div>
                <div className="absolute bottom-[-64px] left-8 w-24 box-content rounded-full border-4 border-white border-solid">
                    <img className="w-24 h-24 rounded-full border-2 border-slate-300" src={ConvsersationInFo.conversationImage} alt="" />
                </div>
            </div>
            <div className="bg-white flex-1 rounded-b-xl flex flex-col overflow-auto">
                <h4 className="mt-16 ml-8 text-xl font-bold w-fit">{ConvsersationInFo.conversationName}</h4>
                <p className="ml-12 text-xs opacity-70">{ConvsersationInFo.userName}</p>
                <div className="overflow-auto">
                    {!data?.isGroup && 
                        <FriendStatusComponent
                            friendId={ConvsersationInFo.friendId}
                        />}
                    <div className="flex flex-row justify-evenly my-3">
                        <div className="flex flex-col cursor-pointer">
                            <svg className="mx-auto w-6 h-6 fill-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                            <p className="text-xs">Favorite</p>
                        </div>
                        <ChangeQuickMessage
                            currentQuickMessage={data.quickMessage}
                            ChangeEmoji={ChangeEmoji}
                        />
                        <ChangeTheme
                            currentThemeId={data?.conversationTheme?.id}
                            ChangeThemeFn={ChangeThemeFn}
                            currentTheme={data?.conversationTheme}
                        />
                    </div>
                    <Accordion>
                        <AccordionSummary>
                            MEDIA
                        </AccordionSummary>
                        <AccordionDetails>
                            <MediaMessage
                                conversationId={data?.conversationId}
                            />
                        </AccordionDetails>

                    </Accordion>
                </div>
            </div>
        </div>
    )
}


export default RightBar

const FriendStatusComponent = ({friendId}) => {
    const { userId } = useContext(AuthContext);
    const [ FriendStatus, SetFriendStatus] = useState({})
    const [ GetFriendStatus ] = useLazyQuery(CheckFriendStatusGQL, {variables : {"userId" : userId, "friendId": friendId}, fetchPolicy: "no-cache"})

    useEffect(()=>{
        GetFriendStatus().then((res)=>{
            SetFriendStatus(res.data?.CheckFriendStatus)
        })
    },[friendId])

    const AcceptFriend = async (isaccept) => {
        try{
            const res = await axios.post('Friend/acceptFriend', {
                'friendRequestId' : FriendStatus.friendRequestId,
                'isAccept' : isaccept
            })

            SetFriendStatus({
                isFriend : isaccept,
                isReceiverRequest : false,
                friendRequestId : res.data,
                isSendingRequest : false
            })
        }catch(err){
            console.log(err);
        }
    }

    const SendFriendRequest = async () =>{
        console.log("send req");
        try{
            const res = await axios.post('Friend/sendFriendRequest', {
                'senderId' : userId,
                'receiverId' : friendId
            })
            SetFriendStatus((pre)=>{
                return ({
                    ...pre,
                    isSendingRequest : true,
                    friendRequestId : res.data
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
            SetFriendStatus((pre)=>{
                return({
                    ...pre,
                    isFriend : false,
                })
            })
        }catch(e){
            console.log(e);
        }
    }

    return(
        <div className="flex items-center justify-center mt-3">
            {FriendStatus?.isFriend &&
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
            {(!FriendStatus?.isFriend && FriendStatus?.isReceiverRequest && !FriendStatus?.isSendingRequest) && 
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
            {(!FriendStatus?.isFriend && !FriendStatus?.isReceiverRequest && !FriendStatus?.isSendingRequest) && 
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
            {(!FriendStatus?.isFriend && !FriendStatus?.isReceiverRequest && FriendStatus?.isSendingRequest) && 
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
    )
}

const ChangeQuickMessage = ({currentQuickMessage, ChangeEmoji}) => {
    const { data } = useQuery(GetSystemImagesGQL, {variables: {"type": "QUICK"}, fetchPolicy: "no-cache"})
    const [isOpen, SetOpen] = useState(false)
    return(
        <div className="">
            <img className="mx-auto h-6 w-6 cursor-pointer" src={`${process.env.REACT_APP_BASEURL}${currentQuickMessage}`} alt="" 
                onClick={()=>{
                    SetOpen(true)
                }}
            />
            <p className="text-xs">Change emoji</p>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 font-mono z-20">
                    <div className="bg-white w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 p-4 rounded-lg flex flex-col relative">
                        <button className='opacity-60 absolute top-6 right-6 bg-slate-200 rounded-full'
                            onClick={()=>{
                                SetOpen(false)
                                console.log("set off");
                            }}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                        <p className="pb-2">Change emoji</p>
                        <div className="w-4/5 flex flex-row gap-3">
                            {data?.GetSystemImages?.map((x, index)=>{
                                return(
                                    <div className={`${x.filePath === currentQuickMessage ? "bg-slate-200" : ""} cursor-pointer hover:bg-slate-200 p-2 rounded-xl h-12 w-12`}
                                        key={index}
                                        onClick={()=>{
                                            if(x.filePath !== currentQuickMessage){
                                                ChangeEmoji(x.filePath)
                                            }
                                            SetOpen(false)
                                        }}
                                    >
                                        <img src={`${process.env.REACT_APP_BASEURL}${x.filePath}`} alt={x.description} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const ChangeTheme = ({currentThemeId, ChangeThemeFn, currentTheme}) => {
    const { data } = useQuery(GetListConversationThemeGQL, {fetchPolicy: "no-cache"})
    const [isOpen, SetOpen] = useState(false)
    return(
        <div className="">
            <div className={`w-6 h-6 rounded-full mx-auto border-2 border-black cursor-pointer ${currentTheme.bgColor}`}
                onClick={()=>{
                    SetOpen(true)
                }}
            >
            </div>
            <p className="text-xs">ChangeTheme</p>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 font-mono z-20">
                    <div className="bg-white w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 p-4 rounded-lg flex flex-col relative">
                        <button className='opacity-60 absolute top-6 right-6 bg-slate-200 rounded-full'
                            onClick={()=>{
                                SetOpen(false)
                            }}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                        <p className="pb-2">Change Theme</p>
                        <div className="w-4/5 flex flex-col gap-3">
                            {data?.GetListConversationTheme?.map((x, index)=>{
                                return(
                                    <div className={`${x.id === currentThemeId ? "bg-slate-200" : ""} cursor-pointer hover:bg-slate-200 p-2 rounded-xl h-10 flex flex-row`}
                                        key={index}
                                        onClick={()=>{
                                            if(x.id !== currentThemeId){
                                                ChangeThemeFn(x)
                                            }
                                            SetOpen(false)
                                        }}
                                    >

                                        <div className={`${x.bgColor} w-6 h-6 rounded-full mx-auto border-2 border-black cursor-pointer`}></div>
                                        <div className={`${x.ownMessageColor} w-6 h-6 rounded-full mx-auto border-2 border-black cursor-pointer`}></div>
                                        <div className={`${x.friendMessageColor} w-6 h-6 rounded-full mx-auto border-2 border-black cursor-pointer`}></div>
                                        <p className="w-32">{x.themeName}</p>

                                        <div className="bg-violet-200 bg-pink-200 bg-blue-500 bg-indigo-400 bg-pink-600 bg-slate-300 bg-white"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const MediaMessage = ({conversationId}) =>{
    const [media, SetMedia] = useState();
    const [GetMedia] = useLazyQuery(GetConversationAttachmentGQL, {variables: {"conversationId": conversationId}})
    useEffect(()=>{
        GetMedia().then((res)=>{
            SetMedia(res?.data?.GetConversationAttachment)
        })

    },[conversationId])
    return(
        <div className="w-full flex flex-row flex-wrap">
            {media?.map((x, index)=>{
                return(
                    <img className="w-1/2 aspect-square p-1 rounded-2xl" key={index} src={process.env.REACT_APP_BASEURL + x.filePath} alt="" />
                )
            })}

        </div>
    )
}