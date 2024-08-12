import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Check, Circle } from '@phosphor-icons/react';
// import { CheckCircle2, Circle } from 'lucide-react';

interface Approver {
  name: string;
  image: string;
}

interface Step {
  status: string;
  date: string;
  time: string;
  approver: Approver;
}

const steps: Step[] = [
  {
    status: 'Draft',
    date: '2024-08-10',
    time: '09:30 AM',
    approver: { name: 'John Doe', image: '/api/placeholder/40/40' },
  },
  {
    status: 'Review',
    date: '2024-08-11',
    time: '02:15 PM',
    approver: { name: 'Jane Smith', image: '/api/placeholder/40/40' },
  },
  {
    status: 'Revisions',
    date: '2024-08-12',
    time: '11:00 AM',
    approver: { name: 'Mike Johnson', image: '/api/placeholder/40/40' },
  },
  {
    status: 'Approval',
    date: '2024-08-13',
    time: '04:45 PM',
    approver: { name: 'Emily Brown', image: '/api/placeholder/40/40' },
  },
  {
    status: 'Publish',
    date: '2024-08-14',
    time: '10:00 AM',
    approver: { name: 'Alex Wilson', image: '/api/placeholder/40/40' },
  },
];

const Container = styled.div`
  max-width: 28rem;
  margin: 2rem auto 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  background-color: #d1d5db;
  margin: 0.25rem 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepStatus = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const StepDate = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const ApproverInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ApproverImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
`;

const ApproverName = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const VerticalStepper: React.FC = () => {
  return (
    <Container>
      <Title>Document Progress</Title>
      <div>
        {steps.map((step, index) => (
          <StepContainer key={index}>
            <IconContainer>
              {index < steps.length - 1 ? <Check /> : <Circle />}
              {index < steps.length - 1 && <VerticalLine />}
            </IconContainer>
            <StepContent>
              <StepStatus>{step.status}</StepStatus>
              <StepDate>
                {step.date} at {step.time}
              </StepDate>
              <ApproverInfo>
                <ApproverName>{step.approver.name}</ApproverName>
              </ApproverInfo>
            </StepContent>
          </StepContainer>
        ))}
      </div>
    </Container>
  );
};

export default VerticalStepper;
