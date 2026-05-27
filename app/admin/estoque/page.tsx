import { InventoryPage } from "@/components/admin/inventory-page";

export const metadata = {
  title: "Estoque — Gurgel Team",
  description:
    "Controle de estoque técnico: peças, movimentações, fornecedores e compras do paddock.",
};

export default function AdminInventoryPage() {
  return <InventoryPage />;
}
