import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

function CrudOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [formData, setFormData] = useState({
    idorden: "",
    nombre: "",
    apellido: "",
    email: "",
    nombre_Comercial: "",
    direccion: "",
    nombre_producto: "",
    cantidad_medida: "",
    cantidad: "",
    precio: "",
    total: "",
    fecha_orden: "",
    nombreEstado: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3005/ordenes/mostrarOrdenes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrdenes(response.data);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenDialog = (orden = null) => {
    setEditMode(!!orden);
    setSelectedOrden(orden);
    setFormData(
      orden || {
        idorden: "",
        nombre: "",
        apellido: "",
        email: "",
        nombre_Comercial: "",
        direccion: "",
        nombre_producto: "",
        cantidad_medida: "",
        cantidad: "",
        precio: "",
        total: "",
        fecha_orden: "",
        nombreEstado: "",
      }
    );
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrden(null);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://127.0.0.1:82/minisuper/api/ordenes/${selectedOrden.idorden}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:82/minisuper/api/ordenes",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchOrdenes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar la orden:", error);
    }
  };

  const handleDelete = async (idorden) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta orden?"))
      return;
    try {
      await axios.delete(
        `http://127.0.0.1:82/minisuper/api/ordenes/${idorden}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrdenes();
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Órdenes</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Crear Orden
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Acciones</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.idorden}>
                <TableCell>
                  <IconButton
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(orden)}
                    style={{ marginRight: "10px" }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(orden.idorden)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
                <TableCell>{orden.idorden}</TableCell>
                <TableCell>{`${orden.nombre} ${orden.apellido}`}</TableCell>
                <TableCell>{orden.nombre_producto}</TableCell>
                <TableCell>{orden.cantidad_medida}</TableCell>
                <TableCell>{orden.precio}</TableCell>
                <TableCell>{orden.total}</TableCell>
                <TableCell>{orden.nombreEstado}</TableCell>
                <TableCell>
                  {new Date(orden.fecha_orden).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Editar Orden" : "Crear Orden"}</DialogTitle>
        <DialogContent>
          <TextField
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="apellido"
            label="Apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="email"
            label="Correo"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="nombre_producto"
            label="Producto"
            value={formData.nombre_producto}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="cantidad"
            label="Cantidad"
            type="number"
            value={formData.cantidad}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="precio"
            label="Precio"
            type="number"
            value={formData.precio}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="total"
            label="Total"
            type="number"
            value={formData.total}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? "Guardar Cambios" : "Crear Orden"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CrudOrdenes;
