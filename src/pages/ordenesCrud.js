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
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
const initialFormState = {
  idorden: "",
  usuario: "",
  direccion: "",
};

const CrudOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [usuarios, setUsuario] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrdenes();
  }, [filtro,token]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const responseUsuario = await axios.get(
          "http://localhost:3005/cliente/mostrarClientes",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(responseUsuario.data);
        setUsuario(responseUsuario.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [token]);

  const fetchOrdenes = async () => {
    
    try {
      const response = await axios.get(
        filtro === "entregada"?
        "http://localhost:3005/ordenes/mostrarOrdenes":
        "http://localhost:3005/ordenes/mostrarOrdenesPendientes",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrdenes(response.data);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
    }
  };

  const handleFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
  };

  const handleDelete = async (idorden) => {
    const estado = filtro === "entregada" ? 4 : 7;
    try {
      await axios.post(
        "http://localhost:3005/ordenes/modificarEstadoOrden",
        { idorden, estado_fk: estado },
        {
             headers: { Authorization: `Bearer ${token}` },}
      );

      fetchOrdenes();
    } catch (error) {
      console.error("Error al eliminar la orden:",error.response|| error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOpenDialog = (orden = null) => {
    setEditMode(!!orden);
    setFormData(orden || initialFormState);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData(initialFormState);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.post(
          `http://localhost:3005/ordenes/modificarOrden`,
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Órdenes</h1>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleFiltro("pendiente")}
        style={{ marginBottom: "20px", marginRight: "20px" }}
      >
        Ordenes Pendientes
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleFiltro("entregada")}
        style={{ marginBottom: "20px", marginRight: "20px" }}
      >
        Ordenes Entregadas
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Acciones</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Producto</TableCell>
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
                    onClick={() => handleOpenDialog(orden)}
                    style={{ marginRight: "10px" }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(orden.idorden)}>
                    {filtro === "entregada" ? (
                      <DeleteIcon color="error" />
                    ) : (
                      <DoneOutlineIcon color="success" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{orden.idorden}</TableCell>
                <TableCell>{`${orden.nombre} ${orden.apellido}`}</TableCell>
                <TableCell>{orden.productos}</TableCell>
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
          {Object.keys(initialFormState).map(
            (field) =>
              field !== "idorden" &&
              field !== "usuario" && (
                <TextField
                  key={field}
                  name={field}
                  label={field.replace("_", " ").toUpperCase()}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  type={
                    field === "cantidad" ||
                    field === "precio" ||
                    field === "total"
                      ? "number"
                      : "text"
                  }
                />
              )
          )}
          <TextField
            select
            label="USUARIO"
            name="usuario"
            value={formData.usuario || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          >
            {/* Verificamos si 'usuarios' está definido y es un array */}
            {Array.isArray(usuarios) && usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <MenuItem key={usuario.idUsuario} value={usuario.idUsuario}>
                  {usuario.email}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay usuarios disponibles</MenuItem>
            )}
          </TextField>
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
};

export default CrudOrdenes;
