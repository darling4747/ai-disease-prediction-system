import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="modal-title"
    >
      {title && (
        <DialogTitle id="modal-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              edge="end"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      <DialogContent dividers>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
