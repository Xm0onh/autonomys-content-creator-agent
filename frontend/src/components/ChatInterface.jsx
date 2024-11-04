import { useState, useRef, useEffect } from 'react'
import { Box, Input, Button, VStack, Flex, Icon } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import MessageList from './MessageList'
import axios from 'axios'
import { useConfig } from '../context/ConfigContext'
import { motion } from 'framer-motion'

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
  const { config } = useConfig()

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
      console.log(config)
      const response = await axios.get('http://localhost:8000/query', {
        params: {
          query_text: input,
          config: JSON.stringify(config)  // Send configuration with the request
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
      h="100%"
      bg="rgba(26, 32, 44, 0.8)"
      backdropFilter="blur(10px)"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      borderRadius="2xl"
      border="1px solid rgba(255, 255, 255, 0.18)"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.47)",
      }}
    >
      <Box 
        flex="1" 
        overflowY="auto"
        position="relative"
        p={5}
        bg="gray.800"
        css={{
          '&::-webkit-scrollbar': {
            width: '2px',
            height: '2px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            }
          },
          // For Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent',
        }}
      >
        <Box 
          position="absolute"
          inset={0}
          p={5}
          overflowY="auto"
          sx={{
            '& > *': {
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            },
            '& pre': {
              maxWidth: '100%',
              overflowX: 'hidden',
              overflowY: 'hidden'
            }
          }}
        >
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </Box>
      </Box>
      
      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        p={4}
        bg="rgba(23, 25, 35, 0.9)"
        backdropFilter="blur(10px)"
        borderTop="1px solid rgba(255, 255, 255, 0.1)"
      >
        <Flex 
          gap={2} 
          w="full"
          maxW="100%"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            size="md"
            flex="1"
            minW={0}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.600"
            color="white"
            _hover={{
              borderColor: 'gray.500',
              bg: 'gray.750'
            }}
            _focus={{
              borderColor: 'blue.400',
              bg: 'gray.750',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
            }}
            _placeholder={{
              color: 'gray.400'
            }}
            disabled={isLoading}
            transition="all 0.2s"
          />
          <Button
            type="submit"
            colorScheme="blue"
            size="md"
            isLoading={isLoading}
            loadingText="Sending"
            px={4}
            leftIcon={<Icon as={FiSend} />}
            bg="blue.500"
            flexShrink={0}
            _hover={{ 
              bg: 'blue.400',
              transform: 'translateY(-1px)'
            }}
            transition="all 0.2s"
            shadow="md"
          >
            Send
          </Button>
        </Flex>
      </Box>
    </VStack>
  )
}

export default ChatInterface
