import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { HealthStatus } from '../types';

interface Props {
  name: string;
  port: number;
  health: HealthStatus;
  activeIncidents: number;
}

const ServiceHealthCard: React.FC<Props> = ({ name, port, health, activeIncidents }) => {
  const isUp = health === 'UP';
  const borderColor = isUp ? 'success.dark' : health === 'DOWN' ? 'error.dark' : 'divider';
  const dotColor = isUp ? 'success.main' : health === 'DOWN' ? 'error.main' : 'text.disabled';
  const textColor = isUp ? 'success.main' : health === 'DOWN' ? 'error.main' : 'text.secondary';

  return (
    <Card sx={{ border: '1px solid', borderColor, height: '100%' }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary" letterSpacing={1.5}>
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <CircleIcon sx={{ fontSize: 10, color: dotColor }} />
          <Typography variant="h5" fontWeight={700} color={textColor}>
            {health}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
          <Chip label={`Port ${port}`} size="small" variant="outlined" />
          <Chip
            label={activeIncidents === 0 ? 'No active incidents' : `${activeIncidents} incident${activeIncidents > 1 ? 's' : ''} active`}
            size="small"
            color={activeIncidents === 0 ? 'default' : 'error'}
            variant={activeIncidents === 0 ? 'outlined' : 'filled'}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ServiceHealthCard;
