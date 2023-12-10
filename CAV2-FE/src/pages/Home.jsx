import Conversation from "../components/Conversation";
import RightBar from "../components/RightBar";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLazyQuery } from '@apollo/client';
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ConversationSkeleton from "../components/ConversationSkeleton";
import { CollapseConversationAndUserInFoGQL, FristMessageGQL, GetCollapseConversationByConversationIdGQL } from "../constant/GraphQLGQLQuery";
import LeftBar from "../components/LeftBar";
import axios from "axios";



const Home = ()=>{
    const { userId, dispatch } = useContext(AuthContext);
    const [signalrConnection, SetSignalrConnetion] = useState();
    const [isMobileConversationOpen, SetIsMobileConversationOpen] = useState(false);
    const [isRightBarOpen, SetRightBarOpen] = useState(false)
    const [isRightBarOverlayOpen, SetRightBarOverlayOpen] = useState(false)
    const [currentConversationData, SetCurrentConversationData] = useState();
    const [currentConversationId, SetCurrentConversationId] = useState(null);
    const [listConversationData, SetListConversationData] = useState([]);
    const [userInFoData, SetUserInFoData] = useState();
    const [onlineFriends, SetOnlineFriends] = useState([]);

    const [ GetCollapseConversation, {error, loading} ] = useLazyQuery(CollapseConversationAndUserInFoGQL)
    const [ GetFirstMessage ] = useLazyQuery(FristMessageGQL, { fetchPolicy: "no-cache" });
    const [ GetCollapseConversationByConversationId ] = useLazyQuery(GetCollapseConversationByConversationIdGQL)


    const ConnectWS = async (userId) => {
        try{
            const connection = new HubConnectionBuilder()
                .withUrl(`https://localhost:7238/chat?userid=${userId}`)
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiverMessage", (messageRes)=>{   
                GetMessageFromHub(messageRes)
            })

            connection.on("ReceiverOnlineFriend", (onlineFriendsRes)=>{
                GetOnlineFriendFromHub(onlineFriendsRes)
            })

            connection.on("ReceiverOfflineFriend", (res)=>{
                GetOfflineFriendFromHub(res)
            })

            connection.on('ReceiverNewEmoji', (res)=>{
                GetNewEmojiFromHub(res)
            })

            connection.on('ReceiverNewTheme', (res)=>{
                GetNewThemeFromHub(res)
            })

            connection.on('ReceiverDeletedMessage', (res)=>{
                //GetNewThemeFromHub(res)
                GetDeletedMessageFromHub(res)
            })

            connection.onclose(e=>{
                DisconnectWS()
                dispatch({ type: "LOGOUT" })
            })

            await connection.start();

            connection.send("ConnectedEvent", userId);

            SetSignalrConnetion(connection);

        }catch(e){
            console.log("WS Error: ", e);
        }
    }

    const DisconnectWS = async ()=>{
        try{
            await signalrConnection.stop();
        }catch(e){
            console.log(e);
        }
    }

    const GetDeletedMessageFromHub = (res) => {
        SetCurrentConversationData((pre)=>{
            if(pre.conversationId === res.conversationId){
                let newMess = pre.messages.map(item=>{
                    if(item.id === res.messageId){
                        return ({
                            ...item,
                            messageType : "DELETED"
                        })
                    }
                    return item
                })
                return({
                    ...pre,
                    messages : newMess
                })
            }
            return pre
        })

        SetListConversationData((pre)=>{
            let newConverList = pre.map(item =>{
                if(item.conversationId === res.conversationId && item.lastMessage.id === res.messageId){
                    return{
                        ...item,
                        lastMessage : {
                            ...item.lastMessage,
                            messageType : "DELETED"
                        }
                    }
                }
                return item
            })
            return newConverList
        })
    }

    const GetOfflineFriendFromHub = (res)=>{
        SetOnlineFriends(onlineFriends.filter(x=>x.friendId !== res))
    }

    const GetOnlineFriendFromHub = (res) => {
        SetOnlineFriends([res, ...onlineFriends])
    }

    const GetNewThemeFromHub = (res) => {
        console.log(res);
        SetCurrentConversationData((pre)=>{
            if(pre.conversationId === res.conversationId){
                return({
                    ...pre,
                    conversationTheme : res
                })
            }
            return pre;
        })
    }

    const GetNewEmojiFromHub = (res) => {
        
        SetCurrentConversationData((pre)=>{
            if(pre.conversationId === res.conversationId){
                return({
                    ...pre,
                    quickMessage : res.newEmoji
                })
            }
            return pre;
        })
    }

    const ChangeEmoji = (newEmoji) => {
        try{
            let changeRequest = {
                SenderId : userId,
                ConversationId : currentConversationId,
                NewEmoji : newEmoji
            }

            signalrConnection.send('ChangeEmoji', changeRequest)

            SetCurrentConversationData((pre)=>{
                return({
                    ...pre,
                    quickMessage : newEmoji
                })
            })
        }catch(e){
            console.log(e);
        }
    }

    const ChangeTheme = (newTheme) => {
        try{
            let changeRequest = {
                SenderId : userId,
                ConversationId : currentConversationId,
                NewThemeId : newTheme.id
            }

            signalrConnection.send('ChangeTheme', changeRequest)

            SetCurrentConversationData((pre)=>{
                return({
                    ...pre,
                    conversationTheme : newTheme
                })
            })


        }catch(e){
            console.log(e);
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
            if(prevData.some(z=>z.conversationId === messageRes.conversationId)){
                let indexchange = 0;
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
                if(indexchange !== 0){
                    const item = update.splice(indexchange, 1)[0];
                    return ([item,...update])
                }
                return ([...update]);
            }else{
                var newListConver;
                GetCollapseConversationByConversationId({variables: {"userId" : userId, "conversationId" : messageRes.conversationId}}).then((getres)=>{
                    newListConver = ([
                        { 
                            ...getres.data.GetCollapseConversationByConversationId,
                            lastMessage : messageRes
                        },
                        ...prevData
                    ])
                    console.log(newListConver);
                    SetListConversationData(newListConver)
                }).catch(()=>{
                    newListConver = prevData
                })
                console.log(newListConver);

                return prevData
                
            }
        })
    }

    const ChangeAvatarImage = (newImagePath) =>{
        SetUserInFoData(pre=>{
            return({
                ...pre,
                profileImagePath: newImagePath
            })
        })
    }

    const DeleteMessage = async (converId, messId) =>{
        let obj = {
            senderId : userId,
            conversationId : converId,
            messageId : messId
        }
        try{
            await signalrConnection.invoke('DeleteMessage', obj ).then(()=>{
                SetCurrentConversationData((pre)=>{
                    let newMess = pre.messages.map(item=>{
                        if(item.id === messId){
                            return ({
                                ...item,
                                messageType : "DELETED"
                            })
                        }
                        return item
                    })
                    return({
                        ...pre,
                        messages : newMess
                    })
                })

                SetListConversationData((pre)=>{
                    console.log(pre, obj);
                    let newConverList = pre.map(item =>{
                        if(item.conversationId === obj.conversationId && item.lastMessage.id === obj.messageId){
                            return{
                                ...item,
                                lastMessage : {
                                    ...item.lastMessage,
                                    messageType : "DELETED"
                                }
                            }
                        }
                        return item
                    })
                    return newConverList
                })
            }).catch((e)=>{
                console.log(e);
            })


        }catch(e){
            console.log(e);
        }
    }


    useEffect(()=>{
        ConnectWS(userId);
        GetCollapseConversation({variables: {"userId" : userId}}).then((resdata)=>{
            SetListConversationData(resdata.data.GetCollapseConversations);
            SetUserInFoData(resdata.data.GetUserById);
            SetOnlineFriends(resdata.data.GetOnlineFriends);
        })
    },[]);

    useEffect(()=>{
        if(currentConversationId !== null && currentConversationId !== 0){
            GetFirstMessage({variables: {"conversationId" : currentConversationId}}).then((res)=>{
                SetCurrentConversationData(res.data.GetFirstMessages)

                if(!listConversationData.some(x=>x.conversationId === res.data.GetFirstMessages.conversationId)){
                    SetListConversationData([res.data.GetFirstMessages, ...listConversationData])
                }
            })
            
        }
    }, [currentConversationId])

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
            HandleUpdateStateAfterSubmitMessage(message)
        }else{
            let message = {
                messageType: "QUICK",
                content: "Emoji Message",
                senderId: userId,
                conversationId: currentConversationId,
                sendAt: new Date(),
                filePath : currentConversationData.quickMessage,
                fileSize : 0,
            }
            HandleUpdateStateAfterSubmitMessage(message)
        }
    }

    const submitImageAndFileMessage = (event, type) =>{
        var file = event.target.files[0];

        const formData = new FormData();
        formData.append("File", file);
        formData.append("ConversationId", currentConversationId)
        if(type === "FILE" && file.type.startsWith('image/')){
            type = 'IMAGE'
        }else if(file.type.startsWith("audio/")){
            type = "AUDIO"
        }else if(file.type.startsWith("video/")){
            type = "VIDEO"
        }

        axios.post('File/attachment', formData).then((res)=>{
            let message = {
                messageType: type,
                content: file.name,
                senderId: userId,
                conversationId: currentConversationId,
                sendAt: new Date(),
                filePath : res.data,
                fileSize : file.size,
            }
            HandleUpdateStateAfterSubmitMessage(message)
        }).catch((e)=>{
            console.log(e);
        })
    }

    const submitGifAndStickerMessage = (filePath, type) => {
        let message = {
            messageType: type,
            content: type,
            senderId: userId,
            conversationId: currentConversationId,
            sendAt: new Date(),
            filePath : filePath,
            fileSize : 0,
        }
        HandleUpdateStateAfterSubmitMessage(message)
    }

    const HandleUpdateStateAfterSubmitMessage = async (message) => {
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
            if(indexchange !== 0){
                const item = update.splice(indexchange, 1)[0];
                return ([item,...update])
            }
            return ([...update]);
        })
    }

    const HandleOpenConversation = (conversationId) =>{
        if(window.innerWidth <= 768){
            SetIsMobileConversationOpen(true);
        }else{
            SetIsMobileConversationOpen(false)
        }
        SetCurrentConversationId(conversationId)
        SetRightBarOverlayOpen(false)
    }

    const HandleOpenRightBar = () =>{
        if(!isRightBarOpen && !isRightBarOverlayOpen){
            if(window.innerWidth <= 1024){
                SetRightBarOverlayOpen(true)
            }else{
                SetRightBarOpen(true)
            }
        }else{
            SetRightBarOpen(false)
            SetRightBarOverlayOpen(false)
        }
    }

    if(loading) return (
        <div className="h-screen flex items-center">
            <div role="status" className="mx-auto">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>)
    if(error) {
        console.log(error);
    }

    return (
        <div className={`flex flex-row overflow-hidden font-mono`}>
            <LeftBar
                userInFoData={userInFoData}
                onlineFriends={onlineFriends}
                listConversationData={listConversationData}
                currentConversationId={currentConversationId}
                HandleOpenConversation={HandleOpenConversation}
                SetCurrentConversationId={SetCurrentConversationId}
                DisconnectWS={DisconnectWS}
                ChangeAvatarImage={ChangeAvatarImage}
            />
            <div className="flex flex-1 md:p-3 rounded-2xl h-screen">
                {
                (currentConversationData && currentConversationData.conversationId === currentConversationId ) ? 
                    <Conversation 
                        state={SetIsMobileConversationOpen}
                        isMobileCOnversationOpen={isMobileConversationOpen}
                        firstMessageData = {currentConversationData}
                        currentConversationId = {currentConversationId}
                        submitTextAndQuickMessage = {SubmitTextAndQuickMessage}
                        onlineFriends={onlineFriends}
                        submitImageAndFileMessage = {submitImageAndFileMessage}
                        submitGifAndStickerMessage={submitGifAndStickerMessage}
                        SetRightBarOpen={HandleOpenRightBar}
                        DeleteMessage={DeleteMessage}
                        SetCurrentConversationData={SetCurrentConversationData}
                    />
                    :
                    <ConversationSkeleton/>
                }
            </div>
            <div className="hidden lg:flex h-screen rounded-xl">
                {(currentConversationData && isRightBarOpen) && 
                <RightBar 
                    data={currentConversationData}
                    ChangeEmoji={ChangeEmoji}
                    ChangeThemeFn={ChangeTheme}
                    CloseState={SetRightBarOpen}
                />}
            </div>
            {(currentConversationData && isRightBarOverlayOpen) && 
                <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 font-mono z-20">
                    <RightBar 
                        data={currentConversationData}
                        ChangeEmoji={ChangeEmoji}
                        ChangeThemeFn={ChangeTheme}
                        CloseState={SetRightBarOverlayOpen}
                    />
                </div>
            }
        </div>
    )
}

export default Home
