import { FaUserCircle } from "react-icons/fa";
import { AvatarProps } from "../../types/types";

export default function Avatar({ toggleDropdown }: AvatarProps): JSX.Element {
  return (
    <div className="user-avatar" onClick={toggleDropdown}>
        <FaUserCircle size={40} color="#507c50" />
    </div>
  )
}
