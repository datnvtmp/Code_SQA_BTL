'use client';

import { useState } from 'react';
import axios from '../../services/axios';

interface Address {
  id: number;
  label: string;
  addressText: string;
}

interface Props {
  cartId: number;
  address: Address;
  onClose: () => void;
}

export default function CheckoutCartModal({
  cartId,
  address,
  onClose,
}: Props) {
  const [shippingNote, setShippingNote] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `/api/payment/checkout/cart/${cartId}/online-payment`,
        null,
        {
          params: {
            addressId: address.id,
            shippingNote: shippingNote || undefined,
          },
        }
      );

      const paymentUrl = res?.data?.data?.paymentUrl;

      if (!paymentUrl) {
        alert('Không nhận được link thanh toán');
        return;
      }

      window.location.href = paymentUrl;
    } catch (err) {
      alert('Không thể tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
        <h2 className="text-xl font-semibold text-center">
          Xác nhận thanh toán
        </h2>

        {/* ADDRESS */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">
            Địa chỉ giao hàng
          </p>
          <p className="font-medium">{address.label}</p>
          <p className="text-sm text-gray-600">
            {address.addressText}
          </p>
        </div>

        {/* NOTE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ghi chú giao hàng (không bắt buộc)
          </label>
          <textarea
            value={shippingNote}
            onChange={e => setShippingNote(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border rounded-xl"
          >
            Hủy
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-emerald-500 text-white font-semibold disabled:opacity-50"
          >
            {loading ? 'Đang xử lý…' : 'Thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
}
