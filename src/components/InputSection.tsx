import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { CloudUpload, AutoAwesome, Category, Description } from '@mui/icons-material';
import { toast } from 'sonner';

interface InputSectionProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const InputSection = ({ onSubmit, isProcessing }: InputSectionProps) => {
  const [productName, setProductName] = useState('');
  const [logCategory, setLogCategory] = useState('');
  const [logType, setLogType] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleSubmit = () => {
    if (!productName || !logType || !fileName) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      productName,
      logCategory,
      logType,
      fileName,
    });
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
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Input Configuration
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Product Name *</InputLabel>
            <Select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              label="Product Name *"
              startAdornment={
                <InputAdornment position="start">
                  <Category color="primary" />
                </InputAdornment>
              }
            >
              <MenuItem value="Product A">Product A</MenuItem>
              <MenuItem value="Product B">Product B</MenuItem>
              <MenuItem value="Product C">Product C</MenuItem>
              <MenuItem value="Product D">Product D</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Product Log Category"
            value={logCategory}
            onChange={(e) => setLogCategory(e.target.value)}
            placeholder="Optional category"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
              sx={{
                py: 2,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                },
              }}
            >
              {fileName || 'Upload Log File *'}
              <input type="file" hidden onChange={handleFileChange} accept=".json,.xml,.log,.txt" />
            </Button>
            {fileName && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Selected: {fileName}
              </Typography>
            )}
          </Box>

          <FormControl fullWidth>
            <InputLabel>Log Type *</InputLabel>
            <Select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              label="Log Type *"
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="kv">Key-Value (KV)</MenuItem>
              <MenuItem value="xml">XML</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isProcessing}
            sx={{
              mt: 'auto',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, hsl(260, 85%, 60%), hsl(220, 70%, 55%))',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(260, 85%, 55%), hsl(220, 70%, 50%))',
              },
            }}
          >
            {isProcessing ? 'Generating...' : 'Generate Mappings'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InputSection;
