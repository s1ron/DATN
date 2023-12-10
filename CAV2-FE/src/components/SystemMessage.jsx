

const SystemMessage = ({text}) => {

    return(
        <div className="flex flex-row h-fit">
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 flex-1 my-auto"/>
            <p className="w-fit max-w-4/5 text-xs">{text}</p>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 flex-1 my-auto"/>
        </div>
    )
}

export default SystemMessage