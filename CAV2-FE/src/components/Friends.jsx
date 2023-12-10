import { useState } from "react"
import FriendsList from "./FriendsList"
import FindUsersByKeyword from "./FindUsersByKeyword"
import FriendsRequest from "./FriendsRequest"

const Friends = ({SetCurrentConversationId, ChangeAvatarImage, DisconnectWS}) => {
    const [typeFriendsTab, SetTypeFriendsTab] = useState("friend")
    const HandleChooseType = (type) => {
        if(typeFriendsTab !== type){
            SetTypeFriendsTab(type)
        }
    }

    return(
        <div className="flex flex-col w-full flex-1">
            <div className="flex flex-row justify-center mb-3">
                <div className="flex flex-row border-2 border-white rounded-xl">
                    <div className={`cursor-pointer w-10 flex items-center justify-center m-0.5 rounded-lg ${typeFriendsTab === 'friend' ? "bg-white" : ""}`}
                        onClick={()=>HandleChooseType('friend')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                    </div>
                    <div className={`cursor-pointer w-10 flex items-center justify-center m-0.5 rounded-lg ${typeFriendsTab === 'friendRequest' ? "bg-white" : ""}`}
                        onClick={()=>HandleChooseType('friendRequest')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>

                    <div className={`cursor-pointer w-10 flex items-center justify-center m-0.5 rounded-lg ${typeFriendsTab === 'findfriend' ? "bg-white" : ""}`}
                        onClick={()=>HandleChooseType('findfriend')}
                    >
                        <div className="w-6 h-6">
                            <FindFriendIcon/>
                        </div>
                    </div>
                </div>
            </div>
            {typeFriendsTab === 'friend' && 
                <FriendsList
                    SetCurrentConversationId={SetCurrentConversationId}
                />
            }
            {typeFriendsTab === 'friendRequest' && <FriendsRequest/>}
            {typeFriendsTab === 'findfriend' && 
                <FindUsersByKeyword
                    SetCurrentConversationId={SetCurrentConversationId}
                    ChangeAvatarImage={ChangeAvatarImage}
                    DisconnectWS={DisconnectWS}
                />
            }
        </div>





    )
}

export default Friends

const FindFriendIcon = ()=>{

    return(
        <svg
            className="pt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="22"
            viewBox="0 0 24 22"
        >
            <g fill="none" stroke="#000" strokeLinejoin="round">
                <path
                    strokeLinecap="round"
                    strokeWidth="18"
                    d="M855.284 322.937c-9.627-17.882-28.827-33.414-52.592-40.468 13.258-8.914 22.06-24.063 22.06-41.29 0-27.398-22.225-49.656-49.677-49.656-27.396 0-49.622 22.258-49.622 49.657 0 17.226 8.747 32.375 22.06 41.289-24.095 7.11-43.46 22.968-52.922 41.18"
                    transform="matrix(.071 0 0 .07143 -45.433 -8.797)"
                ></path>
                <path
                    strokeWidth="18"
                    d="M903.585 257.586c0 71.094-57.598 128.789-128.675 128.789-71.022 0-128.62-57.695-128.62-128.79 0-71.148 57.598-128.788 128.62-128.788 71.077 0 128.675 57.64 128.675 128.789zm0 0"
                    transform="matrix(.071 0 0 .07143 -45.433 -8.797)"
                ></path>
                <path
                    strokeLinecap="round"
                    strokeWidth="18"
                    d="M877.674 339.672l92.037 83.289"
                    transform="matrix(.071 0 0 .07143 -45.433 -8.797)"
                ></path>
            </g>
        </svg>
    )
}