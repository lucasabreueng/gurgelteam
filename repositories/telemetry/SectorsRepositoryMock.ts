import * as sectorsMocks from "@/lib/telemetry-sectors-mocks";

export const SectorsRepositoryMock = {
  getSectorsPageData: sectorsMocks.getSectorsPageData,
  parseSectorTime: sectorsMocks.parseSectorTime,
  formatSectorTime: sectorsMocks.formatSectorTime,
  formatDelta: sectorsMocks.formatDelta,
  getLapCellHighlight: sectorsMocks.getLapCellHighlight,
  compareLaps: sectorsMocks.compareLaps,
};
