'use client';

import { OrderStatus } from '@/lib/constants';

export default function OrderStatusFilter({
  current,
  onChange,
}: {
  current: OrderStatus;
  onChange: (s: OrderStatus) => void;
}) {
  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className="border rounded-lg px-4 py-2 w-56"
    >
      {['PAID','CANCELLED_BY_BUYER','COMPLETED','CONFIRMED_BY_SELLER','DELIVERED','SHIPPED','WAITING_PAYMENT'].map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
