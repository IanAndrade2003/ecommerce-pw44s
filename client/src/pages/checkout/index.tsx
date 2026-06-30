import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import axios from "axios";
import { api } from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import OrderService from "@/services/order-service";
import AddressService from "@/services/address-service";

interface CheckoutAddress {
  zipcode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const labelStyle = { color: "var(--text-color-secondary)" } as const;
const cardStyle = {
  backgroundColor: "var(--surface-card)",
  borderColor: "var(--surface-border)",
} as const;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { cart, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [shipping, setShipping] = useState<number>(0);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [address, setAddress] = useState<CheckoutAddress>({
    zipcode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  // Redireciona se o carrinho estiver vazio
  useEffect(() => {
    if (cart.length === 0) navigate("/");
  }, [cart, navigate]);

  // Carrega os endereços já cadastrados do usuário
  useEffect(() => {
    AddressService.findAll().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setSavedAddresses(res.data);
      }
    });
  }, []);

  const handleSelectSavedAddress = (addr: any) => {
    setSelectedAddressId(addr.id);

    let comp = "";
    let neigh = "";
    let city = "";
    let state = "";

    if (addr.complement) {
      const parts = addr.complement.split(",").map((p: string) => p.trim());
      if (parts.length >= 1) comp = parts[0];
      if (parts.length >= 2) neigh = parts[1];
      if (parts.length >= 3) {
        const cityState = parts[2].split("-").map((p: string) => p.trim());
        if (cityState.length >= 1) city = cityState[0];
        if (cityState.length >= 2) state = cityState[1];
      }
    }

    setAddress({
      zipcode: addr.zipCode || "",
      street: addr.street || "",
      number: String(addr.number || ""),
      complement: comp || addr.complement || "",
      neighborhood: neigh || "",
      city: city || "",
      state: state || "",
    });

    if (addr.zipCode) {
      searchCep(addr.zipCode);
    }
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId(null);
    setAddress({
      zipcode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    });
    setShipping(0);
  };

  // Busca o CEP na API ViaCEP e calcula o frete
  const searchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    try {
      setCepLoading(true);
      const response = await axios.get(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      if (response.data.erro) {
        toast.current?.show({
          severity: "warn",
          summary: "Aviso",
          detail: "CEP não encontrado.",
          life: 3000,
        });
        return;
      }

      setAddress((prev) => ({
        ...prev,
        street: response.data.logradouro || prev.street,
        neighborhood: response.data.bairro || prev.neighborhood,
        city: response.data.localidade || prev.city,
        state: response.data.uf || prev.state,
      }));

      const uf = response.data.uf;
      const freightCost =
        uf === "PR" ? 10 : uf === "SP" ? 15 : uf === "SC" || uf === "RS" ? 20 : 35;
      setShipping(freightCost);

      toast.current?.show({
        severity: "info",
        summary: "Frete Calculado",
        detail: `Valor do frete: R$ ${freightCost},00`,
        life: 3000,
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao buscar o CEP.",
        life: 3000,
      });
    } finally {
      setCepLoading(false);
    }
  };

  // Salva o endereço no backend (best-effort, não bloqueia o pedido)
  const saveAddress = async () => {
    try {
      await api.post("/addresses", {
        street: address.street,
        number: Number(address.number.replace(/\D/g, "")) || 0,
        zipCode: address.zipcode.replace(/\D/g, ""),
        complement:
          [address.complement, address.neighborhood, address.city && `${address.city}-${address.state}`]
            .filter(Boolean)
            .join(", ") || undefined,
      });
    } catch {
      // não impede a finalização do pedido
    }
  };

  const handleCheckout = async () => {
    if (!address.street || !address.number || !address.zipcode) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Preencha o endereço de entrega (CEP, rua e número).",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    if (selectedAddressId === null) {
      await saveAddress();
    }

    const order = {
      items: cart.map((item) => ({
        productId: item.id as number,
        quantity: item.quantity,
      })),
    };

    const response = await OrderService.save(order);

