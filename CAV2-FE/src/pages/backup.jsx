import UserInfo from "../components/UserInfo";
import SearchBar from "../components/SearchBar";
import OnlineUser from "../components/OnlineUser";
import CollapseConversation from "../components/CollapseConversation";
import Conversation from "../components/Conversation";
import RightBar from "../components/RightBar";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLazyQuery } from '@apollo/client';
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ConversationSkeleton from "../components/ConversationSkeleton";
import { CollapseConversationAndUserInFoGQL, FristMessageGQL } from "../constant/GraphQLGQLQuery";




const Home = ()=>{
    const { userId } = useContext(AuthContext);
    const [signalrConnection, SetSignalrConnetion] = useState();
    const [isMobileConversationOpen, SetIsMobileConversationOpen] = useState(false);
    const [currentConversationData, SetCurrentConversationData] = useState();
    const [currentConversationId, SetCurrentConversationId] = useState(null);
    const [listConversationData, SetListConversationData] = useState();
    const [userInFoData, SetUserInFoData] = useState();
    const [onlineFriends, SetOnlineFriends] = useState();

    const [ GetCollapseConversation, {error, loading} ] = useLazyQuery(CollapseConversationAndUserInFoGQL)
    const [ GetFirstMessage ] = useLazyQuery(FristMessageGQL, { fetchPolicy: "no-cache" });

    const ConnectWS = async (userId) => {
        console.log("WS Connecting...");
        try{
            const connection = new HubConnectionBuilder()
                .withUrl(`https://localhost:7238/chat?userid=${userId}`)
                .configureLogging(LogLevel.Information)
                .build();

            await connection.start();
            SetSignalrConnetion(connection);

            connection.on("ReceiverMessage", (messageRes)=>{   
                GetMessageFromHub(messageRes)
                console.log(messageRes);
            })

        }catch(e){
            console.log("WS Error: ", e);
        }
    }

    const GetMessageFromHub = (messageRes)=>{
        SetCurrentConversationData((prevData)=>{
            if (prevData?.conversationId === messageRes.conversationId){
                return ({
                    ...prevData,
                    messages : [messageRes, ...prevData.messages]
                })
            }
            return prevData
        })
        SetListConversationData(prevData=>{
            let indexchange = 0;
            console.log("doi last mess");
            const update = prevData.map((data, index)=>{
                if(data.conversationId === messageRes.conversationId){
                    indexchange = index
                    return ({
                        ...data,
                        lastMessage: messageRes
                    })
                }
                return data
            })
            console.log(indexchange);
            if(indexchange !== 0){
                const item = update.splice(indexchange, 1)[0];
                console.log(indexchange);
                return ([item,...update])
            }
            return ([...update]);
        })
    }
    
    useEffect(()=>{
        ConnectWS(userId);
        GetCollapseConversation({variables: {"userId" : userId}}).then((resdata)=>{
            SetListConversationData(resdata.data.GetCollapseConversations);
            SetUserInFoData(resdata.data.GetUserById);
            SetOnlineFriends(resdata.data.GetOnlineFriends);
        })
    },[])

    useEffect(()=>{
        if(currentConversationId !== null){
            GetFirstMessage({variables: {"conversationId" : currentConversationId}}).then((res)=>{
                SetCurrentConversationData(res.data.GetFirstMessages)
            })
        }
    }, [currentConversationId])

    if(loading) return (
        <div className="text-center items-center justify-center flex flex-col mx-auto">
            <div role="status" className="">
                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>)
    if(error) {
        console.log(error);
    }

    const sendMessage = async (message)=>{
        try{
            let daw;
            await signalrConnection.invoke('SendMessage', message ).then((res)=>{
                daw = res;
            }).catch((e)=>{
                console.log(e);
            })
            return daw
        }catch(e){
            console.log(e);
        }
    }

    const SubmitTextAndQuickMessage = async (text) => {
        if(!text.isEmpty()){
            let message = {
                messageType: "TEXT",
                content: text,
                senderId: userId,
                conversationId: currentConversationId,
                sendAt: new Date(),
                filePath : "",
                fileSize : 0,
            }
            
            const ressendmess = await sendMessage(message)
            message = {
                ...message,
                id: ressendmess.id,
                messageReaction: null,
                sendAt: ressendmess.sendAt           
            }
            SetCurrentConversationData((prevData)=>({
                ...prevData,
                messages : [message, ...prevData.messages]
            }))
            SetListConversationData(prevData=>{
                let indexchange = 0;
                const update = prevData.map((data, index)=>{
                    if(data.conversationId === currentConversationId){
                        indexchange = index
                        return ({
                            ...data,
                            lastMessage: message
                        })
                    }
                    return data
                })
                console.log(indexchange);
                if(indexchange !== 0){
                    const item = update.splice(indexchange, 1)[0];
                    console.log(indexchange);
                    return ([item,...update])
                }
                return ([...update]);
            })
        }
    }

    const HandleOpenConversation = (conversationId) =>{
        if(window.innerWidth <= 768){
            SetIsMobileConversationOpen(true);
        }else{
            SetIsMobileConversationOpen(false)
        }
        SetCurrentConversationId(conversationId)
    }

    // return(
    //     <UserDetailOverlay user={userInFoData}/>
    // )

    return (
        <div className={`flex flex-row overflow-hidden font-mono`}>
            <div className="flex flex-col h-screen w-full md:w-72 xl:w-96">
                <UserInfo data={userInFoData}/>
                <SearchBar/>
                <div className="custom_scroll flex flex-row overflow-auto border-b-2">
                    {onlineFriends?.map((item, index)=>{
                        return(
                            <OnlineUser key={index} imgPath={item.profileImagePath} name={`${item.firstName} ${item.lastName}`}/>
                        )
                    })}
                </div>
                <div className="custom_scroll bg-transparent flex-1 max-h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                    {listConversationData?.map((x, index) =>{
                        return(
                            <CollapseConversation
                                data={x}
                                key={index}
                                currentConversationId = {currentConversationId}
                                clickState={HandleOpenConversation}
                                isOnline={true}
                            />
                        )
                    })}
                </div>
            </div>
            
            <div className="flex flex-1 md:p-3 rounded-2xl h-screen">
                {
                currentConversationData ? 
                    <Conversation 
                        state={SetIsMobileConversationOpen}
                        isMobileCOnversationOpen={isMobileConversationOpen}
                        firstMessageData = {currentConversationData}
                        currentConversationId = {currentConversationId}
                        submitTextAndQuickMessage = {SubmitTextAndQuickMessage}
                    />
                    :
                    <ConversationSkeleton/>
                }
            </div>
            <div className="hidden xl:flex m-3 ml-0 custom_box_shadow rounded-xl">
                {currentConversationData && <RightBar data={currentConversationData}/>}
            </div>
        </div>
    )
}

