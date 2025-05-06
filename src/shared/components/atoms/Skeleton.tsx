import React from "react";

interface SkeletonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  isLoading,
  children,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded-md w-full h-10 ${
          className ?? ""
        }`}
      />
    );
  }
  return <>{children}</>;
};

export default Skeleton;
