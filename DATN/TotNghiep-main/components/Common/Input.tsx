import React from 'react';

type BaseProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface InputProps extends Omit<BaseProps, 'onChange'> {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  multiline = false,
  rows = 1,
  className = '',
  ...props
}) => {
  const commonClass = `w-full rounded-md bg-white text-gray-900 placeholder:text-gray-400 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-customPrimary ${
    multiline ? 'p-3' : 'h-10 px-3'
  } ${className}`.trim();

  if (multiline) {
    return (
      <textarea
        className={commonClass}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => onChangeText?.(e.target.value)}
        {...props}
      />
    );
  }

  return (
    <input
      className={commonClass}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      {...props}
    />
  );
};

export default Input;
