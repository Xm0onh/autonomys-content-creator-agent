import { Box, VStack, Text, Input, Button, Icon, useToast, InputGroup, InputLeftElement, Fade, Flex, Spinner } from '@chakra-ui/react'
import { FiSearch, FiMessageSquare, FiGlobe } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useState } from 'react'

function PreviewPanel() {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch('http://20.49.47.204:8010/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setSearchResult(data.result)
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform search',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendToChat = async () => {
    if (!searchResult) return
    try {
      const response = await fetch('http://20.49.47.204:8010/chat/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: searchResult })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: 'Success',
        description: 'Search result added to chat context',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      console.error('Send to chat error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send to chat',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box
      w="400px"
      h="full"
      bg="rgba(26, 32, 44, 0.8)"
      backdropFilter="blur(10px)"
      p={6}
      borderRadius="xl"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="1px solid rgba(255, 255, 255, 0.18)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.47)",
      }}
    >
      <VStack h="full" spacing={6}>
        <Flex align="center" gap={2}>
          <Icon as={FiGlobe} w={6} h={6} color="blue.400" />
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Web Search
          </Text>
        </Flex>
        
        <Box w="full">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search the web..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              color="white"
              bg="rgba(45, 55, 72, 0.5)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              _hover={{
                border: "1px solid rgba(66, 153, 225, 0.5)",
                bg: "rgba(45, 55, 72, 0.6)",
              }}
              _focus={{
                border: "1px solid rgba(66, 153, 225, 0.8)",
                bg: "rgba(45, 55, 72, 0.7)",
                boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.3)",
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
        </Box>

        <Box
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          flex="1"
          w="full"
          bg="rgba(45, 55, 72, 0.5)"
          backdropFilter="blur(8px)"
          p={5}
          borderRadius="lg"
          border="1px solid rgba(255, 255, 255, 0.1)"
          color="white"
          overflowY="auto"
          position="relative"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          {isLoading ? (
            <Flex justify="center" align="center" h="full">
              <Spinner 
                thickness="3px"
                speed="0.8s"
                color="blue.400"
                size="lg"
              />
            </Flex>
          ) : (
            <Fade in={true}>
              <Text>
                {searchResult || 'Your search results will appear here'}
              </Text>
            </Fade>
          )}
        </Box>

        <Box 
          w="full" 
          pt={4} 
          borderTop="1px solid rgba(255, 255, 255, 0.1)"
          display="flex"
          justifyContent="space-between"
        >
          <Button
            leftIcon={<Icon as={FiSearch} />}
            bg="rgba(66, 153, 225, 0.15)"
            color="blue.400"
            _hover={{
              bg: "rgba(66, 153, 225, 0.25)",
              transform: "translateY(-1px)",
            }}
            size="md"
            onClick={handleSearch}
            isLoading={isLoading}
          >
            Search
          </Button>
          <Button
            leftIcon={<Icon as={FiMessageSquare} />}
            colorScheme="blue"
            variant="solid"
            size="md"
            onClick={sendToChat}
            isDisabled={!searchResult}
            _hover={{
              transform: "translateY(-1px)",
            }}
          >
            Send to Chat
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default PreviewPanel
