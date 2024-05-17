import MobileSidbar from "@/app/(dashboard)/_components/mobile-sidebar";
import NavbarRoutes from "@/components/navbar-routes";

const Navbar = () => {
  return (
    <nav className="border-b bg-white h-full shadow-sm flex items-center p-4">
      <MobileSidbar />
      <NavbarRoutes />
    </nav>
  );
};

export default Navbar;
