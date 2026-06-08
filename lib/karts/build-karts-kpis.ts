import type { FleetKartListItem, KartKpi } from "@/lib/admin-karts-mocks";



/** IDs fixos dos KPIs da página de karts (sempre exibir os 6 cards). */

export const KART_KPI_IDS = [

  "total",

  "disp",

  "manut",

  "prop",

  "cli",

  "pend",

] as const;



export function buildKartsKpisFromFleet(fleet: FleetKartListItem[]): KartKpi[] {

  const total = fleet.length;

  const available = fleet.filter((kart) => kart.fleetStatus === "disponivel").length;

  const maintenance = fleet.filter((kart) => kart.fleetStatus === "em_manutencao").length;

  const rental = fleet.filter((kart) => kart.ownership === "rental").length;

  const clientOwned = fleet.filter((kart) => kart.ownership === "client").length;

  const overdue = fleet.filter(

    (kart) => kart.preventiveMaintenance.mostUrgent.overdue,

  ).length;

  const pending = fleet.filter(

    (kart) =>

      kart.preventiveMaintenance.mostUrgent.overdue ||

      kart.correctiveMaintenance.status !== "none" ||

      kart.preventiveMaintenance.mostUrgent.hoursRemaining <= 7,

  ).length;



  const pctAvailable =

    total > 0 ? Math.round((available / total) * 100) : 0;



  return [

    {

      id: "total",

      label: "Total de karts",

      value: String(total),

      delta: total > 0 ? `${available} disponíveis` : "Sem karts cadastrados",

      deltaPositive: total > 0,

    },

    {

      id: "disp",

      label: "Disponíveis",

      value: String(available),

      delta: total > 0 ? `${pctAvailable}% da frota` : "—",

      deltaPositive: available > 0,

    },

    {

      id: "manut",

      label: "Em manutenção",

      value: String(maintenance),

      delta: maintenance > 0 ? "Atenção mecânica" : "Frota ok",

      deltaPositive: maintenance === 0,

    },

    {

      id: "prop",

      label: "Karts próprios",

      value: String(rental),

      delta: total > 0 ? "Frota Gurgel" : "—",

      deltaPositive: rental > 0,

    },

    {

      id: "cli",

      label: "Karts de clientes",

      value: String(clientOwned),

      delta: clientOwned > 0 ? "Guardados" : "Nenhum",

      deltaPositive: true,

    },

    {

      id: "pend",

      label: "Pendências",

      value: String(pending),

      delta:

        overdue > 0

          ? `${overdue} urgentes`

          : pending > 0

            ? "Revisões próximas"

            : "Nenhuma",

      deltaPositive: pending === 0,

    },

  ];

}

