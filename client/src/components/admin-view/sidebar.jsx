import {
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Store,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="w-5 h-5" />,
  },
  {
    id: "vendors",
    label: "Vendors",
    path: "/admin/vendors",
    icon: <Store className="w-5 h-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-10 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);
        return (
          <button
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
              isActive
                ? "bg-white/20 text-white shadow-lg shadow-black/10"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <span
              className={`inline-flex rounded-xl p-2 ${
                isActive ? "bg-white text-[#1E0F75]" : "bg-white/10"
              }`}
            >
              {menuItem.icon}
            </span>
            <span>{menuItem.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function GradientAside({ children }) {
  return (
    <aside className="hidden w-72 flex-col bg-gradient-to-b from-[#1E0F75] via-[#2a379a] to-[#3785D8] text-white p-6 lg:flex relative overflow-hidden">
      <div className="absolute inset-3 rounded-[32px] border border-white/10 pointer-events-none"></div>
      {children}
    </aside>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 border-none bg-gradient-to-b from-[#1E0F75] via-[#2a379a] to-[#3785D8] text-white"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-white/10">
              <SheetTitle className="flex gap-3 items-center py-4">
                <span className="rounded-2xl bg-white/15 p-3">
                  <ChartNoAxesCombined className="w-7 h-7 text-white" />
                </span>
                <div>
                  <p className="text-base uppercase tracking-[0.3em] text-white/60">
                    Admin
                  </p>
                  <h1 className="text-2xl font-extrabold">Control Center</h1>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <GradientAside>
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3"
        >
          <span className="rounded-2xl bg-white/15 p-3">
            <ChartNoAxesCombined className="w-7 h-7 text-white" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Admin
            </p>
            <h1 className="text-xl font-bold">Control Center</h1>
          </div>
        </div>
        <MenuItems />
        <div className="mt-auto rounded-2xl bg-white/10 p-4 text-white/80 text-sm">
          <p className="font-semibold">Need curation help?</p>
          <p className="text-xs mt-2">
            Keep imagery and layouts aligned with the Become Seller campaign for
            a unified experience.
          </p>
        </div>
      </GradientAside>
    </Fragment>
  );
}

export default AdminSideBar;
