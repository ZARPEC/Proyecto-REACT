import React, { useState, useEffect } from "react";
import {
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
} from "@mui/material";

const OrdenesUsuario = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ordenes, setOrdenes] = useState([]);


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
                const response = await fetch(`http://localhost:3005/ordenes/mostrarOrdenes?idCliente=${idCLiente}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setOrdenes(data);
                console.log(data);
                if(!response.ok){
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchOrdenes();
    },[]);

  const getStatusColor = (status) => {
    switch (status) {
      case "entregado":
        return "success";
      case "pendiente":
        return "warning";
      case "Enviado":
        return "info";
      case "Cancelado":
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
                  <TableCell>Productos</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.idorden
                    }>
                      <TableCell component="th" scope="row">
                        {order.idorden}
                      </TableCell>
                      <TableCell>{order.productos}</TableCell>
                      <TableCell align="right">
                        Q{order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>{order.fecha_orden}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.nombreEstado}
                          color={getStatusColor(order.status)}
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
      </div>
    </div>
  );
};

export default OrdenesUsuario;
