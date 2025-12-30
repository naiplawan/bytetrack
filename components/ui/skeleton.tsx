import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  animate = true,
  ...props
}: SkeletonProps) {
  const variants = {
    default: 'rounded-xl',
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/40",
        animate && "animate-pulse",
        variants[variant],
        className
      )}
      style={style}
      aria-hidden="true"
      role="presentation"
      {...props}
    >
      {/* Shimmer effect overlay */}
      {animate && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            animation: 'shimmer 2s infinite',
          }}
        />
      )}
    </div>
  )
}

export { Skeleton }
