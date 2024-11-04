import { ChakraProvider, Box, Flex, VStack, Text } from '@chakra-ui/react'
import ChatInterface from './components/ChatInterface'
import FileUpload from './components/FileUpload'
import ConfigPanel from './components/ConfigPanel'
import DatabaseBackup from './components/TemplateGallery'
import PreviewPanel from './components/PreviewPanel'
import { ConfigProvider } from './context/ConfigContext'

function App() {
  return (
    <ChakraProvider>
      <ConfigProvider>
        <Box minH="100vh" bg="gray.900" p={4}>
          {/* Brand Header */}
          <Flex 
            maxW="1800px" 
            mx="auto" 
            mb={4} 
            align="center" 
            justify="space-between"
          >
            <Flex align="center" gap={3}>
              {/* You can replace this with your actual logo */}
              <Box
                as="img"
                src="/assets/Autonomys_RGB_Mark_White.svg" // Add your logo file
                h="40px"
                alt="Autonomys Network"
              />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                letterSpacing="tight"
              >
                AI3.0 Content Generator Agent
              </Text>
            </Flex>
            
            {/* Optional: Add a tagline or additional branding */}
            <Text 
              color="gray.400" 
              fontSize="md"
              fontStyle="italic"
            >
              Autonomys Network - The Foundation Layer for AI3.0
            </Text>
          </Flex>

          {/* Existing layout */}
          <Flex maxW="1800px" mx="auto" h="calc(100vh - 8rem)" gap={4}>
            {/* Left Column */}
            <VStack spacing={4} w="300px" h="full">
              <Box flex="1">
                <ConfigPanel />
              </Box>
              <Box flex="1">
              <DatabaseBackup />
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
      </ConfigProvider>
    </ChakraProvider>
  )
}

export default App
