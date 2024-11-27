import React, { useState } from 'react';
import './CustomTable.css';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import './App.css';

const CustomTable = ({ title, columns, data, renderActions, addFunction }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Funktion zum Löschen des Suchfelds
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filter the data based on the search query
  const filteredData = data.filter((row) =>
    columns.some((column) =>
      row[column.field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width:'100%' }}>
            <div className="header">
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{ marginBottom: '20px', textAlign: 'center', width:'100%' }}>
                        {title}
                </Typography>
                {addFunction && (
                      <Button variant="contained" color="primary" onClick={addFunction}>
                        <img
                          src="/icons/create_icon.png" // Pfad zum Add-Icon
                          alt="Add"
                          style={{ width: '20px', height: '20px' }}
                        />
                      </Button>
                )}
            </div>
            <TextField
              label="Suchen..."
              variant="outlined"
              fullWidth
              style={{ marginBottom: '20px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch}>
                      <img
                        src="/icons/clear_icon.png" // Pfad zum Clear-Icon
                        alt="Clear Search"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '10px' }}
            />
      <TableContainer
          className="custom-table-container" // Stil hinzufügen
          component={Paper}
        >

      <Table stickyHeader className="custom-table"> {/* Sticky Header bleibt beim Scrollen sichtbar */}
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.field} style={{ padding: '10px', minWidth: '150px' }}>
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell style={{ padding: '10px', minWidth: '150px' }}>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          style={{ padding: '10px', lineHeight: '1.5', minWidth: '150px' }}
                        >
                          {row[column.field]}
                        </TableCell>
                      ))}
                      <TableCell style={{ padding: '10px', lineHeight: '1.5', minWidth: '150px' }}>
                        {renderActions(row)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </TableContainer>
    </div>
  );
};

export default CustomTable;
