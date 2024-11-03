import Sidebar from "@/components/Sidebar";
import PlayingBar from "@/components/PlayingBar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="h-full">
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
