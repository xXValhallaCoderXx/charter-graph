import { FC } from "react";

interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: FC<ICardProps> = ({ children, className }) => {
  return (
    <div
      className={`${className} rounded-xl overflow-hidden shadow-md bg-white p-6 h-[100%]`}
    >
      {children}
    </div>
  );
};

export default Card;
