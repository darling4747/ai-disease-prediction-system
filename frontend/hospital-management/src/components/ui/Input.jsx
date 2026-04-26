import React from 'react';
import { TextField } from '@mui/material';

const Input = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  fullWidth = true,
  required = false,
  disabled = false,
  multiline = false,
  rows,
  ...props
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      margin="normal"
      {...props}
    />
  );
};

export default Input;
