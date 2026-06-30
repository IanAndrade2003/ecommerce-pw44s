import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { IOrder } from "@/commons/types";
import OrderService from "@/services/order-service";

export const OrdersPage = () => {
  const toast = useRef<Toast>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.findAll().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data as IOrder[]);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar os pedidos.",
          life: 3000,
        });
      }
      setLoading(false);
    });
  }, []);

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("pt-BR");
  };

  const itemsBody = (order: IOrder) => (
    <ul className="m-0 pl-4">
      {order.items?.map((item, idx) => (
        <li key={idx} style={{ color: "var(--text-color-secondary)" }}>
          Produto #{item.productId} — {item.quantity}x{" "}
          {item.price != null ? brl(item.price) : ""}
        </li>
      ))}
    </ul>
  );

  const totalBody = (order: IOrder) =>
    order.totalValue != null ? brl(order.totalValue) : "-";

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4"
      style={{ backgroundColor: "var(--surface-ground)" }}
    >
      <Toast ref={toast} />
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
          Meus Pedidos
        </h1>
        <p className="mb-8" style={{ color: "var(--text-color-secondary)" }}>
          Histórico de pedidos finalizados da sua conta.
        </p>

        <div
          className="rounded-2xl shadow border overflow-hidden"
          style={{
            backgroundColor: "var(--surface-card)",
            borderColor: "var(--surface-border)",
          }}
        >
          <DataTable
            value={orders}
            loading={loading}
            emptyMessage="Nenhum pedido finalizado encontrado."
            stripedRows
            paginator={orders.length > 10}
            rows={10}
          >
            <Column field="id" header="Pedido #" sortable style={{ width: "100px" }} />
            <Column
              field="date"
              header="Data"
              sortable
              body={(row: IOrder) => formatDate(row.date)}
            />
            <Column header="Itens" body={itemsBody} />
            <Column
              field="totalValue"
              header="Total"
              sortable
              body={totalBody}
              style={{ width: "140px" }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
