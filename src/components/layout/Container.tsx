// components/container.tsx
import { cn } from "@/lib/utils"; // shadcn uses this helper

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};