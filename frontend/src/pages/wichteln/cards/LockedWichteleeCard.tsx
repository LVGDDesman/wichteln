import { useTranslation } from "react-i18next"
import Locked from "../../../assets/cards/Locked.png"
import { useCookies } from "react-cookie"

export function LockedWichteleeCard() {
    const [cookies] = useCookies(["date"])
    const { t } = useTranslation()

    return (
        <div
            className={`w-72 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl`}
            style={{
                backgroundImage: `url(${Locked})`,
                backgroundSize: "cover",
            }}
        >
            <div
                className="object-cover rounded-t-xl"
                style={{ height: "20em" }}
            />

            <div className="px-4 py-3 w-72 text-xmastext">
                <div>{t("Losung")}</div>
                <div>{new Date(cookies.date).toLocaleString("de-DE")}</div>
            </div>
        </div>
    )
}
