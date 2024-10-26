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
      bg="gray.800"
      borderRadius="xl"
      boxShadow="dark-lg"
    >
      <VStack
        h="full"
        p={5}
        spacing={4}
        align="stretch"
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.100">Configuration</Text>
        
        <FormControl>
          <FormLabel color="gray.100">Content Type</FormLabel>
          <Select 
            bg="gray.700" 
            color="white" 
            borderColor="gray.600"
            value={config.contentType}
            onChange={(e) => handleChange('contentType', e.target.value)}
          >
            <option value="blog">Blog Post</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
            <option value="article">Article</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="gray.100">Tone</FormLabel>
          <Select 
            bg="gray.700" 
            color="white" 
            borderColor="gray.600"
            value={config.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color="gray.100">Creativity Level</FormLabel>
          <Slider 
            value={config.creativityLevel}
            onChange={(val) => handleChange('creativityLevel', val)}
            min={0} 
            max={100}
          >
            <SliderTrack bg="gray.600">
              <SliderFilledTrack bg="blue.500" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel color="gray.100" mb="0">
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
