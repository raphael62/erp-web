// src/config/modules.ts
import {
  LayoutDashboard, Calculator, Receipt, Store, ShoppingCart,
  Package, Tags, Recycle, Boxes, Building2, FileBarChart,
  Users, Settings, BarChart2
} from "lucide-react";

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type SubMenu = { name: string; href: string; visible?: boolean; icon?: IconType };
export type MainModule = {
  id: string;
  name: string;
  href: string;
  visible?: boolean;
  icon?: IconType;         // used in sidebar only (navbar is text-only)
  submenus: SubMenu[];
};
export const visible = <T extends { visible?: boolean }>(items: T[]) =>
  items.filter(i => i.visible !== false);

// ===== MAIN MODULES (top navbar) =====
export const MAIN_MODULES: MainModule[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    submenus: [
      { name: "Overview", href: "/", icon: LayoutDashboard, visible: true },
    ],
    visible: true,
  },

  {
    id: "purchases",
    name: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
    submenus: [
      { name: "Overview", href: "/purchases", icon: LayoutDashboard, visible: true },
      { name: "Suppliers", href: "/purchases/suppliers", icon: Store, visible: true },
      { name: "Purchase Orders", href: "/purchases/orders", icon: Receipt, visible: true },
      { name: "Bills", href: "/purchases/bills", icon: Receipt, visible: true },
    ],
    visible: true,
  },

  {
    id: "sales",
    name: "Sales",
    href: "/sales",
    icon: Receipt,
    submenus: [
      { name: "Overview", href: "/sales", icon: LayoutDashboard, visible: true },
      { name: "Orders", href: "/sales/orders", icon: Receipt, visible: true },
      { name: "Invoices", href: "/sales/invoices", icon: Receipt, visible: true },
      { name: "Customers", href: "/customers", icon: Users, visible: true },
      // ❌ no Pricelists here (lives under Inventory)
    ],
    visible: true,
  },

  {
    id: "pos",
    name: "Point of Sales",
    href: "/pos",
    icon: Store,
    submenus: [
      { name: "Overview", href: "/pos", icon: LayoutDashboard, visible: true },
      { name: "Register", href: "/pos/register", icon: Store, visible: true },
      { name: "Z Reports", href: "/pos/z-reports", icon: Receipt, visible: true },
    ],
    visible: true,
  },

  {
    id: "inventory",
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    submenus: [
      { name: "Overview", href: "/inventory", icon: LayoutDashboard, visible: true },
      { name: "Items & Products", href: "/products", icon: Package, visible: true },
      { name: "Pricelists", href: "/pricelist", icon: Tags, visible: true },
      { name: "Empties Receive", href: "/inventory/empties", icon: Recycle, visible: true },
      { name: "Stock Management", href: "/inventory/movements", icon: Boxes, visible: true },
      { name: "Warehouses", href: "/locations", icon: Building2, visible: true },
      { name: "Inventory Reports", href: "/reports/inventory-valuation", icon: FileBarChart, visible: true },
    ],
    visible: true,
  },

  {
    id: "production",
    name: "Production",
    href: "/production",
    icon: Boxes,
    submenus: [
      { name: "Overview", href: "/production", icon: LayoutDashboard, visible: true },
      { name: "BOM", href: "/production/bom", icon: Package, visible: true },
      { name: "Work Orders", href: "/production/work-orders", icon: Boxes, visible: true },
    ],
    visible: true,
  },

  {
    id: "accounting",
    name: "Accounting",
    href: "/accounting",
    icon: Calculator,
    submenus: [
      { name: "Overview", href: "/accounting", icon: LayoutDashboard, visible: true },
      { name: "Chart of Accounts", href: "/accounting/coa", icon: Calculator, visible: true },
      { name: "Journals", href: "/accounting/journals", icon: Receipt, visible: true },
      { name: "Payments", href: "/accounting/payments", icon: Receipt, visible: true },
    ],
    visible: true,
  },

  {
    id: "hr",
    name: "HR & Payroll",
    href: "/hr",
    icon: Users,
    submenus: [
      { name: "Overview", href: "/hr", icon: LayoutDashboard, visible: true },
      { name: "Employees", href: "/hr/employees", icon: Users, visible: true },
      { name: "Payroll Runs", href: "/hr/payroll", icon: Calculator, visible: true },
    ],
    visible: true,
  },

  {
    id: "preferences",
    name: "Preferences",
    href: "/preferences",
    icon: Settings,
    submenus: [
      { name: "Overview", href: "/preferences", icon: LayoutDashboard, visible: true },
      { name: "Company", href: "/preferences/company", icon: Settings, visible: true },
      { name: "Taxes", href: "/preferences/taxes", icon: Calculator, visible: true },
      { name: "Users & Roles", href: "/preferences/users", icon: Users, visible: true },
    ],
    visible: true,
  },

  {
    id: "reports",
    name: "Reports",
    href: "/reports",
    icon: BarChart2,
    submenus: [
      { name: "Overview", href: "/reports", icon: LayoutDashboard, visible: true },
      { name: "Sales by Month", href: "/reports/sales-by-month", icon: BarChart2, visible: true },
      { name: "Inventory Valuation", href: "/reports/inventory-valuation", icon: FileBarChart, visible: true },
    ],
    visible: true,
  },
];
