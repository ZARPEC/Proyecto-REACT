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
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import BlockIcon from "@mui/icons-material/Block";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { set } from "react-hook-form";
const initialFormState = {
  idorden: "",
  usuario: "",
  direccion: "",
};

const CrudOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenDetalles, setDialogOpenDetalles] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [usuarios, setUsuario] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [idOrden, setIdOrden] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrdenes();
  }, [filtro, token]);

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
        filtro === "entregada"
          ? "http://localhost:3005/ordenes/mostrarOrdenes?estado=entregado"
          :filtro === "Rechazado"
          ? "http://localhost:3005/ordenes/mostrarOrdenes?estado=Rechazado" 
          : "http://localhost:3005/ordenes/mostrarOrdenes?estado=Pendiente",
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

const handleRechazar = async (idorden) => {
  try {
    const estado = filtro === "Rechazado" ? 4 : 2;
    await axios.post(
      "http://localhost:3005/ordenes/modificarEstadoOrden",
      { idorden, estado_fk: estado },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchOrdenes();
  } catch (error) {
    console.error("Error al rechazar la orden:", error.response || error);
  }
}

  const handleDelete = async (idorden) => {
    const estado = filtro === "pendiente" ? 7 : 4;
    try {
      await axios.post(
        "http://localhost:3005/ordenes/modificarEstadoOrden",
        { idorden, estado_fk: estado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchOrdenes();
    } catch (error) {
      console.error("Error al eliminar la orden:", error.response || error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const ordenesUnicas = ordenes.filter(
    (orden, index, self) =>
      index === self.findIndex((o) => o.idorden === orden.idorden)
  );

  const handleOpenDialog = (orden = null) => {
    setEditMode(!!orden);
    setFormData(orden || initialFormState);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData(initialFormState);
  };

  const handleCloseDialogDetalles = () => {
    setDialogOpenDetalles(false);
  };

  const handleOpenDialogDetalles = (idOrden) => {
    setDialogOpenDetalles(true);
    setIdOrden(idOrden);
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
      <Button variant="contained" color="error" onClick={()=> handleFiltro("Rechazado")}
      style={{ marginBottom: "20px", marginRight: "20px" }}
      >
        Ordenes Rechazadas
      </Button>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "30px" }}>
          {filtro ==="pendiente" ? "Ordenes Pendientes" : filtro === "entregada" ? "Ordenes Entregadas" : "Ordenes Rechazadas"}
        </p>
      </div>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Acciones</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenesUnicas.map((orden) => (
              <TableRow key={orden.idorden}>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(orden)}
                    style={{ marginRight: "10px" }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(orden.idorden)}>
                    {filtro === "pendiente" ? (
                       <DoneOutlineIcon color="success" />
                    ) : (
                      <PendingActionsIcon color="warning" />
                     
                    )}
                  </IconButton>
                  {filtro === "pendiente" ? (
                    <IconButton onClick={() => handleRechazar(orden.idorden)}>
                      <BlockIcon color="error" />
                    </IconButton>
                  ) : null}
                </TableCell>
                <TableCell>{orden.idorden}</TableCell>
                <TableCell>{`${orden.nombre} ${orden.apellido}`}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenDialogDetalles(orden.idorden)}
                  >
                    <ReceiptLongIcon />
                    Detalles
                  </Button>
                </TableCell>
                <TableCell>{orden.direccion}</TableCell>
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

      <Dialog
        open={dialogOpenDetalles}
        onClose={handleCloseDialogDetalles}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Detalles de la Orden</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenes
                  .filter((orden) => orden.idorden === idOrden)
                  .map((orden) => (
                    <TableRow key={orden.idorden}>
                      <TableCell>{orden.producto}</TableCell>
                      <TableCell>{orden.cantidad}</TableCell>
                      <TableCell>{orden.precio}</TableCell>
                      <TableCell>{orden.total}</TableCell>
                    </TableRow>
                  ))}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Total Detalles</TableCell>
                  <TableCell align="right">
                    Q
                    {ordenes
                      .filter((orden) => orden.idorden === idOrden)
                      .reduce((total, orden) => total + orden.total, 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDetalles} color="primary">
            Cerrar
          </Button>
          {filtro === "pendiente" ? <Button>rechazar Orden</Button> : null}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudOrdenes;
