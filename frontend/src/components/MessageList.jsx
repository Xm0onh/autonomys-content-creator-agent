import { Box, Text, VStack, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'

function MessageList({ messages }) {
  return (
    <VStack spacing={4} align="stretch">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Flex justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
            <Box
              maxW="80%"
              bg={message.role === 'user' 
                ? 'linear-gradient(135deg, #4299E1 0%, #805AD5 100%)'
                : 'rgba(45, 55, 72, 0.6)'}
              backdropFilter="blur(10px)"
              p={4}
              borderRadius="full"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
              position="relative"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
              }}
              transition="all 0.2s ease"
            >
              <Text fontSize="md" lineHeight="tall">{message.content}</Text>
            </Box>
          </Flex>
        </motion.div>
      ))}
    </VStack>
  )
}

export default MessageList
