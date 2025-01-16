import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Edit,
} from "@mui/icons-material";
import RestoreIcon from "@mui/icons-material/Restore";
import { useForm, Controller, set } from "react-hook-form";
import axios from "axios";

function CrudProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [filtro, setFiltro] = useState("activo");
  const token = localStorage.getItem("token");

  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      idProducto: "",
      nombre_producto: "",
      cantidad_medida: "",
      precio: "",
      stock: "",
      nombre_categoria: "",
      subcategoria: "",
    },
  });

  const categoriaId = watch("nombre_categoria");

  const categoriaSeleccionada = categorias.find(
    (cat) => cat.idCategoria === categoriaId
  );

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/categoria/mostrarCategorias",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchCategorias();
  }, [token]);

  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3005/unidadmedida/mostrarUnidadMedida",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUnidadesMedida(response.data);
      } catch (error) {
        console.error("Error al cargar las unidades de medida:", error);
      }
    };
    fetchUnidadesMedida();
  }, [token]);

  useEffect(() => {
    if (categoriaSeleccionada) {
      console.log(categoriaSeleccionada.nombre_categoria);
      const fetchSubcategorias = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/categoria/mostrarSubCategorias?categoria=${categoriaSeleccionada.nombre_categoria}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSubcategorias(response.data);
        } catch (error) {
          console.error("Error al cargar las subcategorías:", error);
        }
      };

      fetchSubcategorias();
    } else {
      setSubcategorias([]);
    }
  }, [categoriaSeleccionada, token]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(
          filtro === "activo"
            ? "http://localhost:3005/producto/mostrarProductos"
            : "http://localhost:3005/producto/mostrarProductosInactivos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProductos(response.data);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProductos();
  }, [filtro, token, currentProducto, editOpen, open]);

  useEffect(() => {
    if (editOpen && currentProducto) {
      reset({
        idProducto: currentProducto.idProducto,
        nombre_producto: currentProducto.nombre_producto,
        cantidad_medida: currentProducto.cantidad_medida,
        precio: currentProducto.precio,
        stock: currentProducto.stock,
        nombre_categoria: currentProducto.idCategoria,
        subcategoria: currentProducto.idSubcategoria,
        estado: currentProducto.estado,
      });
    }
  }, [editOpen, currentProducto, reset]);

  const handleClickOpen = () => {
    reset({
      idProducto: "",
      nombre_producto: "",
      cantidad_medida: "",
      precio: "",
      stock: "",
      nombre_categoria: "",
      subcategoria: "",
      unidad_medida_fk: "",
      ruta_img: "",
    });
    setOpen(true);
    setEditOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
  };

  const handleFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
  };

  const onSubmit = async (data) => {
    const url = editOpen
      ? "http://localhost:3005/producto/modificarProducto"
      : "http://localhost:3005/producto/AgregarProducto";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al ${editOpen ? "editar" : "crear"} producto.`);
      }

      const updatedProducto = await response.json();

      if (editOpen) {
        setProductos((prev) =>
          prev.map((producto) =>
            producto.idProducto === updatedProducto.id
              ? updatedProducto
              : producto
          )
        );
      } else {
        setProductos((prev) => [...prev, updatedProducto]);
      }

      handleClose();
    } catch (error) {
      console.error(
        `Error al ${editOpen ? "editar" : "crear"} el producto:`,
        error
      );
    }
  };

  const handleDelete = async (idProducto) => {
    const estadoSet = filtro === "activo" ? 3 : 1;
    try {
      await axios.post(
        "http://localhost:3005/producto/modificarEstadoProducto",
        { idProducto, estado_fk: estadoSet },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProductos((prev) =>
        prev.filter((producto) => producto.idProducto !== idProducto)
      );
    } catch (error) {
      console.error("Error al modificar el estado del producto:", error);
    }
  };

  return (
    <div style={{ padding: "20px", width: "75%", margin: "auto" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        style={{ marginBottom: "20px", marginRight: "10px" }}
      >
        Crear Nuevo Producto
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleFiltro("inactivo")}
        style={{ marginBottom: "20px", marginRight: "10px" }}
      >
        Ver Inactivos
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleFiltro("activo")}
        style={{ marginBottom: "20px" }}
      >
        Ver Activos
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Acciones</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Subcategoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.idProducto}>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setCurrentProducto(producto);
                      reset(producto);
                      setEditOpen(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(producto.idProducto)}>
                    {filtro === "activo" ? (
                      <DeleteIcon color="error" />
                    ) : (
                      <RestoreIcon color="success" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{producto.nombre_producto}</TableCell>
                <TableCell>{producto.nombreSubcategoria}</TableCell>
                <TableCell>{producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.nombreCategoria}</TableCell>
                <TableCell>{producto.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open || editOpen} onClose={handleClose}>
        <DialogTitle>
          {editOpen ? "Editar Producto" : "Crear Producto"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="nombre_producto"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre del Producto" fullWidth />
              )}
            />
            <Controller
              name="cantidad_medida"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Cantidad de Medida" fullWidth />
              )}
            />
            <Controller
              name="unidad_medida_fk"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth>
                  {unidadesMedida.map((cat) => (
                    <MenuItem key={cat.idUnidad} value={cat.idUnidad}>
                      {cat.unidad}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="precio"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Precio" type="number" fullWidth />
              )}
            />
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Stock" type="number" fullWidth />
              )}
            />
            <Controller
              name="nombre_categoria"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre_categoria}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="subcategoria"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth>
                  {/* Verificamos si las subcategorías están disponibles antes de renderizar las opciones */}
                  {subcategorias && subcategorias.length > 0 ? (
                    subcategorias.map((sub) => (
                      <MenuItem
                        key={sub.idSubcategoria}
                        value={sub.idSubcategoria}
                      >
                        {sub.subcategoria}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">
                      <em>No hay subcategorías disponibles</em>
                    </MenuItem>
                  )}
                </Select>
              )}
            />
            <Controller
              name="ruta_img"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ruta de imagen"
                  type="text"
                  fullWidth
                />
              )}
            />

            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                {editOpen ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CrudProductos;