export default Home



<div className="mt-3">
<div className="flex flex-row justify-center mb-3">
    <div className="flex flex-row border-2 border-white rounded-xl">
        <div className={`cursor-pointer w-10 flex items-center justify-center m-0.5 rounded-lg ${typeFriendsTab === 'friend' ? "bg-white" : ""}`}
            onClick={()=>HandleChooseType('friend')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        </div>
        <div className={`cursor-pointer w-10 flex items-center justify-center m-0.5 rounded-lg ${typeFriendsTab === 'findfriend' ? "bg-white" : ""}`}
            onClick={()=>HandleChooseType('findfriend')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
        </div>
    </div>
</div>

{typeFriendsTab === 'friend' && <FriendsList/>}

</div>

<div className="flex flex-row w-3/4 mx-auto">
                <div className={`w-1/2 text-center p-1 cursor-pointer rounded-l-2xl ${activeTab === "conversations" ? "border-t-4 border-green-500 bg-white" : "bg-slate-100 hover:bg-white"}`}
                    onClick={()=>HandleChangeTab("conversations")}
                >
                    Conversations
                </div>
                <div className={`w-1/2 text-center p-1 cursor-pointer rounded-r-2xl ${activeTab === "friends" ? "border-t-4 border-green-500 bg-white" : "bg-slate-100 hover:bg-white"}`}
                    onClick={()=>HandleChangeTab("friends")}
                >
                    Friends
                </div>
            </div>