import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathProps {
  tex: string;
  display?: boolean;
  className?: string;
}

export default function Math({ tex, display = false, className = '' }: MathProps) {
  const mathRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (mathRef.current) {
      try {
        katex.render(tex, mathRef.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX render error:', error);
        if (mathRef.current) {
          mathRef.current.textContent = tex;
        }
      }
    }
  }, [tex, display]);

  return (
    <span 
      ref={mathRef} 
      className={`${display ? 'math-display block text-center my-2' : 'inline-block'} ${className}`}
    />
  );
}
