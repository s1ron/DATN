import { useQuery } from "@apollo/client";
import { GetSystemImagesGQL } from "../constant/GraphQLGQLQuery";

const GifPanel = ({submitGifAndStickerMessage, SetOpenGifPanel}) =>{
    const {data, loading, error} = useQuery(GetSystemImagesGQL, {variables: {"type": "GIF"}})


    return(
        <div className="rounded-2xl bg-slate-200 w-3/4 md:w-1/2 max-h-96 absolute bottom-0 mb-12 overflow-y-scroll custom_scroll border-2 border-gray-500">
            {data?.GetSystemImages?.map((x, index)=>{
                return(
                    <div key={index} >
                        <img className="p-2 cursor-pointer" src={`${process.env.REACT_APP_BASEURL}${x.filePath}`} loading="lazy" alt="" 
                            onClick={()=>{
                                console.log(x);
                                submitGifAndStickerMessage(x.filePath, x.type)
                                SetOpenGifPanel(false)
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default GifPanel;