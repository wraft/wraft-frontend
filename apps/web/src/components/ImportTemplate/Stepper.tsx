import { motion } from 'framer-motion';
import { Check } from '@phosphor-icons/react';

import { Box } from 'common/Box';
import { Text } from 'common/Text';

import { Circle } from './Styled';

interface StepSectionProps {
  step?: any;
  currentStep: number;
  onSelect?: any;
}

const Stepper = ({ currentStep, step, onSelect }: StepSectionProps) => {
  return (
    <Box display="flex" flex={1} key={step.id} px={0} py={3}>
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
        <Box pl={3} pt={0}>
          <Box pr={1} className="rest-line" mt={2}>
            <Text
              lineHeight={1}
              fontSize="sm"
              m={0}
              fontWeight="bold"
              cursor="pointer"
              color={{ _: 'gray.400', ':hover': 'green.1200' }}
              mb={0}
              onClick={() => onSelect && onSelect(step)}>
              {step.title}
            </Text>
            <Box className="line" bg="gray.400" />
          </Box>
          <Text fontSize="xs" lineHeight={1} mt={2} color="gray.900">
            {step.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Stepper;
