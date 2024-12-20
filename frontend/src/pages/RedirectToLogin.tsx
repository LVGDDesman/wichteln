import { PropsWithChildren, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function RedirectToLogin({ children }: PropsWithChildren) {
    const [cookies] = useCookies(["user"]);
    const navigate = useNavigate();

    useEffect(() => {
        cookies.user ? 0 : navigate("/login");
    });

    return children;
}
