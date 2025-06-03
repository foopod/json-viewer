import { useMemo } from "react";

interface HighlightProps {
  text: string;
  searchTerm: string;
  caseSensitive?: boolean;
  className?: string;
  highlightClassName?: string;
}

export const Highlight: React.FC<HighlightProps> = ({
  text,
  searchTerm,
  caseSensitive = false,
  className = "",
  highlightClassName = "bg-yellow-200 text-yellow-900 rounded font-medium"
}) => {
  const highlightedText = useMemo(() => {
    if (!searchTerm.trim()) {
      return text;
    }

    console.log(text)

    const flags = caseSensitive ? 'g' : 'gi';
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, flags);
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = regex.test(part);
      return isMatch ? (
        <mark key={index} className={highlightClassName}>
          {part}
        </mark>
      ) : (
        part
      );
    });
  }, [text, searchTerm, caseSensitive, highlightClassName]);

  return <span className={className}>{highlightedText}</span>;
};