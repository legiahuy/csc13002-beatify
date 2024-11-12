import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CuratorDashboardSidebar from "@/components/CuratorDashboardSidebar";
import ProtectedRoute from "@/components/protectedRoute";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute roleRequired={["curator", "admin"]}>

    <div className='flex items-start min-h-screen'>
        <ToastContainer />
        <CuratorDashboardSidebar>{''}</CuratorDashboardSidebar>
        <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
            
            <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
            {children}
            </div>
        </div>

    </div>
    </ProtectedRoute>
  )
}
