import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirige al inicio o cualquier ruta que desees
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h3" gutterBottom color="error">
          403 - Unauthorized
        </Typography>
        <Typography variant="h6" paragraph>
          Lo siento, no tienes permisos para acceder a esta página.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
