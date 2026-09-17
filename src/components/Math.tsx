import { useMemo } from 'react';
import katex from 'katex';

interface MathProps {
  tex: string;
  display?: boolean;
  className?: string;
}

export default function Math({ tex, display = false, className = '' }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        trust: true,
        strict: false,
        macros: {
          "\\sen": "\\operatorname{sen}",
          "\\tg": "\\operatorname{tg}",
        }
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

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
