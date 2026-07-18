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
  blue: 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-950/30',
  green: 'bg-emerald-500 hover:bg-emerald-400 text-[#06130f]',
  red: 'button-danger',
  transparent: 'bg-transparent hover:bg-transparent',
  none: '',
};

const Button: React.FC<PropTypes> = ({
  color = 'blue',
  type = 'button',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
  disabled = false,
  children = null,
  className = '',
}) => (
  <button
    type={type}
    className={`
      ${colorMap[color]}
      min-h-[38px] px-4 py-2 rounded-[10px] text-white text-xs font-semibold
      transition-all disabled:cursor-not-allowed disabled:opacity-40
      ${className}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
