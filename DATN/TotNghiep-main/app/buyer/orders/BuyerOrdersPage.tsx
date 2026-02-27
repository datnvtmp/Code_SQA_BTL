'use client';
import Header from '@/components/Common/Header';
import OrderCard from '@/components/order/OrderCard';
import OrderStatusFilter from '@/components/order/OrderStatusFilter';
import { OrderStatus } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BuyerOrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { hydrated, isLoggedIn } = useAuthStore();

    const status =
        (searchParams.get('status') as OrderStatus) ?? 'PAID';

    const handleChange = (s: OrderStatus) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );
        params.set('status', s);
        router.push(`/buyer/orders?${params.toString()}`);
    };

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['buyer-orders', status],
        enabled: hydrated && isLoggedIn,
        queryFn: async () => {
            const res = await api.get('/api/buyer/orders', {
                params: { orderStatus: status },
            });

            return res.data.data?.content ?? [];
        },
    });

    return (
        <>
            <Header />

            {/* Wrapper tránh bị Header che */}
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-6xl mx-auto px-4 pb-10 space-y-6">

                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Đơn hàng của tôi
                        </h1>
                    </div>

                    {/* Filter */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <OrderStatusFilter
                            current={status}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Orders */}
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
                                        role="BUYER"
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
