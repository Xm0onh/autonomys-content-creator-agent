import { Box, SimpleGrid, Text, VStack, Icon } from '@chakra-ui/react'
import { FiFileText, FiMail, FiInstagram, FiLinkedin } from 'react-icons/fi'

function TemplateCard({ icon, title, description }) {
  return (
    <VStack
      p={3}
      bg="gray.700"
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ bg: 'gray.600', transform: 'translateY(-2px)' }}
      spacing={2}
    >
      <Icon as={icon} w={5} h={5} color="blue.400" />
      <Text color="white" fontWeight="bold" fontSize="sm">{title}</Text>
      <Text color="gray.300" fontSize="xs" textAlign="center">{description}</Text>
    </VStack>
  )
}

function TemplateGallery() {
  return (
    <Box 
      h="100%"
      bg="gray.800" 
      borderRadius="xl" 
      boxShadow="dark-lg"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Text fontSize="xl" fontWeight="bold" color="gray.100" p={4} pb={2}>
        Templates
      </Text>
      
      <Box p={4} pt={2} flex="1" overflowY="auto">
        <SimpleGrid columns={2} spacing={3}>
          <TemplateCard
            icon={FiFileText}
            title="Blog Post"
            description="SEO-optimized blogs"
          />
          <TemplateCard
            icon={FiMail}
            title="Email"
            description="Email campaigns"
          />
          <TemplateCard
            icon={FiInstagram}
            title="Social Post"
            description="Social media content"
          />
          <TemplateCard
            icon={FiLinkedin}
            title="Article"
            description="Professional article writing"
          />
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default TemplateGallery
