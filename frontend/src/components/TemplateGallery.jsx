import { Box, VStack, Text, Button, Icon, useToast, Flex } from '@chakra-ui/react'
import { FiDatabase, FiUploadCloud, FiCheck, FiCloud } from 'react-icons/fi'
import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

function DatabaseBackup() {
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const handleBackup = async () => {
    setIsUploading(true)
    try {
      const response = await axios.post('http://localhost:8000/upload-db')
      
      toast({
        title: 'Backup Successful',
        description: `Database backup uploaded with ID: ${response.data.upload_id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Backup error:', error)
      toast({
        title: 'Backup Failed',
        description: error.response?.data?.detail || 'Failed to backup database',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Box 
      h="100%"
      bg="rgba(26, 32, 44, 0.8)"
      backdropFilter="blur(10px)"
      borderRadius="xl" 
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="1px solid rgba(255, 255, 255, 0.18)"
      p={4}
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Flex align="center" gap={2} mb={3}>
        <Icon as={FiCloud} w={5} h={5} color="blue.400" />
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          Database Backup
        </Text>
      </Flex>

      {/* Main Content */}
      <Flex 
        direction="column" 
        justify="space-between" 
        flex="1"
        bg="rgba(45, 55, 72, 0.5)"
        backdropFilter="blur(8px)"
        borderRadius="lg"
        border="1px solid rgba(255, 255, 255, 0.1)"
        p={4}
      >
        {/* Icon and Description */}
        <VStack spacing={3} align="center" mb={4}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon 
              as={FiDatabase} 
              w={10} 
              h={10}
              color="blue.400"
              filter="drop-shadow(0 0 8px rgba(66, 153, 225, 0.4))"
            />
          </motion.div>
          
          <Text 
            color="gray.100" 
            textAlign="center"
            fontSize="sm"
            lineHeight="tall"
          >
            Backup your vector database to DSN
          </Text>
        </VStack>

        {/* Action Section */}
        <VStack spacing={3} w="full">
          <Button
            leftIcon={<Icon as={isUploading ? FiCheck : FiUploadCloud} />}
            size="md"
            onClick={handleBackup}
            isLoading={isUploading}
            loadingText="Uploading..."
            width="full"
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
              transform: "translateY(-2px)",
            }}
          >
            {isUploading ? "Uploading..." : "Backup Database"}
          </Button>

          {/* Status Indicator */}
          
        </VStack>
      </Flex>
    </Box>
  )
}

export default DatabaseBackup