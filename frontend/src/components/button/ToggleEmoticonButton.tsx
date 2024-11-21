import { HTMLAttributes, useEffect, useState } from "react"

interface ToggleEmoticonButtonProps extends HTMLAttributes<HTMLDivElement>{
    defaultEmoticon: string
    toggleEmoticon:string
    onToggle:(toggled:boolean) => void 
}

export function ToggleEmoticonButton({defaultEmoticon,toggleEmoticon,onToggle,...props}: ToggleEmoticonButtonProps){
    
    const [toggled,setToggled] = useState(false)

    useEffect(()=>{
        onToggle(toggled)
    },[toggled])

    return <div {...props} onClick={()=>{setToggled(!toggled)}}>{toggled?toggleEmoticon:defaultEmoticon}</div>
}