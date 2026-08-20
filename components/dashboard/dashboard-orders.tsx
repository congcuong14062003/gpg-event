'use client';

import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { OrderItemRow, OrderRegistration } from '@/lib/google-sheets';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DashboardOrdersProps {
  orders: OrderRegistration[];
  orderItems: OrderItemRow[];
}

export function DashboardOrders({ orders, orderItems }: DashboardOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderRegistration | null>(null);
  const selectedItems = useMemo(
    () => orderItems.filter((item) => item.orderCode === selectedOrder?.orderCode),
    [orderItems, selectedOrder]
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1060px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Mã đơn</th>
              <th className="px-5 py-3 font-medium">Thời gian</th>
              <th className="px-5 py-3 font-medium">Đại lý</th>
              <th className="px-5 py-3 font-medium">Khách hàng</th>
              <th className="px-5 py-3 font-medium">Điện thoại</th>
              <th className="px-5 py-3 text-right font-medium">Tổng thanh toán</th>
              <th className="px-5 py-3 font-medium">Trạng thái</th>
              <th className="px-5 py-3 text-right font-medium">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...orders].reverse().map((order, index) => (
              <tr key={`${order.orderCode}-${index}`} className="hover:bg-secondary/30">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-foreground">{order.orderCode}</td>
                <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{order.createdAt}</td>
                <td className="px-5 py-4 text-foreground">{order.dealerName || '-'}</td>
                <td className="px-5 py-4 text-foreground">{order.customerName}</td>
                <td className="whitespace-nowrap px-5 py-4 text-foreground">{order.phone}</td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-primary">{formatCurrency(order.totalAmount)}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{order.status || 'NEW'}</span></td>
                <td className="px-5 py-4 text-right">
                  <button type="button" onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary">
                    <Eye className="h-3.5 w-3.5" /> Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Chi tiết đơn {selectedOrder.orderCode}</DialogTitle>
                <DialogDescription>Đăng ký lúc {selectedOrder.createdAt}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 rounded-xl bg-secondary/50 p-4 text-sm sm:grid-cols-2">
                <Detail label="Tên đại lý" value={selectedOrder.dealerName} />
                <Detail label="Tên khách hàng" value={selectedOrder.customerName} />
                <Detail label="Số điện thoại" value={selectedOrder.phone} />
                <Detail label="Trạng thái" value={selectedOrder.status || 'NEW'} />
                <div className="sm:col-span-2"><Detail label="Ghi chú" value={selectedOrder.note || '-'} /></div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-foreground">Sản phẩm đăng ký</h3>
                {selectedItems.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Chưa có chi tiết sản phẩm cho đơn này.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[580px] text-sm">
                      <thead className="bg-secondary/60 text-xs text-muted-foreground"><tr><th className="px-3 py-2 text-left font-medium">Sản phẩm</th><th className="px-3 py-2 text-right font-medium">SL</th><th className="px-3 py-2 text-right font-medium">Đơn giá</th><th className="px-3 py-2 text-right font-medium">Thành tiền</th></tr></thead>
                      <tbody className="divide-y divide-border">
                        {selectedItems.map((item, index) => <tr key={`${item.productId}-${index}`}><td className="px-3 py-3"><p className="font-medium text-foreground">{item.productName}</p><p className="text-xs text-muted-foreground">{item.productCode}</p></td><td className="px-3 py-3 text-right">{item.quantity}</td><td className="px-3 py-3 text-right">{formatCurrency(item.unitPrice)}</td><td className="px-3 py-3 text-right font-medium">{formatCurrency(item.totalPrice)}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="ml-auto w-full max-w-xs space-y-2 border-t border-border pt-3 text-sm">
                <Total label="Tạm tính" value={formatCurrency(selectedOrder.subtotalAmount)} />
                <Total label="Giảm giá 5%" value={`-${formatCurrency(selectedOrder.discountAmount)}`} muted />
                <Total label="Tổng thanh toán" value={formatCurrency(selectedOrder.totalAmount)} strong />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 font-medium text-foreground">{value || '-'}</p></div>;
}

function Total({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return <div className={`flex justify-between ${muted ? 'text-green-600' : 'text-muted-foreground'} ${strong ? 'pt-1 text-base font-bold text-foreground' : ''}`}><span>{label}</span><span>{value}</span></div>;
}
