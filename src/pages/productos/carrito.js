import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

const CarritoDeCompras = () => {
  const [items, setItems] = useState([]);
  const theme = useTheme();
  const [cantidadProductos, setCantidadProductos] = useState(0);

  // Cargar carrito desde sessionStorage solo al montar el componente
  useEffect(() => {
    const carritoGuardado = JSON.parse(sessionStorage.getItem("carrito"));
    if (carritoGuardado) {
      setItems(carritoGuardado);

      if (carritoGuardado) {
        console.log("Contenido de carrito en sessionStorage:", carritoGuardado);
        try {
          const productos = carritoGuardado;
          if (Array.isArray(productos)) {
            setCantidadProductos(productos.length);
            console.log("Cantidad de productos en carrito:", productos.length);
          } else {
            console.error("El carrito no es un array.");
            setCantidadProductos(0);
          }
        } catch (error) {
          console.error("Error al parsear el carrito:", error);
          setCantidadProductos(0);
        }
      } else {
        setCantidadProductos(0);
      }

      setCantidadProductos(
        JSON.parse(sessionStorage.getItem("carrito")).length
      );
      console.log(cantidadProductos);
    }
  }, [cantidadProductos, items]);

  // Guardar carrito en sessionStorage
  const guardarCarrito = (nuevoCarrito) => {
    sessionStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const actualizarCantidad = (id, cambio) => {
    const nuevosItems = items
      .map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(0, item.cantidad + cambio) }
          : item
      )
      .filter((item) => item.cantidad > 0); // Filtrar items con cantidad > 0

    setItems(nuevosItems); // Actualizar estado
    guardarCarrito(nuevosItems); // Guardar en sessionStorage
  };

  const eliminarProducto = (id) => {
    // Filtrar los productos eliminados
    const nuevosItems = items.filter((item) => item.id !== id);

    setItems(nuevosItems); // Actualizar el estado con los productos restantes
    guardarCarrito(nuevosItems); // Guardar el nuevo estado en sessionStorage
  };

  const vaciarCarrito = () => {
    sessionStorage.removeItem("carrito"); 
    setItems([]);	
    setCantidadProductos(0);
  };

  const total = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Tu Carrito
          </Typography>
          {items.map((item) => (
            <Card
              key={item.id}
              sx={{ display: "flex", mb: 2, borderRadius: 2, boxShadow: 3 }}
            >
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: "cover" }}
                image={item.imagen}
                alt={item.nombre}
              />
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6">{item.nombre}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Q{item.precio.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={() => actualizarCantidad(item.id, -1)}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.cantidad}</Typography>
                  <IconButton
                    onClick={() => actualizarCantidad(item.id, 1)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => eliminarProducto(item.id)}
                    sx={{ ml: 1 }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"

            sx={{
              Color: "white",
              backgroundColor: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
            onClick={() => vaciarCarrito()}
          >
            <RemoveShoppingCartIcon />
            vaciar Carrito
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Resumen del Pedido
            </Typography>
            <Divider sx={{ my: 2 }} />
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body1">{item.nombre}</Typography>
                <Typography variant="body1">
                  Q{(item.precio * item.cantidad).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">Q{total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              href="/checkout"
              disabled={cantidadProductos <= 0}
              startIcon={<ShoppingCartIcon />}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
              }}
            >
              Finalizar Compra
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarritoDeCompras;
