import { useState } from 'react'
import { Box, Input, Button, VStack } from '@chakra-ui/react'
import MessageList from './MessageList'
import axios from 'axios'

function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    // Add thinking message
    const thinkingMessage = { role: 'assistant', content: '🤔 Thinking...' }
    setMessages(prev => [...prev, thinkingMessage])
    
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.get('http://localhost:8000/query', {
        params: {
          query_text: input
        }
      })
      
      // Remove thinking message and add real response
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg !== thinkingMessage)
        return [...filteredMessages, { 
          role: 'assistant', 
          content: response.data.response
        }]
      })
    } catch (error) {
      console.error('Error:', error)
      // Remove thinking message and add error message
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg !== thinkingMessage)
        return [...filteredMessages, {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.'
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack 
      spacing={4} 
      align="stretch" 
      minH="100vh" 
      p={4} 
      bg="white" 
      boxShadow="md" 
      borderRadius="lg"
    >
  
      <Box flex="1" overflowY="auto" border="1px solid" borderColor="gray.200" p={4}>
        <MessageList messages={messages} />
      </Box>
      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        display="flex" 
        gap={2}
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Thinking..."
          colorScheme="blue"
        >
          Send
        </Button>
      </Box>
    </VStack>
  )
}

export default ChatInterface
