'use client';

import { useState, useEffect } from 'react';
import api from '@/services/axios';
import { OrderStatus } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Truck } from 'lucide-react';

type ActionConfig = {
  label: string;
  endpoint: string;
  nextStatus: OrderStatus;
  color: string;
  icon: React.ReactNode;
};

const ACTION_MAP: Partial<Record<OrderStatus, ActionConfig>> = {
  PAID: {
    label: 'Nhận đơn',
    endpoint: 'confirm',
    nextStatus: 'CONFIRMED_BY_SELLER',
    color: 'bg-emerald-600 hover:bg-emerald-700',
    icon: <CheckCircle size={18} />,
  },
  CONFIRMED_BY_SELLER: {
    label: 'Giao cho ship',
    endpoint: 'ship',
    nextStatus: 'SHIPPED',
    color: 'bg-indigo-600 hover:bg-indigo-700',
    icon: <Truck size={18} />,
  },
};

export default function OrderActionButton({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // ⭐ Optimistic status
  const [localStatus, setLocalStatus] =
    useState<OrderStatus>(status);

  // Sync lại nếu server trả status mới
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const action = ACTION_MAP[localStatus];
  if (!action) return null;

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);

    // ✅ Optimistic update (UI đổi ngay)
    setLocalStatus(action.nextStatus);

    try {
      await api.post(
        `/api/seller/orders/${orderId}/${action.endpoint}`
      );

      queryClient.invalidateQueries({
        queryKey: ['seller-order-detail', orderId],
      });
      queryClient.invalidateQueries({
        queryKey: ['seller-orders'],
      });
    } catch (error) {
      console.error(error);

      // ❌ rollback nếu lỗi
      setLocalStatus(status);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        flex items-center gap-2
        px-5 py-2.5
        rounded-xl
        font-medium
        text-white
        shadow-md
        transition-all duration-200
        ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : `${action.color} hover:shadow-lg active:scale-95`
        }
      `}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Đang xử lý...
        </>
      ) : (
        <>
          {action.icon}
          {action.label}
        </>
      )}
    </button>
  );
}
