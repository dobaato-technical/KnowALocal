import { X } from "lucide-react";
import Button from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-bold ${isDangerous ? "text-red-600" : "text-gray-900"}`}
          >
            {isDangerous && "⚠️ "}
            {title}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            variant="secondary"
            disabled={isLoading}
            className="px-4"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 ${
              isDangerous
                ? "bg-red-600 hover:opacity-90 text-white"
                : "bg-blue-600 hover:opacity-90 text-white"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
