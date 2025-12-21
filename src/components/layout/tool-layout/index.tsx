import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MenuSidebar from "../menu-sidebar";

type ToolLayoutProps = {
  items: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];
  title: string;
  children: React.ReactNode;
};

export default function ToolLayout({
  items,
  title,
  children,
}: ToolLayoutProps) {
  return (
    <SidebarProvider>
      <MenuSidebar items={items} title={title} />
      <main className="w-full flex min-h-screen">
        <SidebarTrigger />
        <div className="flex flex-1 p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
