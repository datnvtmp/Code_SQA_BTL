import { useState } from 'react';

interface WebButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success" | "transparent" | "ghost";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success" | "transparent" | "outline" | "ghost";
  IconLeft?: React.ComponentType<Record<string, unknown>> | React.ReactElement;
  IconRight?: React.ComponentType<Record<string, unknown>> | React.ReactElement;
  className?: string;
}

const getBgVariantStyle = (
  variant: "primary" | "secondary" | "danger" | "outline" | "success" | "transparent" | "ghost" | undefined
) => {
  switch (variant) {
    case "ghost":
      return "bg-[#FFEFE9]";
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-customPrimary border-[0.5px]";
    case "transparent":
      return "bg-transparent";
    default:
      return "bg-customPrimary";
  }
};

const getTextVariantStyle = (
  variant: "primary" | "default" | "secondary" | "danger" | "success" | "transparent" | "outline" | "ghost" | undefined
) => {
  switch (variant) {
    case "ghost":
      return "#E36137";
    case "primary":
      return "#ffffff";
    case "secondary":
      return "#F3F4F6";
    case "danger":
      return "#FEE2E2";
    case "success":
      return "#D1FAE5";
    case "outline":
      return "#E36137";
    case "transparent":
      return "#E36137";
    case "default":
      return "#ffffff";
    default:
      return "#ffffff";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  ...props
}: WebButtonProps & { onPress?: () => void }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onPress}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`w-full rounded-lg hover:!text-white hover:bg-customPrimary/80 shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className} h-10 min-h-10 px-6 py-2 ${isPressed ? 'opacity-90' : 'opacity-100'}`}
      {...props}
    >
      <span className="flex w-full flex-row items-center justify-center gap-2">
        {IconLeft && (typeof IconLeft === 'function' ? <IconLeft /> : IconLeft)}
        <p className="font-semibold text-base" style={{ color: getTextVariantStyle(textVariant) }}>
          {title}
        </p>
        {IconRight && (typeof IconRight === 'function' ? <IconRight /> : IconRight)}
      </span>
    </button>
  );
};

export default CustomButton;