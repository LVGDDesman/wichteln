import { useTranslation } from "react-i18next"
import WichtelMann from "../../assets/santa.svg"
import { InputWithLabel } from "../../components/inputs/InputWithLabel"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { registerUser } from "../../utils/communication/loginRequests"
import { useCookies } from "react-cookie"
import { LoadingSpinner } from "../../assets/loading-spinner"

export default function Register() {
    const [cookies, setCookies] = useCookies(["user"])
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    function register() {
        setLoading(true)
        registerUser(email, username, password)
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
                        {t("Registrier dich für die Teilnahme")}
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        method="POST"
                        className="space-y-6"
                        onSubmit={(e) => {
                            register()
                            e.preventDefault()
                        }}
                    >
                        <InputWithLabel
                            label={t("E-Mail")}
                            type="email"
                            onValueChange={setEmail}
                        />
                        <InputWithLabel
                            label={t("Username")}
                            onValueChange={setUsername}
                        />
                        <InputWithLabel
                            label={t("Password")}
                            type="password"
                            onValueChange={setPassword}
                        />

                        {errorMessage && (
                            <div className="text-red-600">
                                {t("RegisterFail")}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-xmasprim px-3 py-1.5 text-sm/6 font-semibold text-xmastext shadow-sm hover:text-xmastext hover:bg-xmasacc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xmasacc"
                            >
                                {loading ? <LoadingSpinner /> : t("Teilnehmen")}
                            </button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-xmastext">
                        {t("Loginfrage")}
                        <a
                            onClick={() => {
                                navigate("/login")
                            }}
                            className="font-semibold text-xmasprim hover:text-xmasacc"
                        >
                            {t("Loginlink")}
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
