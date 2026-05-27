/** Tipos mínimos para Google Maps JS API (carregada via script) */
declare namespace google.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    extend(point: LatLng | { lat: number; lng: number }): void;
    isEmpty(): boolean;
  }

  interface MapOptions {
    center?: { lat: number; lng: number };
    zoom?: number;
    tilt?: number;
    heading?: number;
    mapTypeId?: string;
    disableDefaultUI?: boolean;
    zoomControl?: boolean;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    rotateControl?: boolean;
    styles?: Record<string, unknown>[];
  }

  class Map {
    constructor(el: HTMLElement, opts?: MapOptions);
    fitBounds(bounds: LatLngBounds, padding?: number): void;
    setCenter(center: { lat: number; lng: number }): void;
    setZoom(zoom: number): void;
    setTilt(tilt: number): void;
    setHeading(heading: number): void;
  }

  class Polyline {
    constructor(opts?: {
      path?: { lat: number; lng: number }[];
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      map?: Map;
      geodesic?: boolean;
      icons?: {
        icon: { path: string; scale: number };
        offset: string;
        repeat?: string;
      }[];
    });
    setMap(map: Map | null): void;
    setPath(path: { lat: number; lng: number }[]): void;
  }

  interface Symbol {
    path?: string | SymbolPath;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
  }

  interface MapsEventListener {
    remove(): void;
  }

  class Marker {
    constructor(opts?: {
      position?: { lat: number; lng: number };
      map?: Map;
      icon?: Symbol | string;
      optimized?: boolean;
      zIndex?: number;
      draggable?: boolean;
      title?: string;
    });
    setMap(map: Map | null): void;
    setPosition(position: { lat: number; lng: number }): void;
    getPosition(): LatLng | null | undefined;
    setIcon(icon: Symbol | string): void;
    setVisible(visible: boolean): void;
    addListener(eventName: string, handler: () => void): MapsEventListener;
  }

  interface SymbolPath {
    CIRCLE: string;
  }

  const SymbolPath: SymbolPath;
  const MapTypeId: { SATELLITE: string; ROADMAP: string };

  namespace event {
    function trigger(instance: object, eventName: string): void;
    function addListener(
      instance: object,
      eventName: string,
      handler: () => void,
    ): MapsEventListener;
    function addListenerOnce(
      instance: object,
      eventName: string,
      handler: () => void,
    ): void;
  }
}

interface Window {
  google?: typeof google;
}
