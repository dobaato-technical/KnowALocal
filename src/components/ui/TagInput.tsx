/**
 * TagInput Component
 * Allows users to add/remove items as tags by pressing Enter
 */

import { X } from "lucide-react";
import { useRef, useState } from "react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = "Type and press Enter",
  disabled = false,
  className = "",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();

      // Avoid duplicates
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }

      setInput("");
      inputRef.current?.focus();
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`w-full rounded-lg border border-gray-300 p-3 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${
        disabled ? "bg-gray-100" : "bg-white"
      } ${className}`}
    >
      {/* Tags Container */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              disabled={disabled}
              className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
              aria-label={`Remove tag: ${tag}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}
