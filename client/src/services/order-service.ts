import type { IOrder, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const save = async (order: IOrder): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/orders", order);
    response = {
      status: 200,
      success: true,
      message: "Pedido realizado com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao processar o pedido",
      data: err.response?.data,
    };
  }
  return response;
};

const OrderService = { save };
export default OrderService;