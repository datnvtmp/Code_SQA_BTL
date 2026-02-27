'use client';

import { useState } from 'react';
import { createAddress } from '../../services/address.service';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAddressModal({ onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        label: '',
        addressText: '',
        lat: '',
        lng: '',
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const submit = async () => {
        if (!form.label || !form.addressText) {
            alert('Vui lòng nhập nhãn và địa chỉ');
            return;
        }

        try {
            setLoading(true);
            await createAddress({
                label: form.label,
                addressText: form.addressText,
                lat: Number(form.lat) || 0,
                lng: Number(form.lng) || 0,
            });
            onSuccess();
            onClose();
        } catch (e) {
            alert('Không thể thêm địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-center">
                    Thêm địa chỉ giao hàng
                </h2>

                <input
                    name="label"
                    placeholder="Nhãn (Nhà riêng, Công ty...)"
                    className="input"
                    onChange={onChange}
                />

                <input
                    name="addressText"
                    placeholder="Địa chỉ đầy đủ"
                    className="input"
                    onChange={onChange}
                />

                <div className="grid grid-cols-2 gap-3">
                    <input
                        name="lat"
                        placeholder="Latitude"
                        className="input"
                        onChange={onChange}
                    />
                    <input
                        name="lng"
                        placeholder="Longitude"
                        className="input"
                        onChange={onChange}
                    />
                </div>

                <div className="flex gap-3 pt-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 border rounded-xl"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 text-white"
                    >
                        {loading ? 'Đang lưu…' : 'Lưu địa chỉ'}
                    </button>
                </div>
            </div>
        </div>
    );
}
