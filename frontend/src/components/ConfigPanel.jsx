import { Box, VStack, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text, Switch, FormControl, FormLabel } from '@chakra-ui/react'

function ConfigPanel() {
  return (
    <VStack
      w="300px"
      h="full"
      bg="gray.800"
      p={4}
      spacing={6}
      borderRadius="xl"
      boxShadow="dark-lg"
    >
      <Text fontSize="xl" fontWeight="bold" color="gray.100">Configuration</Text>
      
      <FormControl>
        <FormLabel color="gray.100">Content Type</FormLabel>
        <Select bg="gray.700" color="white" borderColor="gray.600">
          <option value="blog">Blog Post</option>
          <option value="social">Social Media</option>
          <option value="email">Email</option>
          <option value="article">Article</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel color="gray.100">Tone</FormLabel>
        <Select bg="gray.700" color="white" borderColor="gray.600">
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel color="gray.100">Creativity Level</FormLabel>
        <Slider defaultValue={70} min={0} max={100}>
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
        <Switch colorScheme="blue" />
      </FormControl>
    </VStack>
  )
}

export default ConfigPanel