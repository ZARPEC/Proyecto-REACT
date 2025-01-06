import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]); // Estado para el carrito
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  // Cargar el carrito desde sessionStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(sessionStorage.getItem("carrito"));
    if (carritoGuardado) {
      setCart(carritoGuardado);
    }
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Información de envío:", shippingInfo);
    console.log("Información de pago:", paymentInfo);
    // Aquí iría la lógica para procesar el pago y finalizar la compra
  };

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Finalizar Compra
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>
              Información de Envío
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nombre completo"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Dirección"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Ciudad"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Código Postal"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Información de Pago
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Número de tarjeta"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Fecha de expiración"
                    name="expirationDate"
                    value={paymentInfo.expirationDate}
                    onChange={handlePaymentChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="CVV"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
              >
                Realizar Pedido
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>
            <List>
              {cart.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.nombre}
                    secondary={`Cantidad: ${item.cantidad}`}
                  />
                  <Typography variant="body2">
                    Q{(item.precio * item.cantidad).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              <Divider />
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Q{total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
