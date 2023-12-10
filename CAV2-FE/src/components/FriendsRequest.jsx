import { useLazyQuery } from "@apollo/client";
import { GetFriendsRequestGQL } from "../constant/GraphQLGQLQuery";
import { useState, useContext, useEffect } from "react";
import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";


const FriendsRequest = () => {
    const { userId } = useContext(AuthContext);
    const [ FindUsers ] = useLazyQuery(GetFriendsRequestGQL, { fetchPolicy: "no-cache" });

    const [userlist, SetUserList] = useState()

    useEffect(()=>{
        FindUsers({variables : {"userId" : userId}}).then((res)=>{
            SetUserList(res.data.GetFriendRequest)
        })
    },[])

    return (
        <div className="custom_scroll bg-transparent h-[calc(100vh-155px)] max-h-full flex flex-col overflow-y-scroll overflow-x-hidden">
            {userlist?.map((item, index) => {
                return (
                <FriendsListComponent
                    key={index}
                    data={item}
                    setItem={SetUserList}
                />)
            })}
        </div>
    )
}

const FriendsListComponent = ({data, setItem}) => {
    const imageAvartar = !data?.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(data?.profileImagePath) ? data?.profileImagePath : `${process.env.REACT_APP_BASEURL}${data?.profileImagePath}`
    
    const AcceptFriend = async (isaccept) => {
        console.log(data);
        try{
            const res = await axios.post('Friend/acceptFriend', {
                'friendRequestId' : data.friendRequestId,
                'isAccept' : isaccept
            })
            console.log(res);
            setItem((pre)=>{
                return pre.filter(x=>x.friendRequestId !== data.friendRequestId)
            })

        }catch(err){
            console.log(err);
        }
    }

    

    return(
        <div className={`flex flex-row items-center p-2 m-1 box-content h-10 bg-transparhent hover:bg-white rounded-3xl hover:cursor-pointer`}
            onClick={() => {
                console.log("info");
            }}
        >
            <div className="flex relative">
                <img className="w-10 rounded-full aspect-square border-2 border-slate-300" src={imageAvartar} alt="avartar" />
            </div>
            <div className="w-10 grow flex flex-col opacity-70 pl-3">
                <h4 className="leading-4 font-bold whitespace-nowrap text-ellipsis overflow-hidden">{data?.firstName + " " + data?.lastName}</h4>
            </div>  
            <div className="flex flex-row gap-2">
                <svg className="bg-green-500 rounded-full p-1 box-content w-6 h-6 hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    onClick={(e)=>{
                        e.stopPropagation();
                        console.log("check v");
                        AcceptFriend(true)
                    }} 
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <svg className="bg-red-500 rounded-full p-1 box-content w-6 h-6 hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    onClick={(e)=>{
                        e.stopPropagation();
                        console.log("check x");
                        AcceptFriend(false)
                    }} 
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
    )
}

export default FriendsRequest;