import axios from 'axios';
import { Order, OrderIncidentStatus, InventoryIncidentStatus, HealthStatus } from '../types';

const ORDER_URL: string =
  (import.meta.env.VITE_ORDER_URL as string) || 'http://localhost:8080';
const INVENTORY_URL: string =
  (import.meta.env.VITE_INVENTORY_URL as string) || 'http://localhost:8081';

// ── Health ────────────────────────────────────────────────────

export const getOrderHealth = async (): Promise<HealthStatus> => {
  try {
    const res = await axios.get(`${ORDER_URL}/actuator/health`, { timeout: 3000 });
    return res.data.status === 'UP' ? 'UP' : 'DOWN';
  } catch {
    return 'DOWN';
  }
};

export const getInventoryHealth = async (): Promise<HealthStatus> => {
  try {
    const res = await axios.get(`${INVENTORY_URL}/actuator/health`, { timeout: 3000 });
    return res.data.status === 'UP' ? 'UP' : 'DOWN';
  } catch {
    return 'DOWN';
  }
};

// ── Incident Status ───────────────────────────────────────────

export const getOrderIncidentStatus = async (): Promise<OrderIncidentStatus | null> => {
  try {
    const res = await axios.get(`${ORDER_URL}/incident/status`, { timeout: 3000 });
    return res.data;
  } catch {
    return null;
  }
};

export const getInventoryIncidentStatus = async (): Promise<InventoryIncidentStatus | null> => {
  try {
    const res = await axios.get(`${INVENTORY_URL}/incident/status`, { timeout: 3000 });
    return res.data;
  } catch {
    return null;
  }
};

// ── Order Service Incident Triggers ───────────────────────────

export const triggerCpu = () => axios.post(`${ORDER_URL}/incident/cpu`);
export const triggerDependency = () => axios.post(`${ORDER_URL}/incident/dependency`);
export const triggerNpe = () => axios.post(`${ORDER_URL}/incident/npe`);
export const triggerMemory = () => axios.post(`${ORDER_URL}/incident/memory`);
export const triggerRandom = () => axios.post(`${ORDER_URL}/incident/random`);
export const resetOrder = () => axios.post(`${ORDER_URL}/incident/reset`);

// ── Inventory Service Incident Triggers ───────────────────────

export const triggerSlow = () => axios.post(`${INVENTORY_URL}/incident/slow`);
export const triggerError = () => axios.post(`${INVENTORY_URL}/incident/error`);
export const resetInventory = () => axios.post(`${INVENTORY_URL}/incident/reset`);

// ── Orders ────────────────────────────────────────────────────

export const createOrder = async (productId: string, quantity: number): Promise<Order> => {
  const res = await axios.post(
    `${ORDER_URL}/orders`,
    { productId, quantity, userId: 'incident-lab-ui' },
    { timeout: 15000 }
  );
  return res.data;
};
