import { OrderStatus, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '@/lib/constants';

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLOR[status]}`}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
