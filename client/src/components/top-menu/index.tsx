import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { useCart } from "@/context/CartContext";
import { InputSwitch } from "primereact/inputswitch";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const { authenticated, authenticatedUser, handleLogout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = darkMode
        ? "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css"
        : "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css";
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const items: MenuItem[] = authenticated
    ? [
        { label: "Loja", icon: "pi pi-shop", command: () => navigate("/") },
        {
          label: "Categorias",
          icon: "pi pi-tags",
          items: [
            { label: "Listar", icon: "pi pi-list", command: () => navigate("/categories") },
            { label: "Nova", icon: "pi pi-plus", command: () => navigate("/categories/new") },
          ],
        },
        {
          label: "Produtos",
          icon: "pi pi-box",
          items: [
            { label: "Listar", icon: "pi pi-list", command: () => navigate("/products") },
            { label: "Novo", icon: "pi pi-plus", command: () => navigate("/products/new") },
          ],
        },
      ]
    : [];

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer mr-3"
      onClick={() => navigate("/")}
    >
      <i className="pi pi-bolt text-2xl text-primary" />
      <span className="font-bold text-lg hidden sm:block">MyDrugs</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <div className="flex items-center gap-2">
        <i
          className={`pi pi-sun ${darkMode ? "text-gray-400" : "text-yellow-500"}`}
          style={{ marginTop: "5px" }}
        />
        <InputSwitch checked={darkMode} onChange={(e) => setDarkMode(e.value ?? false)} />
        <i
          className={`pi pi-moon ${darkMode ? "text-blue-300" : "text-gray-400"}`}
          style={{ marginTop: "5px" }}
        />
      </div>

      {authenticated && (
        <>
          <button
            type="button"
            className="p-link relative"
            onClick={() => navigate("/checkout")}
            title="Carrinho"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <i className="pi pi-shopping-cart text-xl" style={{ color: "var(--text-color)" }} />
            {cartCount > 0 && (
              <Badge
                value={cartCount}
                severity="danger"
                style={{ position: "absolute", top: "-8px", right: "-10px" }}
              />
            )}
          </button>
          <span className="font-semibold hidden sm:block">
            {authenticatedUser?.displayName ?? authenticatedUser?.username ?? "Usuário"}
          </span>
          <Avatar
            image={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${
              authenticatedUser?.username ?? "guest"
            }`}
            shape="circle"
          />
          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={handleLogoutClick}
            tooltip="Sair"
          />
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "var(--surface-ground)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default TopMenu;
