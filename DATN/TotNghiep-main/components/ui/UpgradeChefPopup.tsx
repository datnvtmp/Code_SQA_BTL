'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

interface UpgradeChefPopupProps {
  onClose: () => void;
}

interface VipPackage {
  id: number;
  name: string;
  price: number;
}

interface UpgradeResponse {
  status: number;
  message: string;
  data?: {
    code: string;
    message: string;
    paymentUrl: string;
    txnRef?: string;
  };
  errs?: string;
}

const UpgradeChefPopup = ({ onClose }: UpgradeChefPopupProps) => {
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // <-- thêm trạng thái lỗi

  const token = useAuthStore.getState().token;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/payment`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        const pkgList = Array.isArray(json) ? json : json.data;
        if (!Array.isArray(pkgList)) throw new Error("Dữ liệu gói không hợp lệ");
        setPackages(pkgList);
      } catch (error) {
        console.error("Fetch packages failed:", error);
        setErrorMsg("Không tải được danh sách gói VIP. Vui lòng thử lại.");
      }
    };
    fetchPackages();
  }, [token]);


  const handleUpgrade = async () => {
    if (!selectedPackageId) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/payment/packages/upgrade-chef?packageId=${selectedPackageId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: UpgradeResponse = await res.json();

      // Nếu không thành công thì luôn báo "Tài khoản đã là đầu bếp"
      if (!res.ok || !data.data?.paymentUrl) {
        setErrorMsg("Tài khoản đã là đầu bếp");
        setLoading(false);
        return;
      }

      // Thành công thì chuyển sang thanh toán
      window.location.href = data.data.paymentUrl;
    } catch (error) {
      console.error("Upgrade failed:", error);
      setErrorMsg("Tài khoản đã là đầu bếp");
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[360px] max-h-[80vh] overflow-y-auto text-center space-y-4">
        <p className="text-lg font-semibold">Nâng cấp tài khoản Chef</p>
        <p className="text-sm text-gray-600">
          Để có công thức nấu ăn và trở thành một người bán hàng chuyên nghiệp bạn cần nâng cấp tài khoản lên Chef.
        </p>

        {packages.length === 0 ? (
          <p>Đang tải gói VIP...</p>
        ) : (
          <div className="space-y-2">
            {packages.map((pkg) => (
              <label
                key={pkg.id}
                className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedPackageId === pkg.id ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <span>{pkg.name} - {pkg.price.toLocaleString()}₫</span>
                <input
                  type="radio"
                  name="vipPackage"
                  value={pkg.id}
                  checked={selectedPackageId === pkg.id}
                  onChange={() => setSelectedPackageId(pkg.id)}
                  className="accent-pink-500"
                  disabled={loading}
                />
              </label>
            ))}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg p-2 mt-2">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading || !selectedPackageId}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg w-full disabled:opacity-50 transition-colors duration-200 font-medium"
        >
          {loading ? "Đang chuyển hướng..." : "Thanh toán & Nâng cấp"}
        </button>

        <button
          onClick={onClose}
          className="block text-gray-500 text-sm w-full mt-2 hover:text-gray-700 transition-colors duration-200"
          disabled={loading}
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
};

export default UpgradeChefPopup;
