import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',  // Default text color
      },
    },
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'blue.400',
      },
      variants: {
        filled: {
          field: {
            color: 'white',
            backgroundColor: 'rgba(45, 55, 72, 0.8)',
            _hover: {
              backgroundColor: 'rgba(45, 55, 72, 0.9)',
            },
            _focus: {
              backgroundColor: 'rgba(45, 55, 72, 0.9)',
            },
          },
        },
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'blue.400',
      },
    },
    Button: {
      baseStyle: {
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s ease',
      },
    },
  },
})

export default theme