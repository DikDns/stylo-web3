export const Text = ({ level = 1, children, ...props }) => {
  const Tag = `h${level}`;
  const baseClasses = "font-bold text-gray-800";

  const sizeClasses = {
    1: "text-2xl",
    2: "text-xl",
    3: "text-lg",
    4: "text-base",
    5: "text-sm",
    6: "text-xs",
  };

  return (
    <Tag
      className={`${baseClasses} ${sizeClasses[level] || sizeClasses[1]}`}
      {...props}
    >
      {children}
    </Tag>
  );
};
