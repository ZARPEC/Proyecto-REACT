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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

function CrudUsuarios() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    rol: "",
    estado: "",
    email: "",
    pass:"",
    nombre: "",
    apellido: "",
    telefono: "",
    nacimiento: "",
  });

  // Manejo de apertura y cierre de diálogos
  const handleClickOpen = () => {
    setFormData({
      idUsuario: "",
      rol: "",
      estado: "",
      email: "",
      pass:"",
      nombre: "",
      apellido: "",
      telefono: "",
      nacimiento: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
  };

  // Actualizar el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear o editar un usuario
  const handleSubmit = async () => {
    
    try {
      const url = editOpen
        ? "http://localhost:3005/usuario/modificarUsuario"
        : "http://localhost:3005/usuario/agregarUsuario";

      const response = await fetch(url, {
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario: formData.idUsuario,
          rol: formData.rol,
          estado: formData.estado,
          email: formData.email,
          pass: formData.pass,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          nacimiento: formData.nacimiento,
        
        }),
        
      });

      if (!response.ok) {
        throw new Error(`Error al ${editOpen ? "editar" : "crear"} usuario.`);
        
      }

      console.log(formData);
      const updatedUser = await response.json();
      const nuevoUsuario= {...formData, idUsuario: updatedUser.id};
      if (editOpen) {
        setUsers(
          users.map((user) =>
            user.idUsuario === updatedUser.idUsuario ? nuevoUsuario : user
          )
        );
      } else {
        setUsers([...users, nuevoUsuario]);
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Eliminar un usuario
  const handleDelete = async (idUsuario) => {
    try {
      const url = `http://localhost:3005/cliente/modificarEstadoCliente`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },body: JSON.stringify({ idCliente:idUsuario, estado_fk: 3 })
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario.");
      }

      setUsers(users.filter((user) => user.idUsuario !== idUsuario));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = "http://localhost:3005/cliente/mostrarClientes";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar usuarios.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        style={{ marginBottom: "20px" }}
      >
        Crear Nuevo Usuario
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Acciones</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.idUsuario}>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setCurrentUser(user);
                      setFormData(user);
                      setEditOpen(true);
                    }}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user.idUsuario)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.telefono}</TableCell>
                <TableCell>{user.nombreRol}</TableCell>
                <TableCell>{user.nombreEstado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar usuarios */}
      <Dialog open={open || editOpen} onClose={handleClose}>
        <DialogTitle>
          {editOpen ? "Editar Usuario" : "Crear Usuario"}
        </DialogTitle>
        <DialogContent>
          {[
            "nombre",
            "apellido",
            "email",
            "pass",
            "telefono",
            "rol",
            "estado",
            "nacimiento",
          ].map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={
                field === "nacimiento"
                  ? "date"
                  : field === "rol" || field === "estado"
                  ? "number"
                  : "text"
              }
              fullWidth
              value={formData[field] || ""}
              onChange={handleInputChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editOpen ? "Guardar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CrudUsuarios;
