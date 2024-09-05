import { ButtonProps } from "../../types/types"

export default function Button({ type, text, onClick, className }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={className}>
        {text}
    </button>
  )
}
