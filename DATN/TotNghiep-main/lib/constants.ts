export type OrderStatus =
  | 'WAITING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED_BY_SELLER'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED_BY_BUYER'
  | 'CANCELLED_BY_PAYMENT_FAIL'
  | 'CANCELLED_BY_SELLER'
  | 'PENDING_ACCOUNT_UPGRADE'
  | 'UNKOWN';


export const ORDER_STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
  WAITING_PAYMENT: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  CONFIRMED_BY_SELLER: 'Người bán đã xác nhận',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  COMPLETED: 'Hoàn tất',
  CANCELLED_BY_BUYER: 'Người mua huỷ',
  CANCELLED_BY_SELLER: 'Người bán huỷ',
  CANCELLED_BY_PAYMENT_FAIL: 'Thanh toán thất bại',
  PENDING_ACCOUNT_UPGRADE: 'Chờ nâng cấp tài khoản',
  UNKOWN: 'Không xác định',
};


export const ORDER_STATUS_COLOR: Partial<Record<OrderStatus, string>> = {
  WAITING_PAYMENT: 'bg-gray-100 text-gray-700',
  PAID: 'bg-yellow-100 text-yellow-700',
  CONFIRMED_BY_SELLER: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED_BY_BUYER: 'bg-red-100 text-red-700',
  CANCELLED_BY_SELLER: 'bg-red-100 text-red-700',
  CANCELLED_BY_PAYMENT_FAIL: 'bg-red-100 text-red-700',
};

