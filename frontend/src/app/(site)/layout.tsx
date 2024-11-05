import Sidebar from "@/components/Sidebar";
import PlayingBar from "@/components/PlayingBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="h-full">
        <ToastContainer />
        <div className="flex h-full">
          <Sidebar>{''}</Sidebar>
          <PlayingBar />
          <main className="h-[91%] flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
  )
}
