import { Outlet, createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/utils";
import { NavBar } from "@/components/layout";
export const Route = createFileRoute("/roadmap")({
  component: RouteComponent,
  beforeLoad: authGuard,
});

function RouteComponent() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
