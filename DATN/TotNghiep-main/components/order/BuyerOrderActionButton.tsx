'use client';

import { useState } from 'react';
import api from '@/services/axios';
import { OrderStatus } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, PackageCheck } from 'lucide-react';

type ActionConfig = {
  label: string;
  endpoint: string;
  nextStatus: OrderStatus;
  color: string;
  icon: React.ReactNode;
};

const ACTION_MAP: Partial<Record<OrderStatus, ActionConfig>> = {
  SHIPPED: {
    label: 'Đã giao',
    endpoint: 'deliver',
    nextStatus: 'DELIVERED',
    color: 'bg-indigo-600 hover:bg-indigo-700',
    icon: <PackageCheck size={18} />,
  },
  DELIVERED: {
    label: 'Hoàn tất',
    endpoint: 'complete',
    nextStatus: 'COMPLETED',
    color: 'bg-emerald-600 hover:bg-emerald-700',
    icon: <CheckCircle size={18} />,
  },
};

export default function BuyerOrderActionButton({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const action = ACTION_MAP[status];

  if (!action) return null;

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await api.put(
        `/api/buyer/orders/${orderId}/${action.endpoint}`
      );

      queryClient.invalidateQueries({
        queryKey: ['buyer-orders'],
      });
    } catch (e) {
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
        px-4 py-2
        rounded-xl
        text-white
        font-medium
        transition
        ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : action.color
        }
      `}
    >
      {action.icon}
      {loading ? 'Đang xử lý...' : action.label}
    </button>
  );
}
