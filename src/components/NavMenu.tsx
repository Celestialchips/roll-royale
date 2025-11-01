// universal navigation menu

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, BugIcon, CoffeeIcon, History, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import RequestFeatureForm from "@/components/RequestForm";

const MENU_ITEM_CLASS = "cursor-pointer hover:bg-[#0a0a0a]/10 focus:bg-[#0a0a0a]/10";

const MENU_ITEMS = {
  feature: {
    icon: BugIcon,
    label: "Request a Feature",
    color: "hover:text-destructive focus:text-destructive",
    action: "toggleFeature"
  },
  coffee: {
    icon: CoffeeIcon,
    label: "Buy me a coffee",
    color: "hover:text-[#0088ff] focus:text-[#0088ff]",
    action: "openLink",
    link: "https://buymeacoffee.com/ryanglassdj"
  },
  history: {
    icon: History,
    label: "Roll History",
    color: "hover:text-[#FF5700] focus:text-[#FF5700]",
    action: "navigate",
    path: "/history"
  },
  dashboard: {
    icon: ArrowRight,
    label: "Get Started",
    color: "hover:text-[#00ff88] focus:text-[#00ff88]",
    action: "navigate",
    path: "/dashboard"
  },
  back: {
    icon: ArrowLeft,
    label: "Back to Dashboard",
    color: "hover:text-[#00ff88] focus:text-[#00ff88]",
    action: "navigate",
    path: "/dashboard"
  }
};

const MENU_CONFIGS = {
  "/dashboard": ["feature", "coffee", "history"],
  "/history": ["feature", "coffee", "back"],
  default: ["feature", "coffee", "history", "dashboard"]
};

export default function NavMenu() {
  const navigate = useNavigate();
  const [requestFeatureOpen, setRequestFeatureOpen] = useState(false);
  const pathname = window.location.pathname;
  const menuItems = MENU_CONFIGS[pathname as keyof typeof MENU_CONFIGS] || MENU_CONFIGS.default;

  const handleAction = (item: typeof MENU_ITEMS[keyof typeof MENU_ITEMS]) => {
    if (item.action === "toggleFeature") {
      setRequestFeatureOpen(!requestFeatureOpen);
    } else if (item.action === "openLink") {
      window.open((item as { link: string }).link, "_blank");
    } else if (item.action === "navigate") {
      navigate((item as { path: string }).path);
    }
  };

  return (
    <>
      {requestFeatureOpen && <RequestFeatureForm />}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-[#00ff88]/30 hover:border-[#00ff88] hover:bg-[#00ff88]/10">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {menuItems.map((itemKey) => {
              const item = MENU_ITEMS[itemKey as keyof typeof MENU_ITEMS];
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={itemKey}
                  className={`${MENU_ITEM_CLASS} ${item.color}`}
                  onClick={() => handleAction(item)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}