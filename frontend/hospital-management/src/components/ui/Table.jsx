import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box
} from '@mui/material';

const Table = ({
  columns,
  rows,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  loading = false
}) => {
  const handleChangePage = (event, newPage) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        Loading...
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalCount || rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default Table;
