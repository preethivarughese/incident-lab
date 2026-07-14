import React, { useState, useRef } from 'react';
import {
  Card, CardContent, CardHeader, Divider, Grid,
  Select, MenuItem, FormControl, InputLabel,
  TextField, Button, Box, LinearProgress,
  Typography, Chip, Stack, SelectChangeEvent,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import StopIcon from '@mui/icons-material/Stop';
import { PRODUCTS, Order } from '../types';
import { createOrder } from '../api';

interface Props {
  onOrderCreated: (order: Order) => void;
}

const TrafficGenerator: React.FC<Props> = ({ onOrderCreated }) => {
  const [productId, setProductId] = useState('P001');
  const [quantity, setQuantity] = useState(1);
  const [bulkCount, setBulkCount] = useState(20);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ sent: 0, success: 0, failed: 0 });
  const stopRef = useRef(false);

  const handleSingle = async () => {
    try {
      const order = await createOrder(productId, quantity);
      onOrderCreated(order);
    } catch {
      onOrderCreated({
        orderId: 'ERR-' + Date.now(),
        productId,
        quantity,
        status: 'FAILED',
        message: 'Request failed (connection refused or timeout)',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleBulk = async () => {
    setSending(true);
    stopRef.current = false;
    setProgress(0);
    let success = 0;
    let failed = 0;

    for (let i = 0; i < bulkCount; i++) {
      if (stopRef.current) break;
      const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const q = Math.floor(Math.random() * 5) + 1;
      try {
        const order = await createOrder(p.id, q);
        onOrderCreated(order);
        order.status === 'CREATED' ? success++ : failed++;
      } catch {
        failed++;
      }
      setStats({ sent: i + 1, success, failed });
      setProgress(((i + 1) / bulkCount) * 100);
      await new Promise(r => setTimeout(r, 150));
    }

    setSending(false);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Traffic Generator"
        subheader="Create real HTTP traffic to watch metrics change"
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Product</InputLabel>
              <Select
                value={productId}
                onChange={(e: SelectChangeEvent) => setProductId(e.target.value)}
                label="Product"
              >
                {PRODUCTS.map(p => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.id} — {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Quantity"
              type="number"
              size="small"
              fullWidth
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: 50 }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Bulk count"
              type="number"
              size="small"
              fullWidth
              value={bulkCount}
              onChange={e => setBulkCount(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: 200 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                startIcon={<SendIcon />}
                onClick={handleSingle}
                disabled={sending}
                size="small"
              >
                Send 1
              </Button>
              <Button
                variant="contained"
                startIcon={<BurstModeIcon />}
                onClick={handleBulk}
                disabled={sending}
                size="small"
                color="primary"
              >
                Send {bulkCount}
              </Button>
              {sending && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={() => { stopRef.current = true; }}
                  size="small"
                >
                  Stop
                </Button>
              )}
            </Stack>
          </Grid>

          {sending && (
            <Grid item xs={12}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mb: 1, borderRadius: 1, height: 6 }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {stats.sent} / {bulkCount}
                </Typography>
                <Chip label={`✓ ${stats.success}`} size="small" color="success" />
                <Chip label={`✗ ${stats.failed}`} size="small" color="error" />
              </Stack>
            </Grid>
          )}

          {!sending && stats.sent > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last batch ({stats.sent} requests)
                </Typography>
                <Stack direction="row" spacing={1} mt={0.5}>
                  <Chip label={`✓ ${stats.success} created`} size="small" color="success" variant="outlined" />
                  <Chip label={`✗ ${stats.failed} failed`} size="small" color="error" variant="outlined" />
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrafficGenerator;
