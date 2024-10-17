import React, { useState } from 'react';
import './CustomTable.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, InputAdornment } from '@mui/material';

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
    <TableContainer
          component={Paper}
          style={{ flexGrow: 1, overflowY: 'auto' }} // FlexGrow macht die Tabelle flexibel
        >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="header">
        <h3 style={{ padding: '10px' }}>{title}</h3>
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
        label="Suche"
        variant="outlined"
        fullWidth
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
      <Table stickyHeader> {/* Sticky Header bleibt beim Scrollen sichtbar */}
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
      </div>
    </TableContainer>
  );
};

export default CustomTable;
