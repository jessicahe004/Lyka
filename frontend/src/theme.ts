import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      100: '#F8E8D0',  // Soft Blush
      200: '#FFEEDB',  // Light Peach
      300: '#D1BFA8',  // Cream
      400: '#A68A64',  // Tan/Beige
      500: '#5E503F',  // Warm Brown
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: '10px',
      },
      variants: {
        solid: {
          bg: 'primary.400',  // Tan for buttons
          color: 'white',
          _hover: {
            bg: 'primary.300',  // Cream hover effect
          },
        },
        outline: {
          borderColor: 'primary.500',
          color: 'primary.500',  // Warm Brown
          _hover: {
            bg: 'primary.100',  // Soft Blush
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'serif',
        color: 'primary.500',  // Warm Brown for headings
      },
    },
    Box: {
      baseStyle: {
        bg: 'primary.300',  // Cream background
        color: 'primary.500',  // Warm Brown text
        borderRadius: '15px',
        p: 8,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: '#D1BFA8',  // Cream background
        color: '#5E503F',  // Warm Brown text
      },
      a: {
        color: 'primary.200',  // Light Peach links
        _hover: {
          textDecoration: 'underline',
          color: 'primary.100',  // Soft Blush on hover
        },
      },
    },
  },
});

export default theme;
