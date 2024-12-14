import { LoadingSpinner } from "../../../assets/loading-spinner"
import { InputWithLabel } from "../../../components/inputs/InputWithLabel"
import XmasCard from "../../../assets/cards/XmasCard.png"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import {
    getWichtelee,
    WichteleeData,
} from "../../../utils/communication/wichteleeRequests"

export function OpenWichteleeCard() {
    const [cookies] = useCookies(["user"])
    const [wish, setWish] = useState("")
    const [address, setAddress] = useState("")
    const [wichtelee, setWichtelee] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        fetchWichtelee()
    }, [])

    function fetchWichtelee() {
        setLoading(true)
        getWichtelee(cookies.user)
            .then((data: WichteleeData) => {
                setWish(data.wish)
                setAddress(data.address)
                setWichtelee(data.username)
            })
            .catch((err) => setErrorMessage(err.response?.data?.message))
            .finally(() => setLoading(false))
    }

    return (
        <div
            className={`w-72 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl`}
            style={{
                backgroundImage: `url(${XmasCard})`,
                backgroundSize: "cover",
            }}
        >
            <div className="h-60 object-cover rounded-t-xl" />

            <div className="px-4 py-3 w-72">
                <form
                    method="POST"
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                >
                    <p className="text-lg font-bold text-black truncate block capitalize">
                        <InputWithLabel
                            label={t("Wunsch")}
                            onValueChange={setWish}
                            defaultValue={wish}
                            disabled={true}
                        />
                    </p>
                    <p className="text-lg font-bold text-black truncate block capitalize">
                        <InputWithLabel
                            label={t("Adresse")}
                            onValueChange={setAddress}
                            defaultValue={address}
                            disabled={true}
                        />
                    </p>
                    <div className="text-red-600 ">
                        {errorMessage && (
                            <div className="text-red-600">{errorMessage}</div>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-xmasprim px-3 py-1.5 text-sm/6 font-semibold text-xmastext shadow-sm hover:text-xmastext hover:bg-xmasacc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xmasacc"
                            disabled={true}
                        >
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                wichtelee + t("DeinWichtelee")
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
