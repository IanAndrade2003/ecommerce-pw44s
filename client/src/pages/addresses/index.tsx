import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import AddressService from "@/services/address-service";

interface AddressForm {
  zipcode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface SavedAddress {
  id: number;
  street: string;
  number: number;
  zipCode: string;
  complement?: string;
}

const labelStyle = { color: "var(--text-color-secondary)" } as const;
const cardStyle = {
  backgroundColor: "var(--surface-card)",
  borderColor: "var(--surface-border)",
} as const;

const emptyForm: AddressForm = {
  zipcode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export const AddressesPage = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  const loadAddresses = async () => {
    const response = await AddressService.findAll();
    if (response.success && Array.isArray(response.data)) {
      setAddresses(response.data as SavedAddress[]);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

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

      setForm((prev) => ({
        ...prev,
        street: response.data.logradouro || prev.street,
        neighborhood: response.data.bairro || prev.neighborhood,
        city: response.data.localidade || prev.city,
        state: response.data.uf || prev.state,
      }));
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

  const handleSubmit = async () => {
    if (!form.street || !form.number || !form.zipcode) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Preencha CEP, rua e número.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    const response = await AddressService.save({
      street: form.street,
      number: Number(form.number.replace(/\D/g, "")) || 0,
      zipCode: form.zipcode.replace(/\D/g, ""),
      complement:
        [form.complement, form.neighborhood, form.city && `${form.city}-${form.state}`]
          .filter(Boolean)
          .join(", ") || undefined,
    });

    if (response.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Endereço cadastrado com sucesso!",
        life: 3000,
      });
      setForm(emptyForm);
      await loadAddresses();
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível cadastrar o endereço.",
        life: 3000,
      });
    }
    setLoading(false);
  };

  const formatZipCode = (zip: string) => {
    const clean = zip.replace(/\D/g, "");
    return clean.length === 8 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : zip;
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4"
      style={{ backgroundColor: "var(--surface-ground)" }}
    >
      <Toast ref={toast} />
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
          Meus Endereços
        </h1>
        <p className="mb-8" style={{ color: "var(--text-color-secondary)" }}>
          Cadastre e gerencie os endereços da sua conta.
        </p>

        <div className="p-6 rounded-2xl shadow border mb-8" style={cardStyle}>
          <h2
            className="text-xl font-semibold mb-5 flex items-center gap-2"
            style={{ color: "var(--text-color)" }}
          >
            <i className="pi pi-plus-circle text-indigo-500" /> Novo Endereço
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                CEP
              </label>
              <InputMask
                mask="99999-999"
                value={form.zipcode}
                onChange={(e) => setForm({ ...form, zipcode: e.value || "" })}
                onBlur={(e) => searchCep(e.target.value)}
                placeholder="00000-000"
                className="w-full"
              />
              {cepLoading && <small style={labelStyle}>Buscando CEP...</small>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Número
              </label>
              <InputText
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="w-full"
                keyfilter="pint"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Rua / Logradouro
              </label>
              <InputText
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Bairro
              </label>
              <InputText
                value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Complemento
              </label>
              <InputText
                value={form.complement}
                onChange={(e) => setForm({ ...form, complement: e.target.value })}
                className="w-full"
                placeholder="Apto, bloco..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Cidade
              </label>
              <InputText
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>
                Estado (UF)
              </label>
              <InputText
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <Button
            label="Cadastrar Endereço"
            icon="pi pi-check"
            className="mt-5"
            loading={loading}
            onClick={handleSubmit}
          />
        </div>

        <div className="p-6 rounded-2xl shadow border" style={cardStyle}>
          <h2
            className="text-xl font-semibold mb-5 flex items-center gap-2"
            style={{ color: "var(--text-color)" }}
          >
            <i className="pi pi-map-marker text-indigo-500" /> Endereços Cadastrados
          </h2>

          {addresses.length === 0 ? (
            <p style={{ color: "var(--text-color-secondary)" }}>
              Nenhum endereço cadastrado ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl border"
                  style={{ borderColor: "var(--surface-border)" }}
                >
                  <p className="font-semibold m-0" style={{ color: "var(--text-color)" }}>
                    {addr.street}, {addr.number}
                  </p>
                  <p className="text-sm m-0 mt-1" style={labelStyle}>
                    CEP: {formatZipCode(addr.zipCode)}
                  </p>
                  {addr.complement && (
                    <p className="text-sm m-0 mt-1" style={labelStyle}>
                      {addr.complement}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
