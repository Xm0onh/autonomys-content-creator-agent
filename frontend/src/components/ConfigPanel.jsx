import { Box, VStack, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text, Switch, FormControl, FormLabel } from '@chakra-ui/react'
import { useConfig } from '../context/ConfigContext'

function ConfigPanel() {
  const { config, setConfig } = useConfig()

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Box
      h="100%"
      w="300px"
      bg="rgba(26, 32, 44, 0.75)"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="1px solid rgba(255, 255, 255, 0.18)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.47)",
      }}
    >
      <VStack
        h="full"
        p={6}
        spacing={6}
        align="stretch"
      >
        <Text 
          fontSize="xl" 
          fontWeight="bold" 
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          Configuration
        </Text>
        
        <FormControl>
          <FormLabel 
            color="white"
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="wide"
            fontWeight="medium"
          >
            Content Type
          </FormLabel>
          <Select 
            bg="rgba(45, 55, 72, 0.8)"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.2)"
            _hover={{
              border: "1px solid rgba(66, 153, 225, 0.5)",
            }}
            value={config.contentType}
            onChange={(e) => handleChange('contentType', e.target.value)}
          >
            <option style={{background: '#2D3748'}} value="blog">Blog Post</option>
            <option style={{background: '#2D3748'}} value="social">Social Media</option>
            <option style={{background: '#2D3748'}} value="email">Email</option>
            <option style={{background: '#2D3748'}} value="article">Article</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="white">Tone</FormLabel>
          <Select 
            bg="rgba(45, 55, 72, 0.8)"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.2)"
            value={config.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
          >
            <option style={{background: '#2D3748'}} value="professional">Professional</option>
            <option style={{background: '#2D3748'}} value="casual">Casual</option>
            <option style={{background: '#2D3748'}} value="friendly">Friendly</option>
            <option style={{background: '#2D3748'}} value="formal">Formal</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="white">Creativity Level</FormLabel>
          <Slider 
            value={config.creativityLevel}
            onChange={(val) => handleChange('creativityLevel', val)}
          >
            <SliderTrack bg="rgba(45, 55, 72, 0.5)">
              <SliderFilledTrack bgGradient="linear(to-r, blue.400, purple.500)" />
            </SliderTrack>
            <SliderThumb 
              boxSize={6} 
              bg="white"
              _focus={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)"
              }}
            />
          </Slider>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel color="white" mb="0">
            SEO Optimization
          </FormLabel>
          <Switch 
            colorScheme="blue"
            isChecked={config.seoOptimization}
            onChange={(e) => handleChange('seoOptimization', e.target.checked)}
          />
        </FormControl>
      </VStack>
    </Box>
  )
}

export default ConfigPanel
