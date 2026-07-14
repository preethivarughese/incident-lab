import React from 'react';
import {
  Card, CardContent, CardHeader, Divider, Stack, Box,
  Typography, Button, Chip, Alert,
} from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { InventoryIncidentStatus } from '../types';

interface Props {
  status: InventoryIncidentStatus | null;
  loading: Record<string, boolean>;
  onTrigger: (type: string) => void;
}

const incidents = [
  {
    apiKey: 'slow',
    statusKey: 'slowEnabled' as keyof InventoryIncidentStatus,
    label: 'Slow Response — 10 second delay',
    icon: <HourglassBottomIcon fontSize="small" />,
    description: 'Every inventory lookup sleeps 10s — order service latency spikes or times out',
    color: 'warning',
  },
  {
    apiKey: 'error',
    statusKey: 'errorEnabled' as keyof InventoryIncidentStatus,
    label: 'Error Response — HTTP 500',
    icon: <ReportProblemIcon fontSize="small" />,
    description: 'Every inventory lookup returns HTTP 500 — orders cascade to FAILED',
    color: 'error',
  },
];

const InventoryIncidentPanel: React.FC<Props> = ({ status, loading, onTrigger }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Inventory Service — Incidents"
        subheader="port 8081 — simulates a bad downstream deployment"
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
      />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ py: 0.5, fontSize: 12 }}>
            Inventory incidents cascade into Order Service failures — exactly like a bad dependency release.
          </Alert>

          {incidents.map(({ apiKey, statusKey, label, icon, description, color }) => {
            const isActive = status ? !!status[statusKey] : false;
            const isLoading = !!loading[`inv_${apiKey}`];
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
                  borderColor: isActive ? `${color}.main` : 'divider',
                  bgcolor: isActive ? `${color}.dark` : 'background.paper',
                  transition: 'all 0.2s ease',
                }}
              >
                <Box sx={{ color: isActive ? `${color}.light` : 'text.disabled', flexShrink: 0 }}>
                  {icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600}>{label}</Typography>
                  <Typography variant="caption" color="text.secondary">{description}</Typography>
                </Box>
                {isActive ? (
                  <Chip label="ACTIVE" size="small" color={color as 'warning' | 'error'} />
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

          <Box
            sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="caption" color="text.secondary" component="div">
              <strong>How to simulate a dependency incident:</strong>
              <ol style={{ margin: '4px 0 0 16px', padding: 0 }}>
                <li>Trigger one of the incidents above</li>
                <li>Send orders from the Traffic Generator</li>
                <li>Watch orders fail with FAILED status</li>
                <li>Click Reset All to restore normal operation</li>
              </ol>
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InventoryIncidentPanel;
