'use client';

import api from '@/services/axios';
import OrderCard from '@/components/order/OrderCard';
import OrderStatusFilter from '@/components/order/OrderStatusFilter';
import { OrderStatus } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Header from '@components/Common/Header';

export default function SellerOrdersPage() {
    const { hydrated, isLoggedIn } = useAuthStore();
    const [status, setStatus] = useState<OrderStatus>('PAID');

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['seller-orders', status],
        enabled: hydrated && isLoggedIn,
        queryFn: async () => {
            const res = await api.get(
                '/api/seller/orders',
                {
                    params: {
                        orderStatus: status,
                    },
                }
            );

            return res.data.data.content;
        },
    });


    if (!hydrated) {
        return <div className="p-6">Đang khởi tạo...</div>;
    }

    if (!isLoggedIn) {
        return <div className="p-6">Vui lòng đăng nhập</div>;
    }

    return (
        <>
            <Header />

            {/* Wrapper tránh bị Header che */}
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-6xl mx-auto px-4 pb-10 space-y-6">

                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Đơn hàng người bán
                        </h1>
                    </div>

                    {/* Filter box */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <OrderStatusFilter
                            current={status}
                            onChange={setStatus}
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        {isLoading ? (
                            <div className="text-center text-gray-500">
                                Đang tải đơn hàng...
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center text-gray-400 italic">
                                Không có đơn hàng
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {orders.map((order: any) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        role="SELLER"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );

}
