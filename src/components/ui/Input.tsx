import { InputProps } from '../../types/uiTypes';

export default function Input({ type, id, placeholder, value, onChange }: InputProps): JSX.Element {
  return (
    <input 
          type={type} 
          className="form-control" 
          id={id} 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
    />
  )
}
