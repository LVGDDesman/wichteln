import { ChangeEvent } from "react"

interface InputWithLabelProps {
    label: string
    labelAddendum?: string
    type?: string
    placeholder?: string
    onValueChange?: (input: string) => void
    disabled?: boolean
    defaultValue?: string
}

export function InputWithLabel({
    label,
    labelAddendum,
    type = "text",
    placeholder = "",
    onValueChange = () => {},
    disabled = false,
    defaultValue = "",
}: InputWithLabelProps) {
    function onEventToValueChange(e: ChangeEvent<any>) {
        onValueChange(e.target.value)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <label
                    htmlFor={label}
                    className="block text-sm/6 font-medium text-xmastext"
                >
                    {label}
                </label>
                {labelAddendum && (
                    <div className="text-sm">
                        <a
                            href="#"
                            className="font-semibold text-xmasprim hover:text-xmasacc"
                        >
                            {labelAddendum}
                        </a>
                    </div>
                )}
            </div>
            <div className="mt-2">
                <input
                    id={label}
                    name={label}
                    type={type}
                    required
                    className="block w-full rounded-md border-0 px-1 py-1.5 bg-xmassec text-xmastext shadow-sm ring-1 ring-inset ring-xmasacc focus:ring-2 focus:ring-inset focus:ring-xmasacc sm:text-sm/6"
                    onChange={onEventToValueChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    defaultValue={defaultValue}
                />
            </div>
        </div>
    )
}
