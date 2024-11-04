import { VStack, Box, Button, Text, Icon, useToast, Input, Flex, Progress } from '@chakra-ui/react'
import { FiUpload, FiFile, FiDownload, FiFolder } from 'react-icons/fi'
import { motion } from 'framer-motion'
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
      bg="rgba(26, 32, 44, 0.8)"
      backdropFilter="blur(10px)"
      p={4}
      spacing={4}
      borderRadius="xl"
      border="1px solid rgba(255, 255, 255, 0.18)"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.47)",
      }}
    >
      <Flex align="center" gap={2} w="full">
        <Icon as={FiFolder} w={6} h={6} color="blue.400" />
        <Text 
          fontSize="xl" 
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          Documents
        </Text>
      </Flex>
      
      {/* Upload Box */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        w="full"
        p={4}
        bg="rgba(45, 55, 72, 0.5)"
        backdropFilter="blur(8px)"
        borderRadius="lg"
        border="1px solid rgba(255, 255, 255, 0.1)"
        transition="all 0.2s"
        _hover={{
          border: "1px solid rgba(66, 153, 225, 0.5)",
        }}
      >
        <VStack w="full" spacing={4}>
          <Text fontSize="md" color="white">Upload to DSN</Text>
          <Button
            as="label"
            htmlFor="file-upload"
            leftIcon={<Icon as={FiUpload} />}
            isLoading={isUploading}
            cursor="pointer"
            width="full"
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
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
      <Box
        w="full"
        flex="1"
        overflowY="auto"
        bg="rgba(45, 55, 72, 0.3)"
        borderRadius="lg"
        border="1px solid rgba(255, 255, 255, 0.1)"
        p={2}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
          },
        }}
      >
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              p={3}
              mb={2}
              bg="rgba(45, 55, 72, 0.5)"
              backdropFilter="blur(8px)"
              borderRadius="lg"
              border="1px solid rgba(255, 255, 255, 0.1)"
              display="flex"
              alignItems="center"
              gap={3}
              _hover={{
                border: "1px solid rgba(66, 153, 225, 0.5)",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
            >
              <Icon as={FiFile} color="blue.400" boxSize={5} />
              <VStack align="start" spacing={0} flex={1}>
                <Text fontSize="sm" color="white" noOfLines={1}>{file.name}</Text>
                {uploadIds[index] && (
                  <Text fontSize="xs" color="gray.400">ID: {uploadIds[index]}</Text>
                )}
              </VStack>
            </Box>
          </motion.div>
        ))}
        {files.length === 0 && (
          <Flex 
            justify="center" 
            align="center" 
            h="100px"
            color="gray.400"
          >
            <Text fontSize="sm">No files uploaded yet</Text>
          </Flex>
        )}
      </Box>

      {/* Retrieve Box */}
      <Box
        w="full"
        p={4}
        bg="rgba(45, 55, 72, 0.5)"
        backdropFilter="blur(8px)"
        borderRadius="lg"
        border="1px solid rgba(255, 255, 255, 0.1)"
        transition="all 0.2s"
        _hover={{
          border: "1px solid rgba(66, 153, 225, 0.5)",
        }}
      >
        <VStack w="full" spacing={3}>
          <Text fontSize="md" color="white">Retrieve from DSN</Text>
          <Input
            placeholder="Enter CID"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            bg="rgba(45, 55, 72, 0.5)"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.1)"
            _hover={{
              border: "1px solid rgba(66, 153, 225, 0.5)",
            }}
            _focus={{
              border: "1px solid rgba(66, 153, 225, 0.8)",
              boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.3)",
            }}
          />
          <Button
            width="full"
            onClick={handleRetrieve}
            leftIcon={<Icon as={FiDownload} />}
            isLoading={isRetrieving}
            loadingText="Retrieving..."
            bgGradient="linear(to-r, green.400, teal.500)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, green.500, teal.600)",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            Retrieve File
          </Button>
        </VStack>
      </Box>

      {/* Retrieved Files List */}
      <Box w="full">
        <Text 
          fontSize="sm" 
          color="white" 
          mb={2}
          fontWeight="medium"
        >
          Retrieved Files
        </Text>
        <Box
          w="full"
          bg="rgba(45, 55, 72, 0.3)"
          borderRadius="lg"
          border="1px solid rgba(255, 255, 255, 0.1)"
          p={2}
          maxH="200px"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
            },
          }}
        >
          {retrievedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                p={3}
                mb={2}
                bg="rgba(45, 55, 72, 0.5)"
                backdropFilter="blur(8px)"
                borderRadius="lg"
                border="1px solid rgba(255, 255, 255, 0.1)"
                display="flex"
                alignItems="center"
                gap={3}
                _hover={{
                  border: "1px solid rgba(66, 153, 225, 0.5)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <Icon as={FiFile} color="green.400" boxSize={5} />
                <Text fontSize="sm" color="white" noOfLines={1}>{file.name}</Text>
              </Box>
            </motion.div>
          ))}
          {retrievedFiles.length === 0 && (
            <Flex 
              justify="center" 
              align="center" 
              h="100px"
              color="gray.400"
            >
              <Text fontSize="sm">No files retrieved yet</Text>
            </Flex>
          )}
        </Box>
      </Box>
    </VStack>
  )
}

export default FileUpload
