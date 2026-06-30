import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import type { IProduct, ICategory } from "@/commons/types";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { useCart } from "@/context/CartContext";

export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<IProduct | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const filteredProducts = selectedCategoryId
    ? products.filter(
        (p) => p.category?.id === selectedCategoryId || p.categoryId === selectedCategoryId
      )
    : products;

  useEffect(() => {
    ProductService.findAll().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data as IProduct[]);
      }
      setLoading(false);
    });

    CategoryService.findAll().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data as ICategory[]);
      }
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

  const handleSearchById = async () => {
    const id = parseInt(searchId, 10);
    if (!id || id <= 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Informe um ID de produto válido.",
        life: 3000,
      });
      return;
    }

    setSearchLoading(true);
    setSearchResult(null);
    const response = await ProductService.findById(id);
    if (response.success && response.data) {
      setSearchResult(response.data as IProduct);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Não encontrado",
        detail: `Nenhum produto com ID ${id}.`,
        life: 3000,
      });
    }
    setSearchLoading(false);
  };

  const renderProductCard = (product: IProduct) => (
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
          {product.category?.name ?? "Geral"} · ID {product.id}
        </span>
        <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-color)" }}>
          {product.name}
        </h3>
        <p
          className="text-sm mb-4 line-clamp-2 flex-1"
          style={{ color: "var(--text-color-secondary)" }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold" style={{ color: "var(--text-color)" }}>
            {brl(product.price)}
          </span>
          
        </div>
        <div className="flex items-center justify-between mt-auto">
          <Button
            icon="pi pi-cart-plus"
            label="Comprar"
            size="small"
            onClick={() => handleAdd(product)}
            
          />
          <Button
              label="Detalhes"
              icon="pi pi-info-circle"
              className="p-button-secondary p-button-sm"
            />
        </div>
      </div>
    </div>
  );

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

        <div
          className="p-5 rounded-2xl shadow border mb-8 flex flex-col sm:flex-row gap-3 items-end"
          style={{
            backgroundColor: "var(--surface-card)",
            borderColor: "var(--surface-border)",
          }}
        >
          <div className="flex-1 w-full">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-color-secondary)" }}
            >
              Buscar produto por ID
            </label>
            <InputText
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ex: 1"
              className="w-full"
              keyfilter="pint"
              onKeyDown={(e) => e.key === "Enter" && handleSearchById()}
            />
          </div>
          <Button
            label="Buscar"
            icon="pi pi-search"
            loading={searchLoading}
            onClick={handleSearchById}
          />
        </div>

        {searchResult && (
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-color)" }}
            >
              Resultado da busca
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {renderProductCard(searchResult)}
            </div>
          </div>
        )}

        {/* Filtro por Categorias */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--text-color)" }}
          >
            <i className="pi pi-filter text-indigo-500"></i> Categorias
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm border ${
                selectedCategoryId === null
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent"
                  : "bg-surface-card hover:bg-surface-hover border-surface-border text-color"
              }`}
              style={{
                backgroundColor: selectedCategoryId === null ? undefined : "var(--surface-card)",
                borderColor: selectedCategoryId === null ? undefined : "var(--surface-border)",
                color: selectedCategoryId === null ? undefined : "var(--text-color)",
              }}
            >
              🚀 Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => cat.id && setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm border whitespace-nowrap ${
                  selectedCategoryId === cat.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent"
                    : "bg-surface-card hover:bg-surface-hover border-surface-border text-color"
                }`}
                style={{
                  backgroundColor: selectedCategoryId === cat.id ? undefined : "var(--surface-card)",
                  borderColor: selectedCategoryId === cat.id ? undefined : "var(--surface-border)",
                  color: selectedCategoryId === cat.id ? undefined : "var(--text-color)",
                }}
              >
                🏷️ {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-color-secondary)" }}>Carregando produtos...</p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ color: "var(--text-color-secondary)" }}>Nenhum produto encontrado nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => renderProductCard(product))}
          </div>
        )}
      </div>
    </div>
  );
};
