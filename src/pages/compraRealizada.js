import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CompraRealizada = () => {
  // Simulación de datos de compra
  const orderDetails = {
    orderId: '',
    total: '',
    items: [
      { name: ' ', price: '' },
      { name: ' ', price:'' },
    ],
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              ¡Pago Realizado con Éxito!
            </Typography>
          </Box>
          
          <Typography variant="body1" gutterBottom>
            Gracias por tu compra. Tu pedido ha sido procesado correctamente.
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>
            <List disablePadding>
              {orderDetails.items.map((item, index) => (
                <ListItem key={index} sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={item.name} />
                 
                </ListItem>
              ))}
              <Divider />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  
                </Typography>
              </ListItem>
            </List>
          </Box>
          
          <Typography variant="body2" gutterBottom>
            Número de Orden: {orderDetails.orderId}
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary"
             href='/ordenes'>
              Ver Detalles del Pedido
            </Button>
            <Button
             variant="outlined" color="primary"
             href='/productos'>
              Seguir Comprando
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CompraRealizada;

