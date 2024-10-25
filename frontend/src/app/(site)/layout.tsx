import Sidebar from "@/components/Sidebar";
import { PlayerProvider } from "@/contexts/PlayerContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlayerProvider>
      <div className="h-full">
        <div className="flex h-full">
          <Sidebar>{''}</Sidebar>
          <main className="h-[91%] flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </PlayerProvider>
  )
}
