export type HealthStatus = 'UP' | 'DOWN' | 'UNKNOWN';

export interface OrderIncidentStatus {
  service: string;
  cpuEnabled: boolean;
  dependencyFailureEnabled: boolean;
  npeEnabled: boolean;
  memoryLeakEnabled: boolean;
  randomErrorEnabled: boolean;
}

export interface InventoryIncidentStatus {
  service: string;
  slowEnabled: boolean;
  errorEnabled: boolean;
}

export interface Order {
  orderId: string;
  productId: string;
  quantity: number;
  userId?: string;
  status: 'CREATED' | 'FAILED' | 'REJECTED';
  message: string;
  createdAt: string;
}

export const PRODUCTS = [
  { id: 'P001', name: 'Widget A' },
  { id: 'P002', name: 'Widget B' },
  { id: 'P003', name: 'Widget C' },
  { id: 'P004', name: 'Gadget X' },
  { id: 'P005', name: 'Gadget Y' },
];
