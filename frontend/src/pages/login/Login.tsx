import { useTranslation } from "react-i18next";
import WichtelMann from "../../assets/santa.svg";
import { InputWithLabel } from "../../components/inputs/InputWithLabel";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
          <form className="space-y-6">
            <InputWithLabel label={t("Username")} />
            <InputWithLabel
              label={t("Password")}
              type="password"
              labelAddendum={t("vergessen?")}
            />

            <div>
              <button className="flex w-full justify-center rounded-md bg-xmasprim px-3 py-1.5 text-sm/6 font-semibold text-xmastext shadow-sm hover:text-xmastext hover:bg-xmasacc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xmasacc">
                {t("Einloggen")}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm/6 text-xmastext">
            {t("Teilnahmefrage")}
            <a
              onClick={() => {
                navigate("/register");
              }}
              className="font-semibold text-xmasprim hover:text-xmasacc"
            >
              {t("Teilnahmelink")}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
