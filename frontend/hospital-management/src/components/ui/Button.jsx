import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({
  children,
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      disabled={disabled || loading}
      sx={{
        position: 'relative',
        ...props.sx
      }}
    >
      {loading && (
        <span
          style={{
            position: 'absolute',
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }}
        />
      )}
      {children}
    </MuiButton>
  );
};

export default Button;
