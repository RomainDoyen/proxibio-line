import { ButtonProps } from "../../types/uiTypes";

export default function Button({ type, text, onClick, className, icon }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={className}>
        {text}
        {icon && <span className="button-icon">{icon}</span>}
    </button>
  )
}
