type SearchHighlightProps = {
  html: string | null | undefined;
  className?: string;
};

function sanitizeHighlightHtml(html: string): string {
  return html.replace(/<(?!\/?mark\b)[^>]+>/gi, "");
}

export function SearchHighlight({ html, className }: SearchHighlightProps) {
  if (!html) {
    return null;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHighlightHtml(html) }}
    />
  );
}
