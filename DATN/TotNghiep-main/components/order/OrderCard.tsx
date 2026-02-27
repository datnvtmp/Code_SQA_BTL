import OrderStatusBadge from './OrderStatusBadge';
import BuyerOrderActionButton from './BuyerOrderActionButton';
import OrderActionButton from './OrderActionButton';
import { OrderStatus } from '@/lib/constants';

export default function OrderCard({
  order,
  role,
}: {
  order: any;
  role: 'BUYER' | 'SELLER';
}) {
  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex justify-between">
        <span className="font-semibold">
          Đơn #{order.id}
        </span>
        <OrderStatusBadge
          status={order.orderStatus as OrderStatus}
        />
      </div>

      <div className="text-sm text-gray-500">
        Tổng tiền: {order.totalAmount.toLocaleString()}đ
      </div>

      <div className="flex justify-end">
        {role === 'SELLER' ? (
          <OrderActionButton
            orderId={order.id}
            status={order.orderStatus}
          />
        ) : (
          <BuyerOrderActionButton
            orderId={order.id}
            status={order.orderStatus}
          />
        )}
      </div>
    </div>
  );
}
