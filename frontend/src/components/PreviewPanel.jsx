import { Box, VStack, Text, Input, Button, Icon, useToast } from '@chakra-ui/react'
import { FiSearch, FiMessageSquare } from 'react-icons/fi'
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
      const response = await fetch('http://localhost:8000/search', {
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
      const response = await fetch('http://localhost:8000/chat/context', {
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
      bg="gray.800"
      p={4}
      borderRadius="xl"
      boxShadow="dark-lg"
    >
      <VStack h="full" spacing={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.100">Google Search</Text>
        
        <Box w="full">
          <Input
            placeholder="What you are looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            color="gray.100"
            bg="gray.700"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </Box>

        <Box
          flex="1"
          w="full"
          bg="gray.700"
          p={4}
          borderRadius="md"
          color="gray.100"
          overflowY="auto"
        >
          {searchResult || 'Search results will appear here'}
        </Box>

        <Box w="full" pt={2} borderTop="1px" borderColor="gray.700">
          <Button
            leftIcon={<Icon as={FiSearch} />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            mr={2}
            onClick={handleSearch}
            isLoading={isLoading}
          >
            Search
          </Button>
          <Button
            leftIcon={<Icon as={FiMessageSquare} />}
            colorScheme="blue"
            size="sm"
            onClick={sendToChat}
            isDisabled={!searchResult}
          >
            Send to Chat
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default PreviewPanel
