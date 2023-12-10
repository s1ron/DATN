import { TextareaAutosize } from '@mui/base';
import { useState } from 'react';
import GifPanel from './GifPanel';
import { useEffect } from 'react';
import StickerPanel from './StickerPanel';

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

const MessageBar = ({submitTextAndQuickMessage, submitImageAndFileMessage,
        firstMessageData, currentConversationId,
        submitGifAndStickerMessage
        })=>{
    const [textMessage, SetTextMessage] = useState("")
    const [isOpenStickerPanel, SetOpenStickerPanel] = useState(false)
    const [isOpenGifPanel, SetOpenGifPanel] = useState(false)

    const changeHandle = (value) =>{
        SetTextMessage(value);
    }
    const submit = () =>{
        submitTextAndQuickMessage(textMessage);
        SetTextMessage("")
    }
    
    useEffect(()=>{
        SetOpenGifPanel(false)
    },[currentConversationId])


    
    return(
        <div className="w-full flex flex-row gap-2 relative">
            {isOpenGifPanel &&(
                <GifPanel
                    submitGifAndStickerMessage={submitGifAndStickerMessage}
                    SetOpenGifPanel={SetOpenGifPanel}
                />
            )}
            {isOpenStickerPanel &&(
                <StickerPanel
                    submitGifAndStickerMessage={submitGifAndStickerMessage}
                    SetOpenStickerPanel={SetOpenStickerPanel}
                />
            )}
            <div className='flex flex-col-reverse'>
                {textMessage.isEmpty() ||
                    <div className='p-1 flex flex-col-reverse'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>}
                {textMessage.isEmpty() &&
                    <div className='flex flex-row relative'>
                        <div>
                            <input 
                                type="file"
                                id="inputFile"
                                className='hidden'
                                onChange={(e)=>{submitImageAndFileMessage(e, "FILE")}}
                            />
                            <label htmlFor="inputFile">
                                <svg className="rounded-full w-6 h-6 cursor-pointer hover:bg-slate-200 p-1 box-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                </svg>
                            </label>
                        </div>

                        <div>
                            <input 
                                type="file"
                                accept='image/*'
                                id='inputImage'
                                className='hidden'
                                onChange={(e)=>{submitImageAndFileMessage(e, "IMAGE")}}
                            />
                            <label htmlFor="inputImage" className=''>
                                <svg className="rounded-full w-6 h-6 cursor-pointer hover:bg-slate-200 p-1 box-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </label>
                        </div>

                        <svg className={`${isOpenGifPanel ? "bg-slate-200" : ""} rounded-full w-6 h-6 cursor-pointer hover:bg-slate-200 p-1 box-content`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            onClick={()=>{
                                SetOpenGifPanel(!isOpenGifPanel)
                                if(isOpenStickerPanel){
                                    SetOpenStickerPanel(false)
                                }
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </div>}
            </div>

            
            <div className='flex flex-row bg-slate-200 rounded-2xl flex-1'>
                <TextareaAutosize 
                    style={{resize : 'none'}}
                    className='focus:outline-0 rounded-2xl p-1 pl-2 bg-slate-200 custom_scroll flex-1'
                    placeholder='Message...'
                    maxRows={6}
                    onChange={e=>changeHandle(e.target.value)}
                    spellCheck="false"
                    value={textMessage}
                ></TextareaAutosize>
                <div className="p-0.5 flex flex-col-reverse">
                    <svg className={`${isOpenGifPanel ? "bg-slate-200" : ""} rounded-full w-6 h-6 cursor-pointer hover:bg-white p-0.5 box-content`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        onClick={()=>{
                            SetOpenStickerPanel(!isOpenStickerPanel)
                            if(isOpenGifPanel){
                                SetOpenGifPanel(false)
                            }
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                </div>
            </div>
            <div className='flex flex-col-reverse' onClick={()=>{submit()}}>
                {textMessage.isEmpty() || <svg className="w-8 h-8 hover:bg-slate-300 p-1 rounded-2xl cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>}
                {textMessage.isEmpty() && (
                    firstMessageData?.quickMessage ?
                    <div className='w-8 h-8 hover:bg-slate-300 p-1 rounded-2xl cursor-pointer'>
                        <img src={`${process.env.REACT_APP_BASEURL}${firstMessageData?.quickMessage}`} alt="" />
                    </div>
                    :
                    <svg className="w-8 h-8 hover:bg-slate-300 p-1 rounded-2xl cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                )}
            </div>
        </div>
        
    )
}

export default MessageBar;


