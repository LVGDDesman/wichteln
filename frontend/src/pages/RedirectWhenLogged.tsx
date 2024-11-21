import { PropsWithChildren, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function RedirectWhenLogged({ children }: PropsWithChildren) {
    const [cookies] = useCookies(["user"]);
    const navigate = useNavigate();

    useEffect(() => {
        cookies.user ? navigate("/wichteln") : 0;
    });

    return children;
}
