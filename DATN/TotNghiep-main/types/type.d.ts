// Legacy type definition - not used in Next.js version
declare interface ButtonProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success" | "transparent" | "ghost";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success" | "transparent" | "outline" | "ghost";
  IconLeft?: React.ComponentType<Record<string, unknown>> | React.ReactElement;
  IconRight?: React.ComponentType<Record<string, unknown>> | React.ReactElement;
  className?: string;
}