    if (response.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Pedido realizado com sucesso!",
        life: 3000,
      });
      setTimeout(() => {
        clearCart();
        navigate("/");
      }, 1500);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível finalizar o pedido.",
        life: 3000,
      });
      setLoading(false);
    }
  };

  const grandTotal = cartTotal + shipping;
  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div
      className="min-h-screen py-10 px-4 pt-24"
      style={{ backgroundColor: "var(--surface-ground)" }}
    >
      <Toast ref={toast} />
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8" style={{ color: "var(--text-color)" }}>
          Finalizar Compra
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Coluna da Esquerda: Endereço e Pagamento */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <div className="p-6 rounded-2xl shadow border" style={cardStyle}>
              <h2
                className="text-xl font-semibold mb-5 flex items-center gap-2"
                style={{ color: "var(--text-color)" }}
              >
                <i className="pi pi-map-marker text-indigo-500 text-2xl"></i> Endereço de
                Entrega
              </h2>

              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <span className="block text-sm font-semibold mb-3" style={labelStyle}>
                    Selecione um endereço salvo:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-md ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50/10 shadow-sm"
                              : "border-surface-border bg-surface-card hover:border-indigo-400"
                          }`}
                          style={{
                            borderColor: isSelected ? "var(--primary-color)" : "var(--surface-border)",
                            backgroundColor: isSelected ? "rgba(99, 102, 241, 0.05)" : "var(--surface-card)",
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm" style={{ color: "var(--text-color)" }}>
                              🏠 {addr.street}, {addr.number}
                            </span>
                            {isSelected && (
                              <i className="pi pi-check-circle text-indigo-500 text-lg"></i>
                            )}
                          </div>
                          <span className="text-xs" style={labelStyle}>
                            CEP: {addr.zipCode}
                            {addr.complement && ` · ${addr.complement}`}
                          </span>
                        </div>
                      );
                    })}

                    {/* Cartão de Novo Endereço */}
                    <div
                      onClick={handleSelectNewAddress}
                      className={`p-4 rounded-xl border border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md ${
                        selectedAddressId === null
                          ? "border-indigo-500 bg-indigo-50/10 shadow-sm"
                          : "border-surface-border bg-surface-card hover:border-indigo-400"
                      }`}
                      style={{
                        borderColor: selectedAddressId === null ? "var(--primary-color)" : "var(--surface-border)",
                        backgroundColor: selectedAddressId === null ? "rgba(99, 102, 241, 0.05)" : "var(--surface-card)",
                      }}
                    >
                      <i className="pi pi-plus text-indigo-500"></i>
                      <span className="font-semibold text-sm" style={{ color: "var(--text-color)" }}>
                        Outro Endereço
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    CEP
                  </label>
                  <InputMask
                    mask="99999-999"
                    value={address.zipcode}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, zipcode: e.value || "" });
                    }}
                    onBlur={(e) => searchCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full"
                  />
                  {cepLoading && <small style={labelStyle}>Buscando CEP...</small>}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    Número
                  </label>
                  <InputText
                    value={address.number}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, number: e.target.value });
                    }}
                    className="w-full"
                    keyfilter="pint"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    Rua / Logradouro
                  </label>
                  <InputText
                    value={address.street}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, street: e.target.value });
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    Bairro
                  </label>
                  <InputText
                    value={address.neighborhood}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, neighborhood: e.target.value });
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    Complemento
                  </label>
                  <InputText
                    value={address.complement}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, complement: e.target.value });
                    }}
                    className="w-full"
                    placeholder="Apto, bloco..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    Cidade
                  </label>
                  <InputText
                    value={address.city}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, city: e.target.value });
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={labelStyle}>
                    Estado (UF)
                  </label>
                  <InputText
                    value={address.state}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setAddress({ ...address, state: e.target.value });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl shadow border" style={cardStyle}>
              <h2
                className="text-xl font-semibold mb-5 flex items-center gap-2"
                style={{ color: "var(--text-color)" }}
              >
                <i className="pi pi-credit-card text-indigo-500 text-2xl"></i> Pagamento
              </h2>
              <div className="p-4 rounded-lg bg-blue-50 text-blue-800 flex items-center gap-3">
                <i className="pi pi-info-circle text-xl"></i>
                <p className="m-0 text-sm font-medium">
                  Nesta fase de desenvolvimento, o pagamento será processado
                  automaticamente via "Boleto Fictício".
                </p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Resumo do Pedido */}
          <div className="lg:w-1/3">
            <div
              className="p-6 rounded-2xl shadow-lg border sticky top-24"
              style={{ ...cardStyle, borderColor: "var(--primary-color, #6366f1)" }}
            >
              <h2
                className="text-xl font-semibold mb-5"
                style={{ color: "var(--text-color)" }}
              >
                Resumo do Pedido
              </h2>

              <div className="flex flex-col gap-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-3 border-b"
                    style={{ borderColor: "var(--surface-border)" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className="font-medium line-clamp-1"
                        style={{ color: "var(--text-color)" }}
                      >
                        {item.name}
                      </span>
                      <span className="text-sm" style={labelStyle}>
                        {item.quantity}x de {brl(item.price)}
                      </span>
                    </div>
                    <span className="font-bold" style={{ color: "var(--text-color)" }}>
                      {brl(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="flex flex-col gap-3 pt-4 mb-6 border-t"
                style={{ borderColor: "var(--surface-border)" }}
              >
                <div className="flex justify-between" style={labelStyle}>
                  <span>Subtotal</span>
                  <span>{brl(cartTotal)}</span>
                </div>
                <div className="flex justify-between" style={labelStyle}>
                  <span>Frete</span>
                  <span>{shipping === 0 ? "A calcular" : brl(shipping)}</span>
                </div>
                <div
                  className="flex justify-between text-xl font-bold mt-2 pt-2 border-t"
                  style={{ color: "var(--text-color)", borderColor: "var(--surface-border)" }}
                >
                  <span>Total</span>
                  <span className="text-green-500">{brl(grandTotal)}</span>
                </div>
              </div>

              <Button
                label="Confirmar e Pagar"
                icon="pi pi-check"
                size="large"
                className="w-full p-button-success"
                loading={loading}
                onClick={handleCheckout}
                disabled={cart.length === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
