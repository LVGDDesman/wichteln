import { useCookies } from "react-cookie"

export function Wichteln() {
    const [cookies, setCookies, removeCookies] = useCookies(["user"])

    return <button onClick={() => removeCookies("user")}>Log out</button>
}
