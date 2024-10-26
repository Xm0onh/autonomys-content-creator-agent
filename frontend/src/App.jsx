import { ChakraProvider, Container } from '@chakra-ui/react'
import ChatInterface from './components/ChatInterface'

function App() {
  return (
    <ChakraProvider>
      <Container 
        maxW="container.lg" 
        py={8} 
        minH="100vh" 
        bg="gray.50"
      >
        <ChatInterface />
      </Container>
    </ChakraProvider>
  )
}

export default App
