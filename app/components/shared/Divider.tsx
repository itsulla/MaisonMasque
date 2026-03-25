interface DividerProps {
  className?: string;
}

export function Divider({className = ''}: DividerProps) {
  return (
    <div className={`flex justify-center py-12 ${className}`.trim()}>
      <div className="h-2 w-2 rotate-45 bg-gold" />
    </div>
  );
}
