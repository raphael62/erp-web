// src/components/ModuleOverview.tsx
import ModuleKPIs from "./ModuleKPIs";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

/** KPI overview grid — replace placeholder values with real data later. */
export default function ModuleOverview() {
  const customersCount = 0;
  const productsCount = 0;
  const ordersToday = 0;
  const revenueToday = "₵0.00";

  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-gray-500">Key performance indicators</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ModuleKPIs
          label="Customers"
          value={customersCount}
          icon={Users}
          helpText="Total customers in the system"
        />
        <ModuleKPIs
          label="Products"
          value={productsCount}
          icon={Package}
          helpText="Active products"
        />
        <ModuleKPIs
          label="Orders (Today)"
          value={ordersToday}
          icon={ShoppingCart}
          helpText="Orders created today"
        />
        <ModuleKPIs
          label="Revenue (Today)"
          value={revenueToday}
          icon={DollarSign}
          helpText="VAT-inclusive revenue"
        />
      </div>
    </section>
  );
}
