import Image from "next/image";

const AppHeader = () => {
  return (
    <div className="h-16 bg-black flex items-center px-8">
      <Image src="/charter-logo.png" alt="Logo" width={150} height={50} />
    </div>
  );
};

export default AppHeader;
