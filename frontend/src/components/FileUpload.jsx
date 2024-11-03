import { VStack, Box, Button, Text, Icon, useToast, Input } from '@chakra-ui/react'
import { FiUpload, FiFile, FiDownload } from 'react-icons/fi'
import { useState } from 'react'
import axios from 'axios'

function FileUpload() {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [cid, setCid] = useState('')
  const [retrievedFiles, setRetrievedFiles] = useState([])
  const [isRetrieving, setIsRetrieving] = useState(false)
  const [uploadIds, setUploadIds] = useState([])
  const toast = useToast()

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files)
    setIsUploading(true)

    try {
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append('file', file)
      })

      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setFiles(prev => [...prev, ...uploadedFiles])
      setUploadIds(prev => [...prev, response.data.upload_id])
      
      toast({
        title: 'Upload Successful',
        description: `File uploaded with ID: ${response.data.upload_id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.detail || 'There was an error uploading your files.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRetrieve = async () => {
    if (!cid) {
      toast({
        title: 'Missing CID',
        description: 'Please provide a CID',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsRetrieving(true)
    try {
      const response = await axios.get(`http://localhost:8000/retrieve/${cid}`)
      setRetrievedFiles(prev => [...prev, { name: response.data.name }])
      toast({
        title: 'Retrieval Successful',
        description: 'File retrieved and added to the database.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Retrieval error:', error)
      toast({
        title: 'Retrieval Failed',
        description: error.response?.data?.detail || 'There was an error retrieving your file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsRetrieving(false)
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
      
      {/* Upload Box */}
      <Box
        w="full"
        p={4}
        bg="gray.700"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <VStack w="full" spacing={4}>
          <Text fontSize="md" color="gray.300">Upload to DSN</Text>
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
        </VStack>
      </Box>
        {/* Files List */}
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
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" color="gray.100" noOfLines={1}>{file.name}</Text>
              {uploadIds[index] && (
                <Text fontSize="xs" color="gray.400">ID: {uploadIds[index]}</Text>
              )}
            </VStack>
          </Box>
        ))}
        {files.length === 0 && (
          <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>
            No files uploaded yet
          </Text>
        )}
      </VStack>
      {/* Retrieve Box */}
      <Box
        w="full"
        p={4}
        bg="gray.700"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.600"
      >
        <VStack w="full" spacing={3}>
          <Text fontSize="md" color="gray.300">Retrieve from DSN</Text>
          <Input
            placeholder="Enter CID"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            bg="gray.800"
            color="gray.100"
            borderColor="gray.600"
          />
          <Button
            colorScheme="green"
            width="full"
            onClick={handleRetrieve}
            leftIcon={<Icon as={FiDownload} />}
            isLoading={isRetrieving}
            loadingText="Retrieving..."
          >
            Retrieve File
          </Button>
        </VStack>
        
      </Box>

      {/* Retrieved Files List */}
      <Box w="full">
        <Text fontSize="sm" color="gray.300" mb={2}>Retrieved Files</Text>
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
          {retrievedFiles.map((file, index) => (
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
              <Icon as={FiFile} color="green.400" />
              <Text fontSize="sm" color="gray.100" noOfLines={1}>{file.name}</Text>
            </Box>
          ))}
          {retrievedFiles.length === 0 && (
            <Text color="gray.400" fontSize="sm" textAlign="center" py={4}>
              No files retrieved yet
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}

export default FileUpload
