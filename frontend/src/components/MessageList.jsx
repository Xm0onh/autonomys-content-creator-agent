import { Box, Text, VStack } from '@chakra-ui/react'

function MessageList({ messages }) {
  return (
    <VStack spacing={4} align="stretch" maxH="600px" overflowY="auto">
      {messages.map((message, index) => (
        <Box
          key={index}
          bg={message.role === 'user' ? 'blue.100' : 'gray.100'}
          p={3}
          borderRadius="md"
        >
          <Text>{message.content}</Text>
        </Box>
      ))}
    </VStack>
  )
}

export default MessageList