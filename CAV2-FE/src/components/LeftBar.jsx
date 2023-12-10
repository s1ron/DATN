import UserInfo from "./UserInfo"
import SearchBar from "./SearchBar"
import OnlineUser from "./OnlineUser"
import CollapseConversation from "./CollapseConversation"
import { useState, useContext } from "react"
import Friends from "./Friends"
import { AuthContext } from "../context/AuthContext"

const LeftBar = ({userInFoData, onlineFriends, 
        listConversationData, currentConversationId, 
        HandleOpenConversation, SetCurrentConversationId,
        DisconnectWS,ChangeAvatarImage
    }) =>{

    const [activeTab, setActiveTab] = useState('conversations');

    const { userId } = useContext(AuthContext);

    const HandleChangeTab = (type) =>{
        if(type !== activeTab){
            setActiveTab(type)
        }
    }

    return(
        <div className="flex flex-col h-screen w-full md:w-72 xl:w-96">
            <div className="h-fit">
                <UserInfo data={userInFoData}
                    DisconnectWS={DisconnectWS}
                    ChangeAvatarImage={ChangeAvatarImage}
                />
            </div>

            <div className="flex flex-row w-3/4 md:w-5/6 xl:w-3/4 mx-auto rounded-md bg-slate-300">
                <div className={`min-w-fit w-1/2 text-center m-1 p-1 cursor-pointer rounded-md ${activeTab === "conversations" ? "bg-white text-blue-500" : "hover:bg-slate-200 text-slate-600"}`}
                    onClick={()=>HandleChangeTab("conversations")}
                >
                    Conversations
                </div>
                <div className={`w-1/2 text-center m-1 p-1 cursor-pointer rounded-md ${activeTab === "friends" ? "bg-white text-blue-500" : "hover:bg-slate-200 text-slate-600"}`}
                    onClick={()=>HandleChangeTab("friends")}
                >
                    Friends
                </div>
            </div>

            {activeTab === 'conversations' && (
                <>
                    <div className="custom_scroll flex flex-row overflow-auto border-b-2">
                        {onlineFriends?.map((item, index)=>{
                            return(
                                <OnlineUser 
                                    key={index} 
                                    imgPath={item.profileImagePath}
                                    name={`${item.firstName} ${item.lastName}`}
                                    SetCurrentConversationId={SetCurrentConversationId}
                                    friendId={item.friendId}
                                />
                            )
                        })}
                    </div>
                    <SearchBar/>
                    <div className="custom_scroll bg-transparent flex-1 max-h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                        {listConversationData?.map((x, index) =>{
                            let isOnline = x.isGroup ? false : onlineFriends.some(z=>z.friendId === x.participantUser.find(x=>x.userId !== userId).userId)
                            return(
                                <CollapseConversation
                                    data={x}
                                    key={index}
                                    currentConversationId = {currentConversationId}
                                    clickState={HandleOpenConversation}
                                    isOnline={isOnline}
                                />
                            )
                        })}
                    </div>
                </>
            )}

            {activeTab === 'friends' && 
                <Friends
                    SetCurrentConversationId={SetCurrentConversationId}
                    ChangeAvatarImage={ChangeAvatarImage}
                    DisconnectWS={DisconnectWS}
                />}
        </div>
    )
}


export default LeftBar