import katex from 'katex';

export function renderMath(tex: string, display: boolean = false): string {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false
    });
  } catch {
    return tex;
  }
}

interface MathProps {
  tex: string;
  display?: boolean;
  className?: string;
}

export default function Math({ tex, display = false, className = '' }: MathProps) {
  const html = renderMath(tex, display);
  
  if (display) {
    return (
      <div 
        className={`math-block ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span 
      className={`math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
