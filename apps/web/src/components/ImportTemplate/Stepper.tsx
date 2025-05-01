import { motion } from 'framer-motion';
import { Check } from '@phosphor-icons/react';
import { Text, Box, Flex } from '@wraft/ui';

import { Circle } from './Styled';

interface StepSectionProps {
  step?: any;
  currentStep: number;
  onSelect?: any;
}

const Stepper = ({ currentStep, step, onSelect }: StepSectionProps) => {
  return (
    <Flex flex={1} key={step.id} py="md">
      <motion.div
        style={{
          display: 'flex',
          marginTop: '2px',
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: currentStep === step.id ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}>
        {currentStep > step.id ? (
          <Circle bg="green.1000" color="green.100">
            <Check size={12} weight="bold" />
          </Circle>
        ) : (
          <Circle
            bg={currentStep === step.id ? '#f3922b' : 'gray.400'}
            color={currentStep === step.id ? 'green.100' : 'gray.1100'}>
            {step.id}
          </Circle>
        )}
      </motion.div>
      <Box flex={1}>
        <Box pl="sm">
          <Box pr="sm" className="rest-line" mt="sm">
            <Text
              lineHeight={1}
              fontWeight="bold"
              cursor="pointer"
              color={{ _: 'gray.400', ':hover': 'green.1200' }}
              onClick={() => onSelect && onSelect(step)}>
              {step.title}
            </Text>
            <Box className="line" bg="gray.400" />
          </Box>
          <Text fontSize="sm" lineHeight={1} mt="xs" color="text-secondary">
            {step.description}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Stepper;
