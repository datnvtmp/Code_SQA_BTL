'use client';

import { useEffect, useState } from 'react';
import { getMyCart } from '../../services/cart.service';
import axios from '../../services/axios';
import AddAddressModal from '@/components/cart/AddAddressModal';
import CheckoutCartModal from '@/components/cart/CheckoutCartModal';

/* ===== TYPES ===== */
interface CartItem {
    dishId: number;
    dishName: string;
    quantity: number;
    priceSnapshot: number;
}

interface Cart {
    cartId: number;
    sellerId: number;
    items: CartItem[];
    totalAmount: number;
}

interface Address {
    id: number;
    label: string;
    addressText: string;
    lat: number;
    lng: number;
}

export default function CartClient() {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [removingKey, setRemovingKey] = useState<string | null>(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [checkoutCartId, setCheckoutCartId] = useState<number | null>(null);

    /* ===== FETCH CART ===== */
    const fetchCart = async () => {
        try {
            const res = await getMyCart();
            const rawData = res?.data?.data;

            const safeCarts: Cart[] = Array.isArray(rawData)
                ? rawData.map((cart: any) => ({
                    cartId: cart.cartId,
                    sellerId: cart.sellerId,
                    totalAmount: cart.totalAmount ?? 0,
                    items: Array.isArray(cart.items) ? cart.items : [],
                }))
                : [];

            setCarts(safeCarts);
        } catch (err) {
            console.error('Fetch cart error', err);
            setCarts([]);
        }
    };

    /* ===== FETCH ADDRESSES ===== */
    const fetchAddresses = async () => {
        try {
            const res = await axios.get('/api/users/addresses');
            const data = res?.data?.data;

            setAddresses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Fetch address error', err);
            setAddresses([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchCart(), fetchAddresses()]).finally(() =>
            setLoading(false)
        );
    }, []);

    /* ===== REMOVE ITEM ===== */
    const handleRemoveItem = async (cartId: number, dishId: number) => {
        if (!confirm('Xóa món này khỏi giỏ hàng?')) return;

        try {
            setRemovingKey(`${cartId}-${dishId}`);
            await axios.delete(`/api/cart/remove/${cartId}/${dishId}`);
            await fetchCart();
        } finally {
            setRemovingKey(null);
        }
    };

    /* ===== UPDATE QUANTITY ===== */
    const handleUpdateQuantity = async (
        cartId: number,
        dishId: number,
        newQuantity: number
    ) => {
        if (newQuantity < 1) return;

        try {
            setRemovingKey(`${cartId}-${dishId}`);
            await axios.put(`/api/cart/update-item/${cartId}`, {
                dishId,
                quantity: newQuantity,
            });
            await fetchCart();
        } finally {
            setRemovingKey(null);
        }
    };

    /* ===== UI STATES ===== */
    if (loading) {
        return (
            <p className="text-center mt-16 text-gray-400">
                Đang tải giỏ hàng…
            </p>
        );
    }

    if (carts.length === 0) {
        return (
            <p className="text-center mt-16 text-gray-400">
                Giỏ hàng của bạn đang trống 🛒
            </p>
        );
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    /* ===== UI ===== */
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-10">
            <h1 className="text-3xl font-bold text-center">
                Giỏ hàng của bạn
            </h1>

            {/* ===== ADDRESS SECTION ===== */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Địa chỉ giao hàng
                </h2>

                {addresses.length === 0 && (
                    <p className="text-sm text-gray-500">
                        Bạn chưa có địa chỉ giao hàng
                    </p>
                )}

                <div className="space-y-3">
                    {addresses.map(addr => (
                        <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer
                ${selectedAddressId === addr.id
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={selectedAddressId === addr.id}
                                onChange={() => setSelectedAddressId(addr.id)}
                                className="mt-1"
                            />
                            <div>
                                <p className="font-medium">{addr.label}</p>
                                <p className="text-sm text-gray-600">
                                    {addr.addressText}
                                </p>
                            </div>
                        </label>
                    ))}
                </div>

                <button
                    className="mt-4 text-sm text-emerald-600 hover:underline"
                    onClick={() => setShowAddAddress(true)}
                >
                    + Thêm địa chỉ mới
                </button>
            </div>

            {/* ===== CARTS ===== */}
            <div className="space-y-8">
                {carts.map(cart => (
                    <div
                        key={cart.cartId}
                        className="bg-white rounded-2xl shadow-md p-6"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-semibold text-lg">
                                Gian hàng #{cart.sellerId}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {cart.items.length} món
                            </span>
                        </div>

                        <div className="space-y-4">
                            {cart.items.map(item => (
                                <div
                                    key={item.dishId}
                                    className="flex justify-between items-center border-b pb-3"
                                >
                                    <div>
                                        <p className="font-medium">{item.dishName}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.priceSnapshot.toLocaleString()}đ × {item.quantity}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-emerald-600">
                                            {(item.priceSnapshot * item.quantity).toLocaleString()}đ
                                        </span>

                                        {/* ===== QUANTITY CONTROL ===== */}
                                        <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
                                            <button
                                                disabled={removingKey === `${cart.cartId}-${item.dishId}` || item.quantity <= 1}
                                                onClick={() =>
                                                    handleUpdateQuantity(cart.cartId, item.dishId, item.quantity - 1)
                                                }
                                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1">{item.quantity}</span>
                                            <button
                                                disabled={removingKey === `${cart.cartId}-${item.dishId}`}
                                                onClick={() =>
                                                    handleUpdateQuantity(cart.cartId, item.dishId, item.quantity + 1)
                                                }
                                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            disabled={removingKey === `${cart.cartId}-${item.dishId}`}
                                            onClick={() =>
                                                handleRemoveItem(cart.cartId, item.dishId)
                                            }
                                            className="text-red-500 text-sm hover:underline disabled:opacity-50"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                            <span className="text-lg font-semibold">Tổng cộng</span>
                            <span className="text-xl font-bold text-emerald-600">
                                {cart.totalAmount.toLocaleString()}đ
                            </span>
                        </div>

                        <button
                            disabled={!selectedAddressId}
                            onClick={() => setCheckoutCartId(cart.cartId)}
                            className="w-full mt-5 py-3 rounded-xl
    bg-emerald-500 text-white font-semibold
    hover:bg-emerald-600 transition
    disabled:opacity-50"
                        >
                            Thanh toán giỏ hàng này
                        </button>
                    </div>
                ))}
            </div>

            {showAddAddress && (
                <AddAddressModal
                    onClose={() => setShowAddAddress(false)}
                    onSuccess={fetchAddresses} // reload list địa chỉ
                />
            )}

            {checkoutCartId && selectedAddress && (
                <CheckoutCartModal
                    cartId={checkoutCartId}
                    address={selectedAddress}
                    onClose={() => setCheckoutCartId(null)}
                />
            )}
        </div>
    );
}
