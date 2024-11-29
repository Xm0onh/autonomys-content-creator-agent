import { ChakraProvider, Box, Flex, VStack, Text, Button, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { FiShield } from 'react-icons/fi';
import theme from './theme'
import ChatInterface from './components/ChatInterface'
import FileUpload from './components/FileUpload'
import ConfigPanel from './components/ConfigPanel'
import DatabaseBackup from './components/TemplateGallery'
import PreviewPanel from './components/PreviewPanel'
import { ConfigProvider } from './context/ConfigContext'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ChakraProvider theme={theme}>
      <ConfigProvider>
        <Box minH="100vh" bg="gray.900" p={4}>
          <Flex 
            maxW="1800px" 
            mx="auto" 
            mb={4} 
            align="center" 
            justify="space-between"
          >
            <Flex align="center" gap={3}>
              <Box
                as="img"
                src="/assets/Autonomys_RGB_Mark_White.svg"
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
            
            <Text 
              color="gray.400" 
              fontSize="md"
              fontStyle="italic"
            >
              Autonomys Network - The Foundation Layer for AI3.0
            </Text>

            <Button
                onClick={onOpen}
                colorScheme="green"
                size="md"
                leftIcon={<Icon as={FiShield} />}
                bgGradient="linear(to-r, green.400, teal.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, green.500, teal.600)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
              Attestation
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg="gray.800" color="white">
                <ModalHeader>Attestation</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Text>Your attestation content goes here...</Text>
                </ModalBody>
              </ModalContent>
            </Modal>

          </Flex>

          {/* Existing layout */}
          <Flex maxW="1800px" mx="auto" h="calc(100vh - 8rem)" gap={4}>
            {/* Left Column */}
            <VStack spacing={4} w="300px" h="full">
              <Box h="60%" w="full">
                <ConfigPanel />
              </Box>
              <Box h="40%" w="full">
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
