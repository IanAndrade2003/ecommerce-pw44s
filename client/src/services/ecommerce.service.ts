import { api } from './api';
import type {IProduct,ICategory,IOrder,IAddress,IUser,} from '../commons/types';

export const ProductService = {
  // Consome GET /products
  findAll: () => api.get<IProduct[]>('/products'),
  findById: (id: number) => api.get<IProduct>(`/products/${id}`),
};

export const CategoryService = {
  // Consome GET /categories
  findAll: () => api.get<ICategory[]>('/categories'),
};

export const OrderService = {
  // Consome POST e GET /orders
  create: (order: IOrder) => api.post<IOrder>('/orders', order),
  listMyOrders: () => api.get<IOrder[]>('/orders'),
};

export const AddressService = {
  // Consome POST e GET /addresses
  create: (address: IAddress) => api.post<IAddress>('/addresses', address),
  listMyAddresses: () => api.get<IAddress[]>('/addresses'),
};

export const UserService = {
  // Consome POST /users
  register: (user: IUser) => api.post('/users', user),
};
