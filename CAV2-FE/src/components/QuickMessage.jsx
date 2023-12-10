import { CheckValidHttpUrl } from "../constant/CheckValidHttpUrl"

const QuickMessage = ({avartarImage, DeleteMessage, message, userId})=>{
    var own = message?.senderId === userId
    var image = !avartarImage ? "./img/no-avartar.jpg" : CheckValidHttpUrl(avartarImage) ? avartarImage : `${process.env.REACT_APP_BASEURL}${avartarImage}`
    return(
        <div className={`${own?"flex-row-reverse":"flex-row"} justify-start flex w-full px-2 gap-1 group/message`}>
            <div className={`${own?"hidden":""} h-7 w-7 rounded-full mt-auto`}>
                <img className="rounded-full" src={image} alt="" />
            </div>

            <div className="rounded-xl">
                <img className="h-12 rounded-xl" src={`${process.env.REACT_APP_BASEURL}${message.filePath}`} alt="imagePath" />
            </div>
            <div className="flex flex-row my-auto invisible group-hover/message:visible">
                <p className="text-[10px] opacity-60 text-center">{message.sendAt.slice(0, 10)}<br/>{message.sendAt.slice(11, 19)}</p>
                <button className={`${own?"hidden":""} relative group/react`}>
                    <div className="absolute bottom-6 right-[-36px] border-2 hidden group-focus/react:flex z-10 rounded-xl flex-row gap-1 bg-white">
                        <div className="hover:bg-slate-200 rounded-lg">❣️</div>
                        <div className="hover:bg-slate-200 rounded-lg">👍</div>
                        <div className="hover:bg-slate-200 rounded-lg">😢</div>
                        <div className="hover:bg-slate-200 rounded-lg">😂</div>
                    </div>
                    <svg className="w-5 h-5 opacity-50 hover:bg-slate-300 rounded-full p-0.5 box-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                </button>
                <button className={`${own?"":""} relative group/moreopts`}>
                    <div className="absolute bottom-6 right-[-12px] w-14 border-2 hidden group-focus/moreopts:block z-10 rounded-xl bg-white">
                        <div className={`${own?"":"hidden"} hover:bg-slate-200 rounded-lg`}
                            onClick={()=>{
                                DeleteMessage(message.conversationId, message.id)
                            }}
                        >Delele</div>
                        <div className="hover:bg-slate-200 rounded-lg">Pin</div>
                    </div>
                    <svg className="w-5 h-5 opacity-50 hover:bg-slate-300 rounded-full p-0.5 box-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>
            </div>
        </div>

    )
}

export default QuickMessage