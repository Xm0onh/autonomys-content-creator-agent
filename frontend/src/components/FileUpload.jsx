import { VStack, Box, Button, Text, Icon, useToast } from '@chakra-ui/react'
import { FiUpload, FiFile } from 'react-icons/fi'
import { useState } from 'react'
import axios from 'axios'

function FileUpload() {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files)
    setIsUploading(true)

    try {
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append('files', file)
      })

      await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setFiles(prev => [...prev, ...uploadedFiles])
      toast({
        title: 'Upload Successful',
        description: 'Your files have been uploaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your files.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <VStack
      w="300px"
      h="full"
      bg="gray.800"
      p={4}
      spacing={4}
      borderRadius="xl"
      borderRight="1px"
      borderColor="gray.700"
      boxShadow="dark-lg"
    >
      <Text fontSize="xl" fontWeight="bold" color="gray.100">Documents</Text>
      
      <Button
        as="label"
        htmlFor="file-upload"
        colorScheme="blue"
        variant="solid"
        leftIcon={<Icon as={FiUpload} />}
        isLoading={isUploading}
        cursor="pointer"
        width="full"
        bg="blue.600"
        _hover={{ bg: 'blue.500' }}
      >
        Upload Files
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.txt"
        />
      </Button>

      <VStack
        align="stretch"
        w="full"
        flex="1"
        overflowY="auto"
        spacing={2}
        borderRadius="md"
        bg="gray.700"
        p={2}
      >
        {files.map((file, index) => (
          <Box
            key={index}
            p={2}
            bg="gray.800"
            borderRadius="md"
            border="1px"
            borderColor="gray.600"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ bg: 'gray.750' }}
          >
            <Icon as={FiFile} color="blue.400" />
            <Text fontSize="sm" color="gray.100" noOfLines={1}>{file.name}</Text>
          </Box>
        ))}
        {files.length === 0 && (
          <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>
            No files uploaded yet
          </Text>
        )}
      </VStack>
    </VStack>
  )
}

export default FileUpload
