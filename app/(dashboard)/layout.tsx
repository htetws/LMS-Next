import Navbar from "@/app/(dashboard)/_components/navbar";
import Sidebar from "@/app/(dashboard)/_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="z-50 h-[80px] md:pl-56 fixed inset-0">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
