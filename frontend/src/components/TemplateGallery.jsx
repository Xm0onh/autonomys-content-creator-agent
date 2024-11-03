import { Box, VStack, Text, Button, Icon, useToast } from '@chakra-ui/react'
import { FiDatabase, FiUploadCloud } from 'react-icons/fi'
import { useState } from 'react'
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
      bg="gray.800" 
      borderRadius="xl" 
      boxShadow="dark-lg"
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold" color="gray.100">
          Vector Database Backup
        </Text>
        
        <Box
          p={6}
          bg="gray.700"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.600"
        >
          <VStack spacing={4} align="center">
            <Icon as={FiDatabase} w={12} h={12} color="blue.400" />
            <Text color="gray.300" textAlign="center">
              Backup your Chroma vector database to DSN for safe storage and sharing
            </Text>
            <Button
              leftIcon={<Icon as={FiUploadCloud} />}
              colorScheme="blue"
              size="lg"
              onClick={handleBackup}
              isLoading={isUploading}
              loadingText="Uploading..."
              width="full"
            >
              Backup Database
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default DatabaseBackup