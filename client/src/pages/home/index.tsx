import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { useCart } from "@/context/CartContext";

export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    ProductService.findAll().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data as IProduct[]);
      }
      setLoading(false);
    });
  }, []);

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleAdd = (product: IProduct) => {
    addToCart(product);
    toast.current?.show({
      severity: "success",
      summary: "Adicionado",
      detail: `${product.name} foi adicionado ao carrinho.`,
      life: 2000,
    });
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4"
      style={{ backgroundColor: "var(--surface-ground)" }}
    >
      <Toast ref={toast} />
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
              Nossa Loja
            </h1>
            <p style={{ color: "var(--text-color-secondary)" }}>
              Escolha seus produtos e finalize a compra.
            </p>
          </div>
          <Button
            label={`Carrinho (${cartCount})`}
            icon="pi pi-shopping-cart"
            onClick={() => navigate("/checkout")}
            disabled={cartCount === 0}
          />
        </div>

        {loading ? (
          <p style={{ color: "var(--text-color-secondary)" }}>Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p style={{ color: "var(--text-color-secondary)" }}>Nenhum produto disponível.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl shadow-sm border overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: "var(--surface-card)",
                  borderColor: "var(--surface-border)",
                }}
              >
                <div className="h-40 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <i className="pi pi-prime text-white text-5xl opacity-80" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs uppercase tracking-wide font-semibold mb-1 text-indigo-400">
                    {product.category?.name ?? "Geral"}
                  </span>
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{ color: "var(--text-color)" }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-sm mb-4 line-clamp-2 flex-1"
                    style={{ color: "var(--text-color-secondary)" }}
                  >
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className="text-xl font-bold"
                      style={{ color: "var(--text-color)" }}
                    >
                      {brl(product.price)}
                    </span>
                    <Button
                      icon="pi pi-cart-plus"
                      label="Comprar"
                      size="small"
                      onClick={() => handleAdd(product)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
