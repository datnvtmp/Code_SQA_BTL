'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api from '@/services/axios';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import OrderActionButton from '@/components/order/OrderActionButton';
import { OrderStatus } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@components/Common/Header';

export default function SellerOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { hydrated, isLoggedIn } = useAuthStore();

  const { data: order, isLoading } = useQuery({
    queryKey: ['seller-order-detail', orderId],
    enabled: !!orderId && hydrated && isLoggedIn,
    queryFn: async () => {
      const res = await api.get(
        `/api/seller/orders/detail/${orderId}`
      );
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return <div className="p-6 text-red-500">Không tìm thấy đơn hàng</div>;
  }

  return (
    <>
      <Header />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Đơn #{order.id}
          </h1>
          <OrderStatusBadge
            status={order.orderStatus as OrderStatus}
          />
        </div>

        {/* Buyer info */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm">
          <div>
            <b>Khách hàng:</b> {order.buyer.username}
          </div>
          <div>
            <b>Địa chỉ:</b> {order.address.addressText}
          </div>
          {order.shippingNote && (
            <div>
              <b>Ghi chú:</b> {order.shippingNote}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border rounded-xl p-4 space-y-3">
          {order.dishInOrderDtos.length === 0 ? (
            <div className="text-gray-500 italic">
              Không có món trong đơn
            </div>
          ) : (
            order.dishInOrderDtos.map((item: any) => (
              <div
                key={item.dishId}
                className="flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    {item.dishName}
                  </div>
                  <div className="text-sm text-gray-500">
                    x{item.quantity}
                  </div>
                </div>
                <div className="font-semibold">
                  {item.priceAtOrder.toLocaleString()}đ
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        <div className="flex justify-end text-lg font-bold">
          Tổng tiền:{' '}
          <span className="ml-2 text-indigo-600">
            {order.totalAmount.toLocaleString()}đ
          </span>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <OrderActionButton
            orderId={order.id}
            status={order.orderStatus}
          />
        </div>
      </div>
    </>

  );
}
