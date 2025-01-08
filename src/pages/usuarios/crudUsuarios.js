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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestoreIcon from "@mui/icons-material/Restore";
import { useForm, Controller } from "react-hook-form";

function CrudUsuarios() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filtro, setFiltro] = useState("activo");

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      idUsuario: "",
      rol: "",
      estado: "",
      email: "",
      pass: "",
      nombre: "",
      apellido: "",
      telefono: "",
      nacimiento: "",
    },
  });
  // Manejo de apertura y cierre de diálogos
  const handleClickOpen = () => {
   reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
  };

  
  const handlefiltro = (filtro) => {
    setFiltro(filtro);
  };

  // Crear o editar un usuario
  const onSubmit = async (data) => {
    try {
      const url = editOpen
        ? "http://localhost:3005/usuario/modificarUsuario"
        : "http://localhost:3005/usuario/agregarUsuario";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al ${editOpen ? "editar" : "crear"} usuario.`);
      }

      const updatedUser = await response.json();
      if (editOpen) {
        setUsers(
          users.map((user) =>
            user.idUsuario === updatedUser.idUsuario ? updatedUser : user
          )
        );
      } else {
        setUsers([...users, updatedUser]);
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Eliminar un usuario
  const handleDelete = async (idUsuario) => {
    var estadoSet = filtro == "activo" ? 3 : 1;
    try {
      const url = `http://localhost:3005/cliente/modificarEstadoCliente`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idCliente: idUsuario, estado_fk: estadoSet }),
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
    if (editOpen && currentUser) {
      reset({
        idUsuario: currentUser.idUsuario,
        rol: currentUser.rol,
        estado: currentUser.estado,
        email: currentUser.email,
        pass: currentUser.pass,
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        telefono: currentUser.telefono,
        nacimiento: currentUser.nacimiento,
      });
    }
    const fetchData = async () => {
      var url = "";
      if (filtro === "activo") {
        url = "http://localhost:3005/cliente/mostrarClientes";
      } else if (filtro === "inactivo") {
        url = "http://localhost:3005/cliente/mostrarClientes?estado=Inactivos";
      }
      try {
        const [responseClientes, responseRol] = await Promise.all([
          fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:3005/roles/mostrarRoles", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!responseClientes.ok) {
          throw new Error("Error al cargar usuarios.");
        }
        if (!responseRol.ok) {
          throw new Error("Error al cargar roles.");
        }

        const data = await responseClientes.json();
        const datarol = await responseRol.json();
        setUsers(data);
        setRoles(datarol);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchData();
  }, [token, filtro, currentUser,editOpen]);

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "75" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          Crear Nuevo Usuario
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlefiltro("inactivo")}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          Usuarios Inactivos
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlefiltro("activo")}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          Usuarios Activos
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
                        setEditOpen(true);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    {filtro === "activo" ? (
                      <IconButton
                        onClick={() => handleDelete(user.idUsuario)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleDelete(user.idUsuario)}
                        color="success"
                      >
                        <RestoreIcon />
                      </IconButton>
                    )}
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
        <DialogTitle>{editOpen ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre" fullWidth />
              )}
            />
            <Controller
              name="apellido"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Apellido" fullWidth />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Email" fullWidth/>
              )}
            />
            <Controller
              name="pass"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                />
              )}
            />
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Teléfono" fullWidth/>
              )}
            />
            <Controller
              name="rol"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth>
                  {roles.map((rol) => (
                    <MenuItem key={rol.idRol} value={rol.idRol}>
                      {rol.nombreRol}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="nacimiento"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Nacimiento"
                  type="date"
                  fullWidth
                />
              )}
            />
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" color="primary">
                {editOpen ? "Guardar" : "Crear"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

export default CrudUsuarios;
