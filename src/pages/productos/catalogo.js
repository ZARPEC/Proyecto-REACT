import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { set } from "react-hook-form";
import { SocialDistance } from "@mui/icons-material";

// Datos de ejemplo
const subcategorias = ["Ofertas", "Nuevos", "Más vendidos", "Recomendados"];

const CatalogoProdutos = () => {

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [cards, setCards] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [productosResponse, categoriasResponse] = await Promise.all([
          fetch(
          "http://localhost:3005/producto/mostrarProductos",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:3005/categoria/mostrarCategorias",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
      ]);
      if (!productosResponse.ok) {
        throw new Error(`HTTP error! status: ${productosResponse.status}`);
      }


        if (!categoriasResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriasResponse.status}`);
        }


        const productosData = await productosResponse.json();
        const categoriasData = await categoriasResponse.json();

        const productosmap = productosData.map((producto) => ({
          id: producto.idProducto,
          nombre: producto.nombre_producto,
          precio: "Q" + producto.precio,
          imagen: producto.ruta_img,
        }));

        const categoriasmap = categoriasData.map((categoria) => categoria.nombre_categoria);

        setCards(productosmap);
        setCategorias(categoriasmap);

      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [token]); 

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
        gridColumnGap: "0px",
        gridRowGap: "0px",
        height: "100vh", // Ajustar a la altura completa de la ventana
      }}
    >
      {/* Lista de categorías (lado izquierdo) */}
      <Box
        sx={{
          gridArea: "1 / 1 / 7 / 2",
          border :"5px",
          p: 2,
          overflowY: "auto", // Permite desplazamiento si hay muchas categorías
        }}
      >
        <List>
          {categorias.map((categoria, index) => (
            <ListItem
              button
              key={index}
              selected={categoria === categoriaSeleccionada}
              onClick={() => setCategoriaSeleccionada(categoria)}
            >
              <ListItemText primary={categoria} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Carrusel de subcategorías (parte superior derecha) */}
      <Box
        sx={{
          gridArea: "1 / 2 / 3 / 5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "primary.light",
          height: "50%",
          p: 2,
        }}
      >
        <Carousel 
        sx={{ width: "100%"}}>
          {subcategorias.map((subcategoria, index) => (
            <Box
              key={index}
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "white",
                width:"100%"
              }}
            >
              <Typography variant="h4">{subcategoria}</Typography>
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Productos en tarjetas (parte inferior derecha) */}
      <Box
        sx={{
          gridArea: "2 / 2 / 7 / 5",
          p: 3,
          overflowY: "auto", // Permite desplazamiento si hay muchos productos
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Productos en {categoriaSeleccionada}
        </Typography>
        <Grid container spacing={3}>
          {cards.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={producto.imagen}
                  alt={producto.nombre}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {producto.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {producto.precio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CatalogoProdutos;
