import { LoaderProps } from "../../types/types"

export default function Loader({ text, loader }: LoaderProps) {
  return (
    <span>
      {text}
      {loader}
    </span>
  )
}
