import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Psychology, CheckCircle } from '@mui/icons-material';

interface ChainOfThoughtsProps {
  steps: string[];
  isProcessing: boolean;
}

const ChainOfThoughts = ({ steps, isProcessing }: ChainOfThoughtsProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 1))',
        border: '1px solid hsl(var(--border))',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexShrink: 0 }}>
          <Psychology sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Chain of Thoughts
          </Typography>
          {isProcessing && (
            <Chip
              label="Processing"
              size="small"
              color="primary"
              sx={{ ml: 'auto', animation: 'pulse-glow 2s ease-in-out infinite' }}
            />
          )}
        </Box>

        {isProcessing && (
          <LinearProgress
            sx={{
              mb: 3,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'hsl(var(--muted))',
              flexShrink: 0,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))',
              },
            }}
          />
        )}

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pr: 1,
            minHeight: 0,
          }}
        >
          {steps.length === 0 && !isProcessing && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
              }}
            >
              <Psychology sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="body1">
                AI thoughts will appear here during processing
              </Typography>
            </Box>
          )}

          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'hsl(var(--muted) / 0.3)',
                animation: 'slide-in-up 0.4s ease-out',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                '&:hover': {
                  backgroundColor: 'hsl(var(--muted) / 0.5)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <CheckCircle
                sx={{
                  color: 'success.main',
                  fontSize: 24,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Step {index + 1}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {step}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChainOfThoughts;
