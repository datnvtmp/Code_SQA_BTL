'use client';

import { useState, useEffect } from 'react';
import api from '@/services/axios';
import Header from '@/components/Common/Header';
import { useAuthStore } from '@/store/useAuthStore';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  grossAmount?: number | null;
  commission?: number | null;
  orderId?: number;
  description: string;
  status?: string | null;
  createdAt: string;
}

export default function SellerWalletPage() {
  const { hydrated, isLoggedIn } = useAuthStore();
  const [wallet, setWallet] = useState<{ balance: number; pending: number }>({
    balance: 0,
    pending: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [bankInfo, setBankInfo] = useState({
    bankCode: '',
    cardNumber: '',
    cardHolderName: '',
  });
  const [note, setNote] = useState('');

  const fetchWallet = async () => {
    const res = await api.get('/api/seller/wallet/my-waller');
    setWallet({
      balance: res.data.data?.availableBalance || 0,
      pending: res.data.data?.pendingBalance || 0,
    });
  };

  const fetchTransactions = async () => {
    const res = await api.get('/api/seller/wallet/transactions');
    setTransactions(res.data.data || []);
  };

  useEffect(() => {
    if (hydrated && isLoggedIn) {
      const fetchData = async () => {
        await fetchWallet();
        await fetchTransactions();
      };
      fetchData();
    }
  }, [hydrated, isLoggedIn]);

  const handleWithdraw = async () => {
    if (withdrawAmount <= 0 || withdrawAmount > wallet.balance) {
      alert('Số tiền không hợp lệ');
      return;
    }
    if (!bankInfo.bankCode || !bankInfo.cardNumber || !bankInfo.cardHolderName) {
      alert('Vui lòng nhập đầy đủ thông tin ngân hàng');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/seller/wallet/with-draw', {
        amount: withdrawAmount,
        bankInfo,
        note,
      });
      alert('Rút tiền thành công (mock)');
      setShowWithdrawModal(false);
      setWithdrawAmount(0);
      setBankInfo({ bankCode: '', cardNumber: '', cardHolderName: '' });
      setNote('');
      await fetchWallet();
      await fetchTransactions();
    } catch (err) {
      console.error(err);
      alert('Rút tiền thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return <div className="p-6">Đang khởi tạo...</div>;
  if (!isLoggedIn) return <div className="p-6">Vui lòng đăng nhập</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-5xl mx-auto px-4 pb-10 space-y-8">

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Ví Người Bán</h1>

          {/* Thông tin ví */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-gray-500 uppercase font-semibold mb-2">Số dư khả dụng</div>
              <div className="text-4xl font-extrabold text-green-600">{wallet.balance.toLocaleString()}₫</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-gray-500 uppercase font-semibold mb-2">Số dư Pending</div>
              <div className="text-4xl font-extrabold text-yellow-600">{wallet.pending.toLocaleString()}₫</div>
            </div>
          </div>

          {/* Rút tiền */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="font-semibold text-xl text-gray-700">Rút tiền</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
              onClick={() => setShowWithdrawModal(true)}
            >
              Rút tiền
            </button>
          </div>

          {/* Modal rút tiền */}
          {showWithdrawModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Rút tiền</h3>

                <div className="space-y-3">
                  <label className="font-medium text-gray-600">Số tiền</label>
                  <input
                    type="number"
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    placeholder="Nhập số tiền muốn rút"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-medium text-gray-600">Ngân hàng</label>
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    value={bankInfo.bankCode}
                    onChange={(e) => setBankInfo({ ...bankInfo, bankCode: e.target.value })}
                    placeholder="Mã ngân hàng"
                  />
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    value={bankInfo.cardNumber}
                    onChange={(e) => setBankInfo({ ...bankInfo, cardNumber: e.target.value })}
                    placeholder="Số thẻ"
                  />
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    value={bankInfo.cardHolderName}
                    onChange={(e) => setBankInfo({ ...bankInfo, cardHolderName: e.target.value })}
                    placeholder="Tên chủ thẻ"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-medium text-gray-600">Ghi chú (tùy chọn)</label>
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
                    onClick={() => setShowWithdrawModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium w-full sm:w-auto"
                    onClick={handleWithdraw}
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Rút tiền'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lịch sử giao dịch */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-semibold text-xl text-gray-700 mb-4">Lịch sử giao dịch</h2>
            {transactions.length === 0 ? (
              <div className="text-gray-400 italic">Chưa có giao dịch</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                {transactions.map((t) => (
                  <div key={t.id} className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-gray-700">{t.type}</span>
                      <span className="text-gray-500">{new Date(t.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-600 sm:flex-1">{t.description}</div>
                    <div className={`font-bold ${t.type === 'RELEASE_PENDING' ? 'text-yellow-600' : 'text-green-600'} text-right`}>
                      {t.amount.toLocaleString()}₫
                    </div>
                    <div className="text-gray-500 text-right">{t.status || 'COMPLETED'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
