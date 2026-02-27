import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholderText?: string;
    className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    placeholder,
    value,
    onChangeText,
    placeholderText,
    className = '',
    rows = 4,
    ...props
}) => {
    const defaultClass = 'w-full rounded-md bg-white text-gray-900 placeholder:text-gray-400 outline-none min-h-[132px] px-2 py-2';
    const ringClasses = 'ring-0 ring-gray-200 focus:ring-2 focus:ring-customPrimary';
    const finalClassName = className
        ? `${className} ${ringClasses}`.trim()
        : `${defaultClass} ${ringClasses}`.trim();

    return (
        <textarea
            className={finalClassName}
            placeholder={placeholder || placeholderText}
            value={value}
            rows={rows}
            onChange={(e) => onChangeText?.(e.target.value)}
            {...props}
        />
    );
};

export default TextArea;
