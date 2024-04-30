import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import CardComponent, { CardComponentProps } from './card-component'; // Ensure path is correct


interface SectionProps {
  title: string;
  movies: CardComponentProps[];
  sx?: any;
}

const Section: React.FC<SectionProps> = ({ title, movies, sx }) => {
  const theme = useTheme();
  // Adjust these queries as necessary to fit your responsive design needs
  const cardWidth = '250px'; // Example fixed width; adjust based on your design

  return (
    <Box sx={{...sx}}>
      <Typography variant="h5" component="h2" sx={{ mb: 0.5, px: '20px' /* Match horizontal padding */ }}>
        {title}
      </Typography>
      <Box sx={{ overflowX: 'auto', display: 'flex', p: '20px', gap: '10px' }}>
        {movies.map((movie, index) => (
          <Box key={index} sx={{  margin: 0}}>
            <CardComponent {...movie} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Section;
