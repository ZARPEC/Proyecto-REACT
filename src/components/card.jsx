import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

function SelectActionCard({
  cards = [],
  selectedCard = null,
  onCardSelect = () => {},
  sx = {},
  cardSx = {},
  cardContentSx = {},
}) {
  return (
    <Box
      sx={{
        width: '70%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        textAlign: 'center',
        gap: 2,
        ...sx,
      }}
    >
      {cards.map((card, index) => (
        <Card key={index} sx={{ height: '100%', ...cardSx }}>
          <CardActionArea
            onClick={() => onCardSelect(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
      
            {card.image && (
              <CardMedia
                component="img"
                height="50%" 
                image={card.image}
                alt={card.title}
              />
            )}
            <CardContent sx={{ height: '100%', ...cardContentSx }}>
              <Typography variant="h7" component="div">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default SelectActionCard;
