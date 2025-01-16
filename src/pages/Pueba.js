import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardActions } from '@mui/material';

const PagPrueba = () => {
    return (
        <div>
            {/* Barra de navegación */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Mi Página de Ejemplo
                    </Typography>
                    <Button color="inherit">Iniciar Sesión</Button>
                </Toolbar>
            </AppBar>

            {/* Contenido principal */}
            <Container sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Bienvenido a mi sitio
                </Typography>
                <Typography variant="body1" paragraph>
                    Este es un ejemplo de página creada con Material-UI en React. A continuación, puedes ver una lista de tarjetas de ejemplo.
                </Typography>
                <Grid container spacing={4}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Tarjeta {index + 1}
                                    </Typography>
                                    <Typography variant="body2">
                                        Contenido de ejemplo para la tarjeta {index + 1}. Puedes personalizarlo según tus necesidades.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        Más información
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Pie de página */}
            <footer style={{ marginTop: 16, padding: 16, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" color="textSecondary">
                    © 2025 Mi Página de Ejemplo. Todos los derechos reservados.
                </Typography>
            </footer>
        </div>
    );
};

export default PagPrueba;
