import React from 'react';

type Colors = 'blue' | 'green' | 'red' | 'transparent' | 'none';

interface PropTypes {
  color?: Colors,
  onClick?: () => void,
  disabled?: boolean,
  children?: React.ReactNode,
  className?: string,
  type?: 'button' | 'submit' | 'reset'
}

const colorMap: Record<Colors, string> = {
  blue: 'button-primary',
  green: 'button-green',
  red: 'button-danger',
  transparent: 'bg-transparent hover:bg-transparent',
  none: '',
};

const Button: React.FC<PropTypes> = ({
  color = 'blue',
  type = 'button',
  onClick = () => {},
  disabled = false,
  children = null,
  className = '',
}) => (
  <button
    type={type}
    className={`
      ${colorMap[color]}
      min-h-[36px] px-4 py-2 rounded-md text-[13px] font-semibold
      transition-colors disabled:cursor-not-allowed disabled:opacity-40
      ${className}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
