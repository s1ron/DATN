import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl"
import axios from "axios"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const OnlineUser = ({imgPath, name, friendId, SetCurrentConversationId})=>{
    const imageAvartar = !imgPath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(imgPath) ? imgPath : `${process.env.REACT_APP_BASEURL}${imgPath}`
    const { userId } = useContext(AuthContext);


    const GetOrCreateConversation = async () =>{
        //console.log("send req");
        try{
            const res = await axios.post('Conversation/getOrCreateConversation', {
                'senderId' : userId,
                'receiverId' : friendId
            })
            console.log(res.data);
            SetCurrentConversationId(res.data)

        }catch(err){
            console.log(err);
        }
    }
    
    return(
        <div className="w-12 h-19 p-3 box-content"
            onClick={()=>{
                //console.log("dawd");
                GetOrCreateConversation()
            }}
        >
            <div className="flex relative">
                <img className="w-12 rounded-full aspect-square border-2 border-slate-300" src={imageAvartar} alt="avartar" />
                <div className={`absolute bg-green-700 rounded-full w-3.5 h-3.5 border-2 border-white border-solid bottom-0 right-0`}></div>
            </div>
            <h4 className="text-xs text-ellipsis overflow-hidden whitespace-nowrap w-12" style={{paddingInlineStart: 0}}>{name}</h4>
        </div>
    )
}

export default OnlineUser