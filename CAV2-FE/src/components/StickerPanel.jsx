import { useQuery } from "@apollo/client";
import { GetSystemImagesGQL } from "../constant/GraphQLGQLQuery";

const StickerPanel = ({submitGifAndStickerMessage, SetOpenStickerPanel}) =>{
    const {data, loading, error} = useQuery(GetSystemImagesGQL, {variables: {"type": "STICKER"}})


    return(
        <div className="flex flex-row flex-wrap rounded-2xl bg-slate-200 w-1/2 max-h-96 absolute bottom-0 right-0 mb-12 overflow-y-scroll custom_scroll border-2 border-gray-500">
            {data?.GetSystemImages?.map((x, index)=>{
                return(
                    <div className=" w-1/2" 
                        key={index} >
                        <img className="cursor-pointer aspect-square mx-auto p-1" src={`${process.env.REACT_APP_BASEURL}${x.filePath}`} loading="lazy" alt="" 
                            onClick={()=>{
                                submitGifAndStickerMessage(x.filePath, x.type)
                                SetOpenStickerPanel(false)
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default StickerPanel;