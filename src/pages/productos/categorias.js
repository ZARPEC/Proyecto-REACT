import React, { useState, useEffect } from "react";
import SelectActionCard from "../../components/card";
import { Skeleton, Box } from "@mui/material";

function Categorias() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/categoria/mostrarCategorias",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Mapear las categorías al formato esperado por `cards`
        const mappedCards = data.map((category) => ({
          title: category.nombre_categoria, // Ajusta según la estructura de tu API
          image: "logo192.png",

          // Ajusta según la estructura de tu API
        }));
        setCards(mappedCards);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Indica que la carga terminó
      }
    };

    fetchCategories();
  }, [token]); // Dependencia del token (si cambia, vuelve a ejecutar el efecto)

  // Manejador de selección de tarjeta
  const handleCardSelect = (index) => {
    setSelectedCard(index);
    console.log(`Selected card: ${index}`);
  };

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
          width: "70%",
        }}
      >
        {Array.from(new Array(6)).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={150}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>
    ); 
  }

  // Renderizar componente
  return (
    <div style={{ display: "flex", justifyContent: "center", flexDirection: "row", height: "100%",flexWrap: "wrap" }}>
    <SelectActionCard 
      cards={cards}
      selectedCard={selectedCard}
      onCardSelect={handleCardSelect}
      sx={{ marginTop: 3}}
      style={{ color: "black", width: "70%", fontSize: "1.5rem" }}
    />
    </div>
  );
}

export default Categorias;