import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useNavigate } from 'react-router-dom';
import { static_url } from '../utils';

export interface CardComponentProps {
    image: string;
    topic: string;
    id: string;
}

const CardComponent: React.FC<CardComponentProps> = ( props ) => {
  const [isHovering, setIsHovering] = useState(false); // State to track hover
  const url = `${static_url}/test-images`;
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handlePlayClick = () => {
    console.log("play button: " + props.id); // Log the movie title on click
  };

  const handleCardClick = () => {
    navigate(`/chats/${props.id}`);
    console.log("media: " + props.id); // Log the movie title on click
  }

  return (
    <Card
      elevation={4}
      sx={{
        maxWidth: { xs: 160, sm: 200 }, // 160px on xs devices, 200px on sm devices and up
        width: { xs: '160px', sm: '200px' },
        flexShrink: 0,
        position: 'relative'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: { xs: '144px', sm: '180px' }, // 144px high on xs, 180px on sm and above
            transition: 'transform .5s ease',
            '&:hover': { transform: 'scale(1.1)' },
          }}
          image={`${url}${props.image}`}
          alt={props.topic}
          onClick={handleCardClick}
        />
        {isHovering && (
          <IconButton
            aria-label="play"
            onClick={handlePlayClick}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              color: 'primary.main',
              backgroundColor: 'rgba(255,255,255,0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
              margin: '8px',
            }}
          >
            <PlayCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        )}
      </Box>
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {props.topic}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
