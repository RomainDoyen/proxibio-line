import { ImageProps } from "../../types/uiTypes";

export default function Image({ src, alt, className }: ImageProps): React.JSX.Element {
  return (
    <img src={src} alt={alt} className={className} />
  )
}
