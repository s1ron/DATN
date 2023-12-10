import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { CheckValidHttpUrl } from '../constant/CheckValidHttpUrl';


const CollapseConversation = ({data, clickState, currentConversationId, isOnline})=>{
    
    const { userId } = useContext(AuthContext);
    let conversationData;
    if(data.isGroup){
        conversationData = {
            conversationId : data.conversationId,
            conversationName : data.conversationName,
            imagePath : data.conversationImagePath,
            isBlock : data.isBlock,
            lastMessage: data.lastMessage == null ? "" : data.lastMessage.messageType === "DELETED" ? "Deleted message" : data.lastMessage.content,
            timelastMessage : data.lastMessage == null ? "" : data.lastMessage.sendAt,
        }
    }else{
        const par = data.participantUser.find(x=> x.userId !== userId);
        conversationData = {
            conversationId : data.conversationId,
            conversationName : par.nickName == null ? par.firstName + ' ' + par.lastName : par.nickName,
            imagePath : !par.profileImagePath ? "./img/no-avartar.jpg" : CheckValidHttpUrl(par.profileImagePath) ? par.profileImagePath : `${process.env.REACT_APP_BASEURL}${par.profileImagePath}`,
            isBlock : data.isBlock,
            lastMessage: data.lastMessage == null ? "" : data.lastMessage.messageType === "DELETED" ? "Deleted message" : data.lastMessage.content,
            timelastMessage : data.lastMessage == null ? "" : data.lastMessage.sendAt,
        }
    }

    var isCurrent = currentConversationId === conversationData.conversationId;
    return(
        <div className={`${isCurrent?"md:bg-white ":""}flex flex-row items-center p-2 m-1 box-content h-12 bg-transparhent hover:bg-white rounded-3xl hover:cursor-pointer`}
            onClick={() => clickState(conversationData.conversationId)}>
            <div className="flex relative">
                <img className="w-12 rounded-full aspect-square border-2 border-slate-300" src={conversationData.imagePath} alt="avartar" />
                <div className={`${isOnline?"":"hidden "}absolute bg-green-700 rounded-full w-3.5 h-3.5 border-2 border-white border-solid bottom-0 right-0`}></div>
            </div>
            <div className="w-12 grow flex flex-col opacity-70 pl-3">
                <h4 className="leading-4 font-bold whitespace-nowrap text-ellipsis overflow-hidden">{conversationData.conversationName}</h4>   
                <p className="leading-4 text-sm whitespace-nowrap text-ellipsis overflow-hidden w-full">{`${data?.lastMessage?.senderId === userId ? "You: " : ""}${conversationData.lastMessage}`}</p> 
            </div>

            {data.lastMessage &&
                <div className="mr-0 w-10 opacity-70">
                    <span className="text-xs">{GetTimeDiffToString(conversationData.timelastMessage)}</span>
                </div>
            }
        </div>
    )
}

const GetTimeDiffToString = (date) => {
    const now = new Date();
    const a = new Date(date)
    const diff = (now - a) / 1000;
    if(a.getDate() === now.getDate()){
        if(diff < 3600) return `${(diff/60).toFixed()} min ago`;
        return `${(diff/3600).toFixed()} hour ago`
    }
    if(diff/(3600*24) <= 7) return `${(diff/(3600*24)).toFixed()+1} day ago`

    return `${a.getDate()} / ${a.getMonth()}`
}


export default CollapseConversation;