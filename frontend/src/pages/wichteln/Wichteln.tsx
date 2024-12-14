import { useCookies } from "react-cookie"
import { AddWishCard } from "./cards/AddWishCard"
import { LockedWichteleeCard } from "./cards/LockedWichteleeCard"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { getWichtelEndDate } from "../../utils/communication/wichteleeRequests"
import { OpenWichteleeCard } from "./cards/OpenWichteleeCard"

export function Wichteln() {
    const [cookies, setCookies] = useCookies(["user", "date"])
    const { t } = useTranslation()
    const [endDate, setEndDate] = useState("")

    //at start determine when is endate, so we can determine what to show
    useEffect(() => {
        var end = cookies.date
        if (end) {
            setEndDate(end)
        } else {
            fetchEnddate()
        }
    }, [])

    function fetchEnddate() {
        getWichtelEndDate(cookies.user).then((date) => {
            setCookies("date", date)
            setEndDate(date)
        })
    }

    function isBefore() {
        if (!endDate) {
            return true
        }
        return new Date(endDate) > new Date()
    }

    function isAfter() {
        return !isBefore()
    }

    return (
        <>
            <div className="text-center p-10 text-xmastext">
                <h1 className="font-bold text-4xl mb-4">
                    {isBefore() ? t("Wünsch") : t("Schenk")}
                </h1>
            </div>

            <section
                id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
            >
                <AddWishCard disabled={isAfter()} />
                {isBefore() ? <LockedWichteleeCard /> : <OpenWichteleeCard />}
            </section>
        </>
    )
}
