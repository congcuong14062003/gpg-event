import { ClipboardList, PackageCheck, WalletCards } from "lucide-react";
import type { Metadata } from "next";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  getOrderItems,
  getOrderRegistrations,
  type OrderItemRow,
  type OrderRegistration,
} from "@/lib/google-sheets";
import { DashboardOrders } from "@/components/dashboard/dashboard-orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard đăng ký | GPG Solar",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  let orders: OrderRegistration[];
  let orderItems: OrderItemRow[] = [];
  let loadError = false;

  try {
    orders = await getOrderRegistrations();
    orderItems = await getOrderItems();
  } catch (error) {
    console.error("[dashboard] Google Sheets read failed:", error);
    orders = [];
    loadError = true;
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalDiscount = orders.reduce(
    (sum, order) => sum + order.discountAmount,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
        </div>
        <a
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Làm mới dữ liệu
        </a>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Không thể đọc dữ liệu Google Sheets. Kiểm tra biến môi trường, quyền
          Editor của service account và tên tab <code>Orders</code>.
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<ClipboardList className="h-5 w-5" />}
              label="Tổng đăng ký"
              value={formatNumber(orders.length)}
            />
            <SummaryCard
              icon={<WalletCards className="h-5 w-5" />}
              label="Tổng giảm giá"
              value={formatCurrency(totalDiscount)}
            />
            <SummaryCard
              icon={<PackageCheck className="h-5 w-5" />}
              label="Tổng thanh toán"
              value={formatCurrency(totalRevenue)}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">
                Danh sách đăng ký
              </h2>
            </div>
            {orders.length === 0 ? (
              <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                Chưa có đăng ký nào.
              </p>
            ) : (
              <DashboardOrders orders={orders} orderItems={orderItems} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
