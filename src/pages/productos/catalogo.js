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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Carousel from "react-material-ui-carousel";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

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
  const [carrito, setCarrito] = useState(
    JSON.parse(sessionStorage.getItem("carrito")) || []
  );

  const [open, setOpen] = React.useState(false);
  const [productoAgregado, setProductoAgregado] = useState(null); 

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  
  const guardarCarrito = (nuevoCarrito) => {
    sessionStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };


  const agregarAlCarrito = (producto) => {
    const existeProducto = carrito.find((item) => item.id === producto.id);
    let nuevoCarrito;

    if (existeProducto) {
      nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    guardarCarrito(nuevoCarrito);
    setProductoAgregado(producto.nombre); 
    handleClick();
  };

  useEffect(() => {
    var url = "";

    const fetchDatos = async () => {
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
          precio: producto.precio,
          imagen: "/logo192.png",
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

        url = "";
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [token, categoriaSeleccionada, subcategoriaSeleccionada]);

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setSubcategoriaSeleccionada(undefined); 
  };

  const handleSubcategoriaClick = (subcategoria) => {
    setSubcategoriaSeleccionada(subcategoria);
  };

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
        height: "100vh",
      }}
    >
      <Box
        sx={{
          gridArea: "1 / 1 / 7 / 2",
          border: "5px",
          p: 2,
          overflowY: "auto",
        }}
      >
        <List>
          {categorias.map((categoria, index) => (
            <ListItem
              button
              key={index}
              selected={categoria === categoriaSeleccionada}
              onClick={() => handleCategoriaClick(categoria)}
            >
              <ListItemText primary={categoria} />
            </ListItem>
          ))}
        </List>
      </Box>

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
                  onClick={() => handleSubcategoriaClick(subcategoria)}
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

      <Box
        sx={{
          gridArea: "2 / 2 / 7 / 5",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Grid container spacing={2}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  sx={{
                    maxHeight: 150,
                    width: "auto",
                    margin: "0 auto", 
                    display: "block",
                  }}
                  image={card.imagen}
                  alt={card.nombre}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {card.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio: Q{card.precio.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => {
                      agregarAlCarrito(card);
                    }}
                  >
                    Agregar al Carrito
                  </Button>
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="success"
                      variant="filled"
                      sx={{ width: "100%" }}
                    >
                      {productoAgregado &&
                        `Se agregó al carrito el producto: ${productoAgregado}`}
                    </Alert>
                  </Snackbar>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CatalogoProdutos;
