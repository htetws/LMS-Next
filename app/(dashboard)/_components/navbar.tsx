import MobileSidbar from "@/app/(dashboard)/_components/mobile-sidebar";

const Navbar = () => {
  return (
    <nav className="border-b bg-white h-full shadow-sm flex items-center p-4">
      <MobileSidbar />
    </nav>
  );
};

export default Navbar;
