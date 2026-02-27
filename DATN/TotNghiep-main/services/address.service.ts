// services/address.service.ts
import axios from './axios';

export interface CreateAddressPayload {
  label: string;        // VD: Nhà riêng, Công ty
  addressText: string;  // Địa chỉ đầy đủ
  lat: number;
  lng: number;
}

export const getMyAddresses = () =>
  axios.get('/api/users/addresses');

export const createAddress = (data: CreateAddressPayload) =>
  axios.post('/api/users/addresses', data);
