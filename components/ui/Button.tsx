import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  external = false,
  disabled = false,
  type = "button",
  icon,
  iconRight,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium rounded-md select-none",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-7 text-base",
    variant === "primary" &&
      "bg-primary text-primary-foreground hover:opacity-90",
    variant === "secondary" &&
      "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
    variant === "outline" &&
      "bg-transparent text-foreground border border-border hover:bg-muted",
    className
  );

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  );

  if (href) {
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
