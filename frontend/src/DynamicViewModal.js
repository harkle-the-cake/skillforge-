import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, Input } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DynamicViewModal = ({
  open,
  onClose,
  data,
  fields,
  title,
  mode,
  onSave,
  dropdownOptions = {},
}) => {
  //console.log(data);

  const [formData, setFormData] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});

  useEffect(() => {
    const initialPreviewUrls = {};
    fields.forEach((field) => {
      if (field.type === 'image' && data && data[field.key]) {
         initialPreviewUrls[field.key] = `${API_URL}${data[field.key]}`; // Backend-API-URL hinzufügen
      }
    });
    setFormData(data || {});
    setPreviewUrls(initialPreviewUrls);
    console.log(data);
  }, [data, fields]);

  const handleChange = (field, value) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));

      // Aktualisiere die Vorschau für Bildfelder
      if (fields.find((f) => f.type === 'image' && f.key === field)) {
        const file = value; // Angenommen, `value` ist das neue Bild (File-Objekt)
        setPreviewUrls((prevUrls) => ({
          ...prevUrls,
          [field]: URL.createObjectURL(file),
        }));
      }
  };

  const handleImageChange = (field, file) => {
    const updatedFormData = { ...formData, image: file };
    const updatedPreviewUrls = { ...previewUrls, [field]: URL.createObjectURL(file) };
    setFormData(updatedFormData);
    setPreviewUrls(updatedPreviewUrls);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header-Bereich mit Titel und optionalem Bild */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          {fields.some((field) => field.type === 'image') &&
            fields.map(
              (field) =>
                field.type === 'image' &&
                previewUrls[field.key] && (
                  <img
                    key={field.key}
                    src={previewUrls[field.key]} // Die korrekte Preview-URL verwenden
                    alt={`${field.label} preview`}
                    style={{
                      maxWidth: '100px',
                      maxHeight: '100px',
                      borderRadius: '10px',
                      marginRight: '20px',
                      filter: mode === 'view' ? 'grayscale(100%)' : 'none',
                    }}
                  />
                )
            )}
          <Typography variant="h6">{title}</Typography>
        </div>

        {/* Dynamische Felder */}
        {fields.map((field) => {
          const { key, label, type, options } = field;

          if (type === 'image' && mode === 'edit') {
            return (
              <div key={key} style={{ marginBottom: '20px' }}>
                <Typography variant="subtitle1">{label}</Typography>
                {mode === 'view' ? (
                  <Typography variant="body2">Bild anzeigen</Typography>
                ) : (
                  <Input
                    type="file"
                    onChange={(e) => handleImageChange(key, e.target.files[0])}
                    disabled={mode === 'view'}
                  />
                )}
              </div>
            );
          }

          return (
            <div key={key} style={{ marginBottom: '20px', backgroundColor:'#333333' }}>
              {type === 'text' && (
                <TextField
                  label={label}
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  fullWidth
                  disabled={mode === 'view'}
                  InputProps={{
                    readOnly: mode === 'view',
                    style: mode === 'view' ? { backgroundColor: '#333333' } : {},
                  }}
                />
              )}
              {type === 'textarea' && (
                <TextField
                  label={label}
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={mode === 'view'}
                  InputProps={{
                    readOnly: mode === 'view',
                    style: mode === 'view' ? { backgroundColor: '#333333' } : {},
                  }}
                />
              )}
              {type === 'select' && (
                <Select
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  fullWidth
                  displayEmpty
                  disabled={mode === 'view'}
                  style={{
                    backgroundColor: mode === 'view' ? '#333333' : 'white',
                  }}
                >
                  <MenuItem value="">Bitte auswählen</MenuItem>
                  {(dropdownOptions[key] || options || []).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>
          );
        })}

        {/* Footer mit Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            borderTop: '1px solid #ddd',
            paddingTop: '10px',
          }}
        >
          {mode !== 'view' && (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Speichern
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default DynamicViewModal;
