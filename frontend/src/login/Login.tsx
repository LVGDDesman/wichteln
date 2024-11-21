import WichtelMann from "../assets/santa.svg"
import { InputWithLabel } from "../components/inputs/InputWithLabel"

export default function Login() {
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              src={WichtelMann}
              className="mx-auto h-40 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-xmasbeige">
             Logge dich ein Habibi
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
                <InputWithLabel label="Rapper Name"/>
                <InputWithLabel label="Secret Handshake" type="password" labelAddendum="valla vergessen?"/>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-xmasyellow px-3 py-1.5 text-sm/6 font-semibold text-xmasdarkgreen shadow-sm hover:text-xmasbeige hover:bg-xmasred focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Gönn mal
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }