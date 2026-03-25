interface SkeletonProps {
  className?: string;
}

export function SkeletonCard({className = ''}: SkeletonProps) {
  return (
    <div className={`p-0 ${className}`}>
      <div className="skeleton h-[280px] w-full" />
      <div className="p-5">
        <div className="skeleton h-3 w-24 mb-2" />
        <div className="skeleton h-2.5 w-16 mb-3" />
        <div className="skeleton h-4 w-40 mb-3" />
        <div className="skeleton h-2.5 w-full mb-2" />
        <div className="skeleton h-2.5 w-3/4 mb-4" />
        <div className="flex justify-between items-center">
          <div className="skeleton h-5 w-12" />
          <div className="skeleton h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLine({className = ''}: SkeletonProps) {
  return <div className={`skeleton h-3 ${className}`} />;
}
