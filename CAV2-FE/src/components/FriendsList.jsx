import { useQuery } from "@apollo/client";
import { GetFriendsGQl } from "../constant/GraphQLGQLQuery";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl";
import UserDetailOverlay from "./UserDetailOverlay";
import axios from "axios";



const FriendsList = ({SetCurrentConversationId}) => {
    const { userId } = useContext(AuthContext);
    const {loading, error, data} = useQuery(GetFriendsGQl, {variables : {"userId" : userId}})
    const [friendAfterFilter, SetFriendAfterFilter] = useState(data?.GetFriends)
    const fillerFriend = (keyword) => {
        SetFriendAfterFilter(data.GetFriends.filter(x=>`${x.firstName.toLowerCase()} ${x.lastName.toLowerCase()}`.includes(keyword.toLowerCase())))
    }
    useEffect(()=>{
        SetFriendAfterFilter(data?.GetFriends)
    }, [data?.GetFriends])
    if(loading) return(
        <div className="h-full flex items-center">
            <div role="status" className="mx-auto">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
    return (
        <>
            <div className="flex flex-row">
                <input onChange={(e)=>{fillerFriend(e.target.value.trim());}} className="indent-3 justify-self-center h-9 mx-10 rounded-full grow focus:outline-0" placeholder="Search" type="text" autoComplete="off" />
            </div>
            <div className="custom_scroll bg-transparent h-[calc(100vh-191px)] max-h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                {friendAfterFilter?.map((item, index) => {
                    //console.log(item);
                    return (
                    <FriendsListComponent
                        key={index}
                        data={item}
                        SetCurrentConversationId={SetCurrentConversationId}
                    />)
                })}
            </div>
        </>
    )
}

const FriendsListComponent = ({data, SetCurrentConversationId}) => {
    const [isOpenUserDetailOverlay, SetOpenUserDetailOverlay] = useState(false)
    const imageAvartar = !data?.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(data?.profileImagePath) ? data?.profileImagePath : `${process.env.REACT_APP_BASEURL}${data?.profileImagePath}`
    const { userId } = useContext(AuthContext);

    const GetOrCreateConversation = async () =>{
        //console.log("send req");
        try{
            const res = await axios.post('Conversation/getOrCreateConversation', {
                'senderId' : userId,
                'receiverId' : data.friendId
            })
            console.log(res.data);
            SetCurrentConversationId(res.data)

        }catch(err){
            console.log(err);
        }
    }
    
    return(
        <>
            {isOpenUserDetailOverlay && <UserDetailOverlay friendId={data.friendId} openState={SetOpenUserDetailOverlay} SetCurrentConversationId={SetCurrentConversationId}/>}
            <div className={`flex flex-row items-center p-2 m-1 box-content h-10 bg-transparhent hover:bg-white rounded-3xl hover:cursor-pointer`}
                onClick={() => {
                    SetOpenUserDetailOverlay(true)
                    console.log("info");
                }}
            >
                <div className="flex relative">
                    <img className="w-10 rounded-full aspect-square border-2 border-slate-300" src={imageAvartar} alt="avartar" />
                </div>
                <div className="w-10 grow flex flex-col opacity-70 pl-3">
                    <h4 className="leading-4 font-bold whitespace-nowrap text-ellipsis overflow-hidden">{data?.firstName + " " + data?.lastName}</h4>
                </div>
                <div className="pr-1 opacity-70 hover:bg-slate-300 p-1 rounded-full"
                    onClick={(e)=>{
                        e.stopPropagation();
                        console.log("chat");
                        GetOrCreateConversation()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                </div>
            </div>
        </>
    )
}

export default FriendsList;