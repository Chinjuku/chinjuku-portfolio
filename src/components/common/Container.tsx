import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared page gutter: every section's content starts on the same left edge.
 * Wide on purpose (80rem) so copy has room; padding steps up at md.
 */
const Container: React.FC<ContainerProps> = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-6 md:px-12 ${className}`}>{children}</div>
);

export default Container;
