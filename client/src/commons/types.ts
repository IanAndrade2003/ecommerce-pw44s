export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
}

export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: object
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ICategory {
  id?: number;
  name: string;
}

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;     
  category?: ICategory;   
  imageName?: string;
  contentType?: string;
}

export interface IAddress {
  id?: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface IUser {
  id?: number;
  displayName: string;
  username: string;
  password: string;
}

export interface IOrderItem {
  productId: number;
  quantity: number;
  price?: number;
}

export interface IOrder {
  id?: number;
  items: IOrderItem[];
  totalValue?: number;
  date?: string;
}