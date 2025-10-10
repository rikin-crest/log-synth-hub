import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { Feedback, Refresh, CheckCircle } from '@mui/icons-material';

interface FeedbackSectionProps {
  onRerun: () => void;
  onConfGenerate: (feedback: string) => void;
  disabled: boolean;
}

const FeedbackSection = ({ onRerun, onConfGenerate, disabled }: FeedbackSectionProps) => {
  const [feedback, setFeedback] = useState('');

  const handleConfGenerate = () => {
    onConfGenerate(feedback);
    setFeedback('');
  };

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
          <Feedback sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Feedback & Actions
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder="Provide feedback on the generated mappings..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={disabled}
          sx={{
            mb: 3,
            flexGrow: 1,
            overflow: 'auto',
            '& .MuiOutlinedInput-root': {
              backgroundColor: disabled ? 'hsl(var(--muted) / 0.2)' : 'white',
              height: '100%',
              alignItems: 'flex-start',
            },
            '& .MuiOutlinedInput-input': {
              overflow: 'auto !important',
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Refresh />}
            onClick={onRerun}
            disabled={disabled}
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Rerun
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CheckCircle />}
            onClick={handleConfGenerate}
            disabled={disabled}
            sx={{
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(135deg, hsl(145, 65%, 55%), hsl(145, 65%, 45%))',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(145, 65%, 50%), hsl(145, 65%, 40%))',
              },
            }}
          >
            Conf Generate
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
