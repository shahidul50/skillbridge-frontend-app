import { Loader2 } from "lucide-react";

export const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-[200px] w-full">
            <Loader2 className="size-10 text-primary animate-spin" />
        </div>
    );
};
