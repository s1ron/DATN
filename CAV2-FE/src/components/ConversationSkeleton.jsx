import MessageBarSkeleton from "./MessageBarSkeleton";
import { Skeleton } from "@mui/material";

const ConversationSkeleton = ()=>{
    const isMobileCOnversationOpen = false;
    return(
        <div className={`${isMobileCOnversationOpen ? "fixed inset-0 rounded-none z-10 md:relative" : "hidden md:flex"} bg-white h-full md:w-full md:rounded-2xl box-border flex flex-col custom_box_shadow`}>
            <div className="flex flex-row border-b-2 p-3">
                <div className="w-9 aspect-square opacity-50 hover:bg-slate-300 rounded-full mr-2 md:hidden">
                    <svg className="w-6 h-6 m-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </div>
                <div className="flex-1 flex flex-row">
                    <Skeleton variant="circular" width={36} height={36}/>
                    <div className="flex flex-col h-9 pl-3">
                        <Skeleton width={100}/>
                        <Skeleton width={70} height={16}/>
                    </div>
                </div>
                <div className="w-9 aspect-square opacity-50 hover:bg-slate-300 rounded-full">
                    <svg className="w-6 h-6 m-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                    </svg>
                </div>
            </div>
            <div className="flex-1 custom_scroll overflow-auto flex flex-col max-h-full">
                <div className="flex flex-row m-2 gap-2 mt-auto">
                    <Skeleton className="mt-auto" variant="circular" width={28} height={28}/>
                    <Skeleton className="w-2/6 h-12" variant="rounded" height={49}/>
                </div>
                <div className="flex flex-row m-2 gap-2">
                    <Skeleton className="mt-auto" variant="circular" width={28} height={28}/>
                    <Skeleton className="w-3/6 h-12" height={56}/>
                </div>
                <div className="flex flex-row-reverse mr-2 pr-3">
                    <Skeleton className="w-1/2" variant="rounded" height={290}/>
                </div>
                <div className="flex flex-row-reverse m-2 pr-3">
                    <Skeleton className="w-2/5 h-12" height={56}/>
                </div>
                <div className="flex flex-row m-2 gap-2">
                    <Skeleton className="mt-auto" variant="circular" width={28} height={28}/>
                    <Skeleton className="w-3/6 h-12" height={56}/>
                </div>
            </div>
            <div className="p-3">
                <MessageBarSkeleton/>
            </div>
        </div>
    )
}

export default ConversationSkeleton;