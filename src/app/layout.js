import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BoardProvider } from "../context/BoardContext";
import Sidebar from "../components/Sidebar";
import ActivitySidebar from "../components/ActivitySidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FlowBoard | Cyberpunk Project Dashboard",
  description: "Next-gen project management and real-time team collaboration simulator.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-dark-bg text-[#f3f4f6] font-sans overflow-hidden">
        <BoardProvider>
          {/* Main App Layout wrapper */}
          <div className="flex w-full h-screen overflow-hidden">
            {/* Sidebar Left */}
            <Sidebar />

            {/* Content Viewport Center */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#060b13]">
              {children}
            </main>

            {/* Live activity simulator log Right */}
            <ActivitySidebar />
          </div>
        </BoardProvider>
      </body>
    </html>
  );
}
