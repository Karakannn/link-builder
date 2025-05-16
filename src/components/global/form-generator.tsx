import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@hookform/error-message"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

type FormGeneratorProps = {
  type?: "text" | "email" | "password" | "number"
  inputType: "select" | "input" | "textarea"
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  register: UseFormRegister<any>
  name: string
  errors: FieldErrors<FieldValues>
  lines?: number
}

export const FormGenerator = ({
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  type,
  lines,
}: FormGeneratorProps) => {
  switch (inputType) {
    case "input":
      return (
        <Label className="flex flex-col items-start gap-2" htmlFor={`input-${label}`}>
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 text-sm mt-1">
                {message}
              </p>
            )}
          />
        </Label>
      )
    case "select":
      return (
        <Label htmlFor={`select-${label}`} className="flex flex-col gap-2">
          {label && label}
          <select
            id={`select-${label}`}
            className={`w-full bg-transparent border-[1px] p-3 rounded-lg ${errors[name] ? "border-red-500" : ""
              }`}
            {...register(name)}
          >
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="dark:bg-muted"
                >
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 text-sm mt-1">
                {message}
              </p>
            )}
          />
        </Label>
      )
    case "textarea":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${label}`}>
          {label && label}
          <Textarea
            className={`bg-themeBlack border-themeGray text-themeTextGray ${errors[name] ? "border-red-500" : ""
              }`}
            id={`input-${label}`}
            placeholder={placeholder}
            {...register(name)}
            rows={lines}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 text-sm mt-1">
                {message}
              </p>
            )}
          />
        </Label>
      )
    default:
      return <></>
  }
}
