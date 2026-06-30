import type { IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const save = async (address: {
  street: string;
  number: number;
  zipCode: string;
  complement?: string;
}): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/addresses", address);
    response = {
      status: 201,
      success: true,
      message: "Endereço salvo com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao salvar endereço",
      data: err.response?.data,
    };
  }
  return response;
};

const findAll = async (): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get("/addresses");
    response = {
      status: 200,
      success: true,
      message: "Endereços carregados com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao carregar endereços",
      data: err.response?.data,
    };
  }
  return response;
};

const AddressService = { save, findAll };
export default AddressService;
