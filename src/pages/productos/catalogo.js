import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  CardActions,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

// Datos de ejemplo

const CatalogoProdutos = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [cards, setCards] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categorias[0]
  );
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(
    subcategorias[0]
  );

  useEffect(() => {
    var url = "";

    const fetchDatos = async () => {
      console.log(categoriaSeleccionada);
      if (
        typeof categoriaSeleccionada == "undefined" &&
        typeof subcategoriaSeleccionada == "undefined"
      ) {
        url = "http://localhost:3005/producto/mostrarProductos";
      } else if (typeof subcategoriaSeleccionada == "undefined") {
        url = `http://localhost:3005/producto/mostrarProductos?categoria=${categoriaSeleccionada}`;
      } else {
        url = `http://localhost:3005/producto/mostrarProductos?categoria=${categoriaSeleccionada}&subcategoria=${subcategoriaSeleccionada}`;
      }
      try {
        const [productosResponse, categoriasResponse, subcategoriaResponse] =
          await Promise.all([
            fetch(url, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            fetch("http://localhost:3005/categoria/mostrarCategorias", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(
              `http://localhost:3005/categoria/mostrarSubCategorias?categoria=${categoriaSeleccionada}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            ),
          ]);
        if (!productosResponse.ok) {
          throw new Error(`HTTP error! status: ${productosResponse.status}`);
        }

        if (!categoriasResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriasResponse.status}`);
        }
        if (!subcategoriaResponse.ok) {
          throw new Error(`HTTP error! status: ${subcategoriaResponse.status}`);
        }

        const productosData = await productosResponse.json();
        const categoriasData = await categoriasResponse.json();
        const subcategoriasData = await subcategoriaResponse.json();

        const productosmap = productosData.map((producto) => ({
          id: producto.idProducto,
          nombre: producto.nombre_producto,
          precio: "Q" + producto.precio,
          imagen: producto.ruta_img,
        }));

        const categoriasmap = categoriasData.map(
          (categoria) => categoria.nombre_categoria
        );
        const categoriasubmap = subcategoriasData.map(
          (subcategoria) => subcategoria.subcategoria
        );

        setCards(productosmap);
        setCategorias(categoriasmap);
        setSubcategorias(categoriasubmap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [token, categoriaSeleccionada, subcategoriaSeleccionada]);

  const groupedSubcategories = [];
  for (let i = 0; i < subcategorias.length; i += 5) {
    groupedSubcategories.push(subcategorias.slice(i, i + 5));
  }

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
          border: "5px",
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
        <Carousel sx={{ width: "100%" }}>
          {groupedSubcategories.map((group, groupIndex) => (
            <Box
              key={groupIndex}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              {group.map((subcategoria, index) => (
                <ListItem
                  button
                  key={index}
                  selected={subcategoria === subcategoriaSeleccionada}
                  onClick={() => setSubcategoriaSeleccionada(subcategoria)}
                >
                  <Box
                    key={index}
                    sx={{
                      flex: "1 1 20%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.main",
                      color: "white",
                      p: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4">{subcategoria}</Typography>
                  </Box>
                </ListItem>
              ))}
            </Box>
          ))}
        </Carousel>
        ;
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" color="text.secondary">
                      {producto.precio}
                    </Typography>
                    <CardActions>
                      <Button size="large">
                        <AddShoppingCartIcon />
                      </Button>
                    </CardActions>
                  </Box>
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
