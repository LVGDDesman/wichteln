import { HTMLAttributes } from "react";
import { ToggleEmoticonButton } from "./ToggleEmoticonButton";

interface HappyNeutralEmoticonButtonProps extends HTMLAttributes<HTMLDivElement>{
    onToggle:(toggled:boolean)=>void
}

export function HappyNeutralEmoticonButton({onToggle,...props}:HappyNeutralEmoticonButtonProps){
    return <ToggleEmoticonButton defaultEmoticon="😐" toggleEmoticon="🤣" onToggle={onToggle}/>
}