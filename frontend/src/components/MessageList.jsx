import { Box, Text, VStack, Flex } from '@chakra-ui/react'

function MessageList({ messages }) {
  return (
    <VStack spacing={4} align="stretch" maxH="600px" overflowY="auto">
      {messages.map((message, index) => (
        <Flex
          key={index}
          justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
        >
          <Box
            maxW="70%"
            bg={message.role === 'user' ? 'blue.600' : 'gray.700'}
            color={message.role === 'user' ? 'white' : 'gray.100'}
            p={4}
            borderRadius="lg"
            boxShadow="dark-lg"
            position="relative"
            _after={message.role === 'user' ? {
              content: '""',
              position: 'absolute',
              right: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: '10px solid transparent',
              borderLeftColor: 'blue.600'
            } : {
              content: '""',
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: '10px solid transparent',
              borderRightColor: 'gray.700'
            }}
          >
            <Text fontSize="md">{message.content}</Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  )
}

export default MessageList
