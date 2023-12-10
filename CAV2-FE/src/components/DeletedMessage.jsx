import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl";

const DeletedMessage = ({own, avartarImage, messageTheme, sendAt})=>{
    var image = !avartarImage ? "./img/no-avartar.jpg" : CheckValidHttpUrl(avartarImage) ? avartarImage : `${process.env.REACT_APP_BASEURL}${avartarImage}`
    return(
        <div className={`${own?"flex-row-reverse":"flex-row"} justify-start flex w-full px-2 gap-1 group/message`}>
            <div className={`${own?"hidden":""} h-7 w-7 rounded-full mt-auto`}>
                <img className="rounded-full" src={image} alt="" />
            </div>
            <p className={`${own? messageTheme?.ownMessageColor : messageTheme?.friendMessageColor} text-sm p-2 rounded-2xl max-w-4/5 h-fit min-w-0 break-all opacity-70`} 
                style={{wordWrap: "break-word"}}>
                    Deleted message
            </p>
            <div className="flex flex-row my-auto invisible group-hover/message:visible">
                <p className="text-[10px] opacity-60 text-center">{sendAt.slice(0, 10)}<br/>{sendAt.slice(11, 19)}</p>
            </div>
        </div>

    )
}

export default DeletedMessage