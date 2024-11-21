interface InputWithLabelProps{
    label:string
    labelAddendum?:string
    type?:string
}

export function InputWithLabel({label,labelAddendum,type="text"}:InputWithLabelProps){

    return (
        <div>
        <div className="flex items-center justify-between">
        <label htmlFor={label} className="block text-sm/6 font-medium text-xmasbeige">
                  {label}
                </label>
          <div className="text-sm">
            <a href="#" className="font-semibold text-xmasyellow hover:text-xmasred">
              {labelAddendum}
            </a>
          </div>
        </div>
        <div className="mt-2">
        <input
                    id={label}
                    name={label}
                    type={type}
                    required
                    className="block w-full rounded-md border-0 px-1 py-1.5 bg-xmaslightgreen text-xmasbeige shadow-sm ring-1 ring-inset ring-xmasyellow focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
        </div>
      </div>
    )

}