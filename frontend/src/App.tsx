import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Grid, AppBar, Toolbar,
  Chip, IconButton, Tooltip, Snackbar, Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ServiceHealthCard from './components/ServiceHealthCard';
import OrderIncidentPanel from './components/OrderIncidentPanel';
import InventoryIncidentPanel from './components/InventoryIncidentPanel';
import TrafficGenerator from './components/TrafficGenerator';
import RecentOrders from './components/RecentOrders';
import * as api from './api';
import { Order, OrderIncidentStatus, InventoryIncidentStatus, HealthStatus } from './types';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

function App() {
  const [orderHealth, setOrderHealth] = useState<HealthStatus>('UNKNOWN');
  const [inventoryHealth, setInventoryHealth] = useState<HealthStatus>('UNKNOWN');
  const [orderStatus, setOrderStatus] = useState<OrderIncidentStatus | null>(null);
  const [inventoryStatus, setInventoryStatus] = useState<InventoryIncidentStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean; message: string; severity: SnackbarSeverity;
  }>({ open: false, message: '', severity: 'success' });

  // ── Poll health + incident status every 5s ────────────────
  const refresh = useCallback(async () => {
    const [oh, ih, os, is_] = await Promise.all([
      api.getOrderHealth(),
      api.getInventoryHealth(),
      api.getOrderIncidentStatus(),
      api.getInventoryIncidentStatus(),
    ]);
    setOrderHealth(oh);
    setInventoryHealth(ih);
    setOrderStatus(os);
    setInventoryStatus(is_);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  // ── Helpers ───────────────────────────────────────────────
  const setKey = (key: string, val: boolean) =>
    setLoading(prev => ({ ...prev, [key]: val }));

  const showSnackbar = (message: string, severity: SnackbarSeverity) =>
    setSnackbar({ open: true, message, severity });

  // ── Order Service Incident triggers ───────────────────────
  const handleOrderIncident = async (type: string) => {
    setKey(type, true);
    try {
      const triggers: Record<string, () => Promise<unknown>> = {
        cpu: api.triggerCpu,
        dependency: api.triggerDependency,
        npe: api.triggerNpe,
        memory: api.triggerMemory,
        random: api.triggerRandom,
      };
      await triggers[type]?.();
      showSnackbar(`Incident "${type}" triggered on Order Service`, 'warning');
      await refresh();
    } catch {
      showSnackbar(`Failed to trigger "${type}" — is Order Service running?`, 'error');
    } finally {
      setKey(type, false);
    }
  };

  // ── Inventory Service Incident triggers ───────────────────
  const handleInventoryIncident = async (type: string) => {
    const loadKey = `inv_${type}`;
    setKey(loadKey, true);
    try {
      if (type === 'slow') await api.triggerSlow();
      if (type === 'error') await api.triggerError();
      showSnackbar(`Incident "${type}" triggered on Inventory Service`, 'warning');
      await refresh();
    } catch {
      showSnackbar(`Failed to trigger "${type}" — is Inventory Service running?`, 'error');
    } finally {
      setKey(loadKey, false);
    }
  };

  // ── Reset All ─────────────────────────────────────────────
  const handleResetAll = async () => {
    setKey('reset', true);
    try {
      await Promise.all([api.resetOrder(), api.resetInventory()]);
      showSnackbar('All incidents cleared — both services are healthy', 'success');
      await refresh();
    } catch {
      showSnackbar('Reset failed — check that services are running', 'error');
    } finally {
      setKey('reset', false);
    }
  };

  // ── Derived counts ────────────────────────────────────────
  const orderActiveCount = orderStatus
    ? (Object.values(orderStatus) as unknown[]).filter(v => v === true).length
    : 0;
  const inventoryActiveCount = inventoryStatus
    ? (Object.values(inventoryStatus) as unknown[]).filter(v => v === true).length
    : 0;

  const addOrder = (order: Order) =>
    setOrders(prev => [order, ...prev].slice(0, 50));

  // ── Render ────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── App Bar ── */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: 0.5 }}>
            🔥 Incident Lab
          </Typography>

          {/* Live health chips */}
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Chip
              label={`Order: ${orderHealth}`}
              color={orderHealth === 'UP' ? 'success' : orderHealth === 'DOWN' ? 'error' : 'default'}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`Inventory: ${inventoryHealth}`}
              color={inventoryHealth === 'UP' ? 'success' : inventoryHealth === 'DOWN' ? 'error' : 'default'}
              size="small"
              variant="outlined"
            />
          </Box>

          {lastRefresh && (
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              {lastRefresh.toLocaleTimeString()}
            </Typography>
          )}
          <Tooltip title="Refresh now">
            <IconButton size="small" onClick={refresh} color="inherit">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* ── Main Content ── */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={2.5}>

          {/* Service Health Cards */}
          <Grid item xs={12} sm={6}>
            <ServiceHealthCard
              name="Order Service"
              port={8080}
              health={orderHealth}
              activeIncidents={orderActiveCount}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ServiceHealthCard
              name="Inventory Service"
              port={8081}
              health={inventoryHealth}
              activeIncidents={inventoryActiveCount}
            />
          </Grid>

          {/* Incident Control Panels */}
          <Grid item xs={12} md={6}>
            <OrderIncidentPanel
              status={orderStatus}
              loading={loading}
              onTrigger={handleOrderIncident}
              onResetAll={handleResetAll}
              resetLoading={!!loading['reset']}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InventoryIncidentPanel
              status={inventoryStatus}
              loading={loading}
              onTrigger={handleInventoryIncident}
            />
          </Grid>

          {/* Traffic Generator + Recent Orders */}
          <Grid item xs={12} lg={4}>
            <TrafficGenerator onOrderCreated={addOrder} />
          </Grid>
          <Grid item xs={12} lg={8}>
            <RecentOrders orders={orders} />
          </Grid>

        </Grid>
      </Container>

      {/* ── Toast notifications ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
