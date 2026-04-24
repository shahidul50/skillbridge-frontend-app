import { ReactNode } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    submitText?: string
    onSubmit?: () => void
    onCancel?: () => void
    children?: ReactNode
    isLoading?: boolean
}

export function Modal({
    open,
    onOpenChange,
    title = "Add Your Title",
    description = "Add your description here.",
    submitText = "Confirm",
    onSubmit,
    onCancel,
    children,
    isLoading = false
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-[15px] pt-1 pb-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    {children}
                </div>
                <DialogFooter className="sm:justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-border/60 py-5 px-6 font-medium"
                        onClick={() => {
                            if (onCancel) onCancel()
                            else onOpenChange(false)
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-primary hover:bg-primary/90 text-white py-5 px-6 font-medium"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
