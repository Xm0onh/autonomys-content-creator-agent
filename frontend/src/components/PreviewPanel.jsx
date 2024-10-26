import { Box, VStack, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Icon } from '@chakra-ui/react'
import { FiDownload, FiCopy } from 'react-icons/fi'

function PreviewPanel() {
  return (
    <Box
      w="400px"
      h="full"
      bg="gray.800"
      p={4}
      borderRadius="xl"
      boxShadow="dark-lg"
    >
      <VStack h="full" spacing={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.100">Preview</Text>
        
        <Tabs isFitted variant="enclosed" flex="1" w="full">
          <TabList mb="1em">
            <Tab color="gray.100" _selected={{ color: "white", bg: "gray.700" }}>Raw</Tab>
            <Tab color="gray.100" _selected={{ color: "white", bg: "gray.700" }}>Formatted</Tab>
          </TabList>
          
          <TabPanels flex="1" overflowY="auto">
            <TabPanel>
              <Box
                bg="gray.700"
                p={4}
                borderRadius="md"
                color="gray.100"
                minH="200px"
              >
                {/* Generated content goes here */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box
                bg="gray.700"
                p={4}
                borderRadius="md"
                color="gray.100"
                minH="200px"
              >
                {/* Formatted content goes here */}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box w="full" pt={2} borderTop="1px" borderColor="gray.700">
          <Button
            leftIcon={<Icon as={FiCopy} />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            mr={2}
          >
            Copy
          </Button>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            colorScheme="blue"
            size="sm"
          >
            Download
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default PreviewPanel