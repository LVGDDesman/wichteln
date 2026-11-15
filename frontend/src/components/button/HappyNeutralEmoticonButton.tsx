import { HTMLAttributes } from "react";
import { ToggleEmoticonButton } from "./ToggleEmoticonButton";

interface HappyNeutralEmoticonButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle">{
    onToggle:(toggled:boolean)=>void
}

export function HappyNeutralEmoticonButton({onToggle,...props}:HappyNeutralEmoticonButtonProps){
    return <ToggleEmoticonButton defaultEmoticon="😐" toggleEmoticon="🤣" onToggle={onToggle} {...props}/>
}