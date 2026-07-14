import React from 'react';
import {
  Card, CardContent, CardHeader, Divider,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Typography, Box,
} from '@mui/material';
import { Order } from '../types';

interface Props {
  orders: Order[];
}

const statusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
  if (status === 'CREATED') return 'success';
  if (status === 'FAILED') return 'error';
  if (status === 'REJECTED') return 'warning';
  return 'default';
};

const RecentOrders: React.FC<Props> = ({ orders }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Orders"
        subheader={`${orders.length} / 50 shown — newest first`}
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {orders.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              No orders yet. Use the Traffic Generator to create some.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, i) => (
                  <TableRow
                    key={`${order.orderId}-${i}`}
                    hover
                    sx={{
                      bgcolor: order.status === 'FAILED'
                        ? 'rgba(239,68,68,0.06)'
                        : order.status === 'REJECTED'
                          ? 'rgba(234,179,8,0.06)'
                          : 'transparent',
                    }}
                  >
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                        {order.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{order.productId}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption">{order.quantity}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={statusColor(order.status)}
                        size="small"
                        variant="filled"
                        sx={{ fontSize: 10, height: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ maxWidth: 240, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {order.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
