import { LoaderProps } from "../../types/uiTypes";

export default function Loader({ text, loader }: LoaderProps) {
  return (
    <span>
      {text}
      {loader}
    </span>
  )
}
