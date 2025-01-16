import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Chip,
  Box,
  Button,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const OrdenesUsuario = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ordenes, setOrdenes] = useState([]);
  const [dialogOpenDetalles, setDialogOpenDetalles] = useState(false);
  const [idOrden, setIdOrden] = useState(0);
  const ordenesUnicas = ordenes.filter(
    (orden, index, self) =>
      index === self.findIndex((o) => o.idorden === orden.idorden)
  );

  const handleCloseDialogDetalles = () => {
    setDialogOpenDetalles(false);
  };

  const handleOpenDialogDetalles = (idOrden) => {
    setDialogOpenDetalles(true);
    setIdOrden(idOrden);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idCLiente = localStorage.getItem("idUsuario");
    const fetchOrdenes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/ordenes/mostrarOrdenes?idCliente=${idCLiente}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setOrdenes(data);
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchOrdenes();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "entregado":
        return "success";
      case "Pendiente":
        return "warning";
      case "Enviado":
        return "info";
      case "Rechazado":
        return "error";
      default:
        return "default";
    }
  };

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
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Vista de Órdenes
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabla de órdenes">
              <TableHead>
                <TableRow>
                  <TableCell>ID Orden</TableCell>
                  <TableCell>Detalles</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenesUnicas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.idorden}>
                      <TableCell component="th" scope="row">
                        {order.idorden}
                      </TableCell>
                      <TableCell>
                  <Button
                    onClick={() => handleOpenDialogDetalles(order.idorden)}
                  >
                    <ReceiptLongIcon />
                    Detalles
                  </Button>
                </TableCell>
                     
                      <TableCell>{order.fecha_orden}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.nombreEstado}
                          color={getStatusColor(order.nombreEstado)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ordenes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
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
        </DialogActions>
      </Dialog>

      </div>
    </div>
  );
};

export default OrdenesUsuario;
