import { ChakraProvider, Box, Flex, VStack } from '@chakra-ui/react'
import ChatInterface from './components/ChatInterface'
import FileUpload from './components/FileUpload'
import ConfigPanel from './components/ConfigPanel'
import TemplateGallery from './components/TemplateGallery'
import PreviewPanel from './components/PreviewPanel'

function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.900" p={4}>
        <Flex maxW="1800px" mx="auto" h="calc(100vh - 2rem)" gap={4}>
          {/* Left Column */}
          <VStack spacing={4} w="300px" h="full">
            <Box flex="1">
              <ConfigPanel />
            </Box>
            <Box flex="1">
              <TemplateGallery />
            </Box>
          </VStack>
          
          {/* Middle Column */}
          <Flex flex="1" gap={4}>
            <FileUpload />
            <Box flex="1">
              <ChatInterface />
            </Box>
          </Flex>
          
          {/* Right Column */}
          <PreviewPanel />
        </Flex>
      </Box>
    </ChakraProvider>
  )
}

export default App
