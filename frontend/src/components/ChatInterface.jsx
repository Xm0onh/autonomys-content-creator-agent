import { useState, useRef, useEffect } from 'react'
import { Box, Input, Button, VStack, Flex, Icon } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import MessageList from './MessageList'
import axios from 'axios'

function ChatInterface() {
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      spacing={0} 
      align="stretch" 
      h="full" 
      bg="gray.800"
      boxShadow="dark-lg"
      borderRadius="xl"
      overflow="hidden"
    >
      <Box 
        flex="1" 
        overflowY="auto" 
        p={6}
        bg="gray.800"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            background: 'gray.800',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.600',
            borderRadius: '24px',
          },
        }}
      >
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </Box>
      
      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        p={4}
        bg="gray.750"
        borderTop="1px solid"
        borderColor="gray.700"
      >
        <Flex gap={3}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            size="lg"
            bg="gray.700"
            border="1px solid"
            borderColor="gray.600"
            color="white"
            _hover={{
              borderColor: 'gray.500'
            }}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: 'none'
            }}
            _placeholder={{
              color: 'gray.400'
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={isLoading}
            loadingText="Sending"
            px={8}
            leftIcon={<Icon as={FiSend} />}
            bg="blue.600"
            _hover={{ bg: 'blue.500' }}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </VStack>
  )
}

export default ChatInterface
