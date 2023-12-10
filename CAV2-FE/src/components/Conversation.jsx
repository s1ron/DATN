import MessageBar from "./MessageBar";
import TextMessage from "./TextMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";
import StickerMessage from "./StickerMessage";
import QuickMessage from "./QuickMessage";
import GifMessage from "./GifMessage";
import SystemMessage from "./SystemMessage";
import VideoMessage from "./VideoMessage";
import AudioMessage from "./AudioMessage";
import DeletedMessage from "./DeletedMessage";
import { GetContinueMessageGQL } from "../constant/GraphQLGQLQuery";
import { useLazyQuery } from "@apollo/client";

const Conversation = ({onlineFriends, isMobileCOnversationOpen, 
        state, firstMessageData, currentConversationId,
        submitTextAndQuickMessage, submitImageAndFileMessage,
        submitGifAndStickerMessage, SetRightBarOpen,
        DeleteMessage, SetCurrentConversationData
        })=>{
    const { userId } = useContext(AuthContext);
    const [hasMoreMessage, SetHasMoreMessage] = useState(true)

    const [GetContinueMessageQuery] = useLazyQuery(GetContinueMessageGQL,{ fetchPolicy: "no-cache" })


    const GetContinueMessage = () =>{
        let lastmessageId = firstMessageData?.messages[firstMessageData?.messages.length-1].id
        GetContinueMessageQuery({variables: {"conversationId" : currentConversationId, "lastMessageId" : lastmessageId}}).then((res)=>{
            SetCurrentConversationData(pre=>{
                if(currentConversationId === pre.conversationId){
                    return({
                        ...pre,
                        messages : [...pre.messages, ...res?.data?.GetContinueMessage]
                    })
                }
                return pre
            })
            if(res?.data?.GetContinueMessage?.length < 15){
                SetHasMoreMessage(false)
            }
        })
    }


    useEffect(()=>{
        if(firstMessageData?.messages?.length < 15){
            SetHasMoreMessage(false)    
        }else{
            SetHasMoreMessage(true)
        }
    }, [currentConversationId]) 

    let ConvsersationInFo;
    let isOnline = false;
    if(firstMessageData?.isGroup){
        ConvsersationInFo = {
            isGroup : true,
            isMessageRequest : firstMessageData.isMessageRequest,
            conversationName : firstMessageData.conversationName,
            conversationImage : firstMessageData.conversationImagePath,
            isBlock : firstMessageData.isBlock,
            blockBy : firstMessageData.blockBy,
            userName : "",
        }
    }
    else{
        const par = firstMessageData.participantUser?.find(x=> x.userId !== userId);
        isOnline = onlineFriends.some(z=>z.friendId === par.userId)
        ConvsersationInFo = {
            isGroup : false,
            isMessageRequest : firstMessageData.isMessageRequest,
            conversationName : par.firstName + ' ' + par.lastName,
            conversationImage : par.profileImagePath,
            isBlock : firstMessageData.isBlock,
            blockBy : firstMessageData.blockBy,
            userName : par.userName
        }
    }

    //const imageAvartar = !firstMessageData?.conversationImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(data?.profileImagePath) ? data?.profileImagePath : `${process.env.REACT_APP_BASEURL}${data?.profileImagePath}`

    return(
        <div className={`${isMobileCOnversationOpen ? "fixed inset-0 rounded-none z-10 md:relative" : "hidden md:flex"} bg-white h-full md:w-full md:rounded-2xl box-border flex flex-col custom_box_shadow`}>
            <div className="flex flex-row border-b-2 p-3">
                <div className="w-9 aspect-square opacity-50 hover:bg-slate-300 rounded-full mr-2 md:hidden"
                    onClick={()=>{state(false)}}>
                    <svg className="w-6 h-6 m-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </div>
                <div className="flex-1 flex flex-row">
                    <div className="relative">
                        <img className="w-9 h-9 aspect-square rounded-full" src="./img/me.jpg" alt="da"/>
                        <div className={`${isOnline?"":"hidden "}absolute bg-green-700 rounded-full w-2.5 h-2.5 border-2 border-white border-solid bottom-0 right-0`}></div>
                    </div>
                    <div className="flex flex-col h-9 pl-3">
                        <p className="leading-5">{ConvsersationInFo.conversationName}</p>
                        <p className="text-xs opacity-50">{isOnline ? "Is Online" : "Not Online"}</p>
                    </div>
                </div>
                <div className="w-9 aspect-square opacity-50 hover:bg-slate-300 rounded-full"
                    onClick={()=>{
                        SetRightBarOpen()
                    }}
                >
                    <svg className="w-6 h-6 m-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                    </svg>
                </div>
            </div>
            <div className={`flex-1 custom_scroll overflow-auto flex flex-col max-h-full pb-2 ${firstMessageData?.conversationTheme?.bgColor}`}>
                <div id="scrollableDiv" className="flex-1" 
                    style={{
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse"
                    }}
                >
                    <InfiniteScroll
                        style={{ display: "flex", flexDirection: "column-reverse" }}
                        inverse={true}
                        next={GetContinueMessage}
                        dataLength={firstMessageData?.messages.length}
                        hasMore={hasMoreMessage}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        className="gap-3"
                    >
                        {firstMessageData?.messages.map((message, index)=>{
                            //console.log(message);
                            switch(message.messageType){
                                case "TEXT":
                                    return(
                                        <TextMessage
                                            key={index}
                                            messageTheme={firstMessageData?.conversationTheme}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            DeleteMessage={DeleteMessage}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "IMAGE":
                                    return(
                                        <ImageMessage
                                            key={index}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            DeleteMessage={DeleteMessage}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "VIDEO":
                                    return(
                                        <VideoMessage
                                            key={index}
                                            DeleteMessage={DeleteMessage}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "AUDIO":
                                    return(
                                        <AudioMessage
                                            key={index}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            DeleteMessage={DeleteMessage}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "FILE":
                                    return(
                                        <FileMessage
                                            key={index}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            DeleteMessage={DeleteMessage}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "QUICK":
                                    return(
                                        <QuickMessage
                                            key={index}
                                            DeleteMessage={DeleteMessage}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "GIF":
                                    return(
                                        <GifMessage
                                            key={index}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            DeleteMessage={DeleteMessage}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "STICKER":
                                    return(
                                        <StickerMessage
                                            key={index}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            DeleteMessage={DeleteMessage}
                                            message={message}
                                            userId={userId}
                                        />
                                    )
                                case "SYSTEM":
                                    return(
                                        <SystemMessage
                                            key={index}
                                            text={message.content}
                                        />
                                    )
                                case "DELETED":
                                    return(
                                        <DeletedMessage
                                            own={userId === message.senderId}
                                            key={index}
                                            messageTheme={firstMessageData?.conversationTheme}
                                            avartarImage={firstMessageData.participantUser.find(x=>x.userId === message.senderId)?.profileImagePath}
                                            sendAt={message.sendAt}
                                        />
                                    )

                                default:
                                    return(
                                        <TextMessage
                                            own={true}
                                            key={index}
                                            text={message.name}
                                        />
                                    )
                                
                            }
                        })}
                    </InfiniteScroll>
                </div>
                
            </div>
            <div className="p-3">
                <MessageBar
                    submitTextAndQuickMessage = {submitTextAndQuickMessage}
                    submitImageAndFileMessage={submitImageAndFileMessage}
                    firstMessageData = {firstMessageData}
                    currentConversationId={currentConversationId}
                    submitGifAndStickerMessage={submitGifAndStickerMessage}
                /> 
            </div>
        </div>
    )
}

export default Conversation;