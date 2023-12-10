import { useLazyQuery } from "@apollo/client";
import { FindUsersByKeywordGQL } from "../constant/GraphQLGQLQuery";
import { useState, useRef } from "react";
import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl";
import UserDetailOverlay from "./UserDetailOverlay";

const FindUsersByKeyword = ({SetCurrentConversationId, ChangeAvatarImage, DisconnectWS}) => {
    const inputKeywordRef = useRef()
    const [ FindUsersQuery ] = useLazyQuery(FindUsersByKeywordGQL, { fetchPolicy: "no-cache" });


    const [userlist, SetUserList] = useState()
    const findUsers = () => {
        if(inputKeywordRef.current.value !== ""){
            FindUsersQuery({variables: {"keyWord" : inputKeywordRef.current.value}}).then(res=>{
                SetUserList(res.data.FindUsersByKeyword)
            })
        }
    }
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-row relative">
                <input ref={inputKeywordRef} className="indent-3 justify-self-center h-9 mx-10 rounded-full grow focus:outline-0" placeholder="Search" type="text" autoComplete="off"/>
                <svg className="w-6 h-6 absolute right-10 p-1 m-0.5 box-content opacity-70 cursor-pointer hover:bg-slate-300 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    onClick={()=>{findUsers()}}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <div className="custom_scroll bg-transparent h-[calc(100vh-191px)] max-h-full flex flex-col overflow-y-scroll overflow-x-hidden">
                {userlist?.map((item, index) => {
                    return (
                        <FriendsListComponent
                            key={index}
                            data={item}
                            SetCurrentConversationId = {SetCurrentConversationId}
                            ChangeAvatarImage={ChangeAvatarImage}
                            DisconnectWS={DisconnectWS}
                        />)
                })}
            </div>
        </div>
    )
}

const FriendsListComponent = ({data, SetCurrentConversationId, ChangeAvatarImage, DisconnectWS}) => {
    const [isOpenUserDetail, SetOpenUserDetail] = useState(false)
    const imageAvartar = !data?.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(data?.profileImagePath) ? data?.profileImagePath : `${process.env.REACT_APP_BASEURL}${data?.profileImagePath}`
    return(
        <div className="h-fit">
            <div className={`flex flex-row items-center p-2 m-1 box-content h-10 bg-transparhent hover:bg-white rounded-3xl hover:cursor-pointer`}
            onClick={() => {
                SetOpenUserDetail(true)
            }}
            >
                <div className="flex relative">
                    <img className="w-10 rounded-full aspect-square border-2 border-slate-300" src={imageAvartar} alt="avartar" />
                </div>
                <div className="w-10 grow flex flex-col opacity-70 pl-3">
                    <h4 className="leading-4 font-bold whitespace-nowrap text-ellipsis overflow-hidden">{data?.firstName + " " + data?.lastName}</h4>
                </div>
            </div>
            {isOpenUserDetail && <UserDetailOverlay
                openState={SetOpenUserDetail}
                friendId={data.id}
                SetCurrentConversationId={SetCurrentConversationId}
                ChangeAvatarImage={ChangeAvatarImage}
                DisconnectWS={DisconnectWS}
            />}
        </div>
    )
}

export default FindUsersByKeyword;