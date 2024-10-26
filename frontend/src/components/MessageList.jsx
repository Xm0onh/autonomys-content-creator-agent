import { Box, Text, VStack, Flex } from '@chakra-ui/react'

function MessageList({ messages }) {
  return (
    <VStack 
      spacing={4} 
      align="stretch" 
      maxH="600px" 
      overflowY="auto" 
      overflowX="hidden"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#718096',
          borderRadius: '24px',
        },
      }}
    >
      {messages.map((message, index) => (
        <Flex
          key={index}
          justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
          transform="auto"
          translateY="20px"
          animate={{ translateY: 0 }}
          transition="all 0.3s ease-out"
        >
          <Box
            maxW="80%"
            bg={message.role === 'user' ? 'blue.500' : 'gray.700'}
            color={message.role === 'user' ? 'white' : 'gray.100'}
            p={4}
            borderRadius={message.role === 'user' ? '2xl 2xl 0 2xl' : '2xl 2xl 2xl 0'}
            boxShadow="lg"
            position="relative"
            _hover={{ transform: 'scale(1.01)' }}
            transition="all 0.2s ease"
          >
            <Text fontSize="md" lineHeight="tall">{message.content}</Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  )
}

export default MessageList
