import React from 'react';
import {
  Card, CardContent, CardHeader, Divider, Stack, Box,
  Typography, Button, Chip,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DataArrayIcon from '@mui/icons-material/DataArray';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { OrderIncidentStatus } from '../types';

interface Props {
  status: OrderIncidentStatus | null;
  loading: Record<string, boolean>;
  onTrigger: (type: string) => void;
  onResetAll: () => void;
  resetLoading: boolean;
}

const incidents = [
  {
    apiKey: 'cpu',
    statusKey: 'cpuEnabled' as keyof OrderIncidentStatus,
    label: 'CPU Spike',
    icon: <MemoryIcon fontSize="small" />,
    description: 'Busy loop saturates a CPU core — watch usage jump to 90%+',
    color: 'warning',
  },
  {
    apiKey: 'dependency',
    statusKey: 'dependencyFailureEnabled' as keyof OrderIncidentStatus,
    label: 'Dependency Failure',
    icon: <LinkOffIcon fontSize="small" />,
    description: 'All inventory calls fail immediately — orders marked FAILED',
    color: 'error',
  },
  {
    apiKey: 'npe',
    statusKey: 'npeEnabled' as keyof OrderIncidentStatus,
    label: 'Null Pointer Exception',
    icon: <ErrorOutlineIcon fontSize="small" />,
    description: 'POST /orders throws NPE on every request → HTTP 500',
    color: 'error',
  },
  {
    apiKey: 'memory',
    statusKey: 'memoryLeakEnabled' as keyof OrderIncidentStatus,
    label: 'Memory Leak',
    icon: <DataArrayIcon fontSize="small" />,
    description: 'Allocates 1 MB every 500 ms — watch JVM heap grow',
    color: 'warning',
  },
  {
    apiKey: 'random',
    statusKey: 'randomErrorEnabled' as keyof OrderIncidentStatus,
    label: 'Random Errors (30%)',
    icon: <ShuffleIcon fontSize="small" />,
    description: '30% of order requests randomly return HTTP 500',
    color: 'warning',
  },
];

const OrderIncidentPanel: React.FC<Props> = ({
  status, loading, onTrigger, onResetAll, resetLoading,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Order Service — Incidents"
        subheader="port 8080"
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
        action={
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<RestartAltIcon />}
            onClick={onResetAll}
            disabled={resetLoading}
            sx={{ mr: 1, mt: 0.5 }}
          >
            Reset All
          </Button>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {incidents.map(({ apiKey, statusKey, label, icon, description, color }) => {
            const isActive = status ? !!status[statusKey] : false;
            const isLoading = !!loading[apiKey];
            return (
              <Box
                key={apiKey}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: isActive ? 'error.main' : 'divider',
                  bgcolor: isActive ? 'rgba(239,68,68,0.15)' : 'background.paper',
                  transition: 'all 0.2s ease',
                }}
              >
                <Box sx={{ color: isActive ? 'error.light' : 'text.disabled', flexShrink: 0 }}>
                  {icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} color={isActive ? 'error.light' : 'text.primary'}>
                    {label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{description}</Typography>
                </Box>
                {isActive ? (
                  <Chip label="ACTIVE" size="small" color="error" variant="filled" />
                ) : (
                  <Button
                    variant="outlined"
                    color={color as 'warning' | 'error'}
                    size="small"
                    onClick={() => onTrigger(apiKey)}
                    disabled={isLoading}
                    sx={{ minWidth: 72, flexShrink: 0 }}
                  >
                    {isLoading ? '...' : 'Trigger'}
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderIncidentPanel;
