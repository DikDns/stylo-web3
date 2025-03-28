export const Button = ({ children, icon, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-full bg-[#634AFF] rounded-2xl flex justify-center items-center"
      {...props}
    >
      <span className="text-white">{children}</span>
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};
