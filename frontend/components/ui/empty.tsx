import * as React from "react";
import { cn } from "@/lib/utils";

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg",
      className
    )}
    {...props}
  />
));
Empty.displayName = "Empty";

const EmptyHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center gap-2 mb-4", className)}
    {...props}
  />
));
EmptyHeader.displayName = "EmptyHeader";

const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
EmptyTitle.displayName = "EmptyTitle";

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground max-w-sm", className)}
    {...props}
  />
));
EmptyDescription.displayName = "EmptyDescription";

interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "icon" | "image";
}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant = "icon", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        variant === "icon" &&
          "flex h-12 w-12 items-center justify-center rounded-full bg-muted [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
EmptyMedia.displayName = "EmptyMedia";

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia };
