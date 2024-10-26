import { ChakraProvider, Box, Flex, extendTheme } from '@chakra-ui/react'
import ChatInterface from './components/ChatInterface'
import FileUpload from './components/FileUpload'

// Custom theme with dark mode
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900'
      }
    }
  }
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.900">
        <Flex 
          maxW="1400px" 
          mx="auto" 
          h="100vh" 
          py={8} 
          px={4} 
          gap={4}
        >
          <FileUpload />
          <Box flex="1">
            <ChatInterface />
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  )
}

export default App
