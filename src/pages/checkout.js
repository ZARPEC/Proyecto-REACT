import React, { useEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { data } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]); 

  
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue(
      "name",
      `${localStorage.getItem("nombre")} ${localStorage.getItem("apellido")}`
    );
    const carritoGuardado = JSON.parse(sessionStorage.getItem("carrito"));
    if (carritoGuardado) {
      setCart(carritoGuardado);
    }
  }, [setValue]);

  
  const onSubmit = async (data) => {
    console.log("Información de envío y pago:", data);
    const detalles = cart.map((item) => ({
      producto_orden: item.id,
      cantidad: item.cantidad,
    }));
    const token = localStorage.getItem("token");
    const datos = {
      ...data,
      detalles,
      usuario_fk: parseInt(localStorage.getItem("idUsuario")),
      estado_fk: 4,
    };

    console.log("Datos a enviar:", datos);

    try {
      const response = await fetch("http://localhost:3005/ordenes/agregarOrden", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });
      if (response.ok) {
        console.log("Orden enviada correctamente");
        sessionStorage.removeItem("carrito");
        window.location.href = "/compra-realizada";
      }
    } catch (error) {
      console.error("Error al enviar la orden:", error);
    }
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "El nombre es obligatorio" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nombre completo"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="direccion"
                    control={control}
                    defaultValue=""
                    rules={{ required: "La dirección es obligatoria" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dirección"
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    rules={{ required: "La ciudad es obligatoria" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ciudad"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="zipCode"
                    control={control}
                    defaultValue=""
                    rules={{ required: "El código postal es obligatorio" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Código Postal"
                        fullWidth
                        error={!!errors.zipCode}
                        helperText={errors.zipCode?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Información de Pago
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="cardNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "El número de tarjeta es obligatorio",
                      pattern: {
                        value: /^\d{16}$/,
                        message: "El número de tarjeta debe tener 16 dígitos",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Número de tarjeta"
                        fullWidth
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="expirationDate"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "La fecha de expiración es obligatoria",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        message: "Formato inválido (MM/AA)",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Fecha de expiración (MM/AA)"
                        fullWidth
                        error={!!errors.expirationDate}
                        helperText={errors.expirationDate?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="cvv"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "El CVV es obligatorio",
                      pattern: {
                        value: /^\d{3}$/,
                        message: "El CVV debe tener 3 dígitos",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CVV"
                        fullWidth
                        error={!!errors.cvv}
                        helperText={errors.cvv?.message}
                      />
                    )}
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
