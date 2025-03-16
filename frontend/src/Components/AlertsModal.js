import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, TextField, Button, Modal, Alert } from '@mui/material';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { createAlert } from '../HelperFunctions/PostData'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '90vh',
  height: 'auto',
  overflowY: 'auto',
  bgcolor: '#2e2e2e',
  boxShadow: 24,
  p: 4,
  color: 'white',
};

const validationSchemaRegister = Yup.object({
  latitude: Yup.number().required('Required'),
  longitude: Yup.number().required('Required'),
  radius: Yup.number().required('Required'),
  threshold: Yup.number().required('Required'),
});

function AlertsModal({ open, onClose }) {
    const [successMessage, setSuccessMessage] = useState('');
    
    
    
    useEffect(() => {
        if (open) {
          setSuccessMessage(''); // Clear success message when the modal is opened
        }
      }, [open]);
    return (
        <Modal
        open={open}
        onClose={(_, reason) => {
            // Prevent closing on backdrop click but allow ESC key and close button
            if (reason !== 'backdropClick') {
            onClose();
            }
        }}
        aria-labelledby="alerts-modal"
        >
        <Box sx={modalStyle}>
            <IconButton
            aria-label="close"
            onClick={onClose}  // Close modal when cancel button is clicked
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
            <CloseRoundedIcon />
            </IconButton>

            <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white' }}>
            Create Alert
            </Typography>
            {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
            </Alert>
            )}
           <Formik
                initialValues={{
                    latitude: 0.0,
                    longitude: 0.0,
                    radius: 0,
                    threshold: 0,
                }}
                validationSchema={validationSchemaRegister}
                onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
                    setSubmitting(true);
                    setSuccessMessage(''); // Clear success message

                    try {
                    // Call createAlert with formatted values
                    const success = await createAlert(values);  // Passing the form values directly

                    // If the alert was successfully created, display success message
                    setSuccessMessage(`Created Alert at Latitude: ${values.latitude}, Longitude: ${values.longitude}`);

                    // Optionally reset the form
                    resetForm();
                    } catch (error) {
                    console.error('Error creating alert:', error);
                    setFieldError('email', 'Failed to create alert');
                    }
                    setSubmitting(false);
                }}
                >
                {({ values, handleChange, setFieldValue, handleSubmit, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                    <Box>
                        <Field
                        as={TextField}
                        name="latitude"
                        label="Latitude"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        error={touched.latitude && Boolean(errors.latitude)}
                        helperText={touched.latitude && errors.latitude}
                        />
                        <Field
                        as={TextField}
                        name="longitude"
                        label="Longitude"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        error={touched.longitude && Boolean(errors.longitude)}
                        helperText={touched.longitude && errors.longitude}
                        />
                        <IconButton sx={{ position: 'absolute', right: 8, top: 32, color: 'white' }}>
                        <AddLocationAltRoundedIcon />   
                        </IconButton>
                    </Box>

                    <Field
                        as={TextField}
                        name="radius"
                        label="Radius"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        error={touched.radius && Boolean(errors.radius)}
                        helperText={touched.radius && errors.radius}
                    />

                    <Field
                        as={TextField}
                        name="threshold"
                        label="Threshold"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        error={touched.threshold && Boolean(errors.threshold)}
                        helperText={touched.threshold && errors.threshold}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Alert...' : 'Create Alert'}
                    </Button>
                    </Form>
                )}
                </Formik>
        </Box>
        </Modal>
    );
}

export default AlertsModal;
