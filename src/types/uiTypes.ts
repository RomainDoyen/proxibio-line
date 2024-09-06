export type CardFormProps = {
  onProducteurAdded: () => void;
};

export type CardMapsProps = {
  refreshMap: boolean;
};

export type InputProps = {
  type: string;
  className?: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type AvatarProps = {
  toggleDropdown: () => void;
};

export type ButtonProps = {
  type?: "button" | "submit" | "reset";
  text: string | JSX.Element;
  onClick?: () => void;
  className: string;
  icon?: JSX.Element;
};

export type ImageProps = {
  src: string;
  alt: string;
};

export type LoaderProps = {
  text: string
  loader: JSX.Element
};