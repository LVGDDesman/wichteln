import { useTranslation } from "react-i18next"
import WichtelMann from "../../assets/santa.svg"
import { InputWithLabel } from "../../components/inputs/InputWithLabel"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { loginUser } from "../../utils/communication/loginRequests"
import { LoadingSpinner } from "../../assets/loading-spinner"

export default function Login() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [cookies, setCookies] = useCookies(["user"])
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    function login() {
        setLoading(true)
        loginUser(username, password)
            .then((jwt: string) => setCookies("user", jwt))
            .catch((err) => setErrorMessage(err.response?.data?.message))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src={WichtelMann} className="mx-auto h-40 w-auto" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-xmastext">
                        {t("Logge dich ein")}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            login()
                            e.preventDefault()
                        }}
                    >
                        <InputWithLabel
                            label={t("Username")}
                            onValueChange={setUsername}
                        />
                        <InputWithLabel
                            label={t("Password")}
                            type="password"
                            labelAddendum={t("vergessen?")}
                            onValueChange={setPassword}
                        />
                        {errorMessage && (
                            <div className="text-red-600">{t("LoginFail")}</div>
                        )}
                        <div>
                            <button className="flex w-full justify-center rounded-md bg-xmasprim px-3 py-1.5 text-sm/6 font-semibold text-xmastext shadow-sm hover:text-xmastext hover:bg-xmasacc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xmasacc">
                                {loading ? <LoadingSpinner /> : t("Einloggen")}
                            </button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-xmastext">
                        {t("Teilnahmefrage")}
                        <a
                            onClick={() => {
                                navigate("/register")
                            }}
                            className="font-semibold text-xmasprim hover:text-xmasacc"
                        >
                            {t("Teilnahmelink")}
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
