import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Image from 'next/image';
import { Text, Box, Flex, Container, Button, Grid } from 'theme-ui';

import { useAuth } from '../../contexts/AuthContext';
import { ApproveTick, DocumentCountIcon } from '../Icons';

import PendingDocumentBlock from './PendingDocument';

const finishSetup = [
  {
    title: 'Create a new template',
  },
  {
    title: 'Add a new layout',
  },
  {
    title: 'Customise a new theme',
  },
  {
    title: 'Create a new flow',
  },
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [dashboardLoading, setDashboardLoading] = useState();
  const { userProfile } = useAuth();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 50000);

    return () => clearInterval(intervalId);
  }, [userProfile?.organisation_id]);

  const getGreeting = () => {
    const currentHour = currentTime.getHours();

    if (currentHour >= 0 && currentHour < 6) {
      return 'Good night';
    } else if (currentHour >= 6 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <Container variant="layout.pageFrame">
      <Box sx={{ fontSize: 2, color: 'gray.400' }}>
        {format(currentTime, 'EEEE, MMMM dd')}
      </Box>
      <Box sx={{ fontSize: 3, fontWeight: 'heading', fontFamily: 'body' }}>
        {getGreeting()}, {userProfile?.name}
      </Box>
      <Flex
        mt={4}
        mb="32px"
        sx={{ border: '1px solid', borderColor: 'border' }}>
        <Flex sx={{ width: '70%', alignItems: 'center' }}>
          <Image
            src="/static/images/dashboardone.png" // Adjust the path accordingly
            alt="Description of your image"
            width={0}
            height={0} // Set the desired height
            style={{ width: 'auto', height: '180px' }}
          />
          <Box>
            <Box
              sx={{
                fontSize: '16px',
                fontWeight: 'heading',
                lineHeight: '19.2px',
                mb: 3,
              }}>
              Personalise your experience
            </Box>
            <Text as="p" sx={{ fontSize: '12px', mb: 3 }}>
              Customise Wraft to suit to your experience. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit
            </Text>
            <Button
              variant="btnPrimary"
              // onClick={() => toggleSearch()}
              sx={{ fontWeight: 'heading' }}>
              Watch demo
            </Button>
          </Box>
        </Flex>
        <Flex
          sx={{
            width: '30%',
            // justifyContent: 'center',
            borderLeft: '1px solid',
            borderColor: 'border',
            py: 3,
            px: 4,
          }}>
          <Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 'heading',
                mb: '18px',
              }}>
              Finish setup
            </Box>
            {finishSetup.map((data, i) => (
              <Flex sx={{ alignItems: 'center', mb: '18px' }} key={i}>
                <ApproveTick />
                <Box
                  px={2}
                  sx={{
                    fontSize: '12px',
                  }}>
                  {data.title}
                </Box>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Flex>

      <Grid gap={3} columns={2}>
        <Flex
          sx={{
            border: '1px solid',
            borderColor: 'border',
            py: '22px',
            px: '18px',
          }}>
          <DocumentCountIcon />
          <Box ml={2}>
            <Box
              sx={{
                fontSize: '10px',
                mb: '3px',
              }}>
              Total no. of documents
            </Box>
            <Box
              sx={{
                fontSize: '10px',
                fontWeight: 700,
              }}>
              4
            </Box>
          </Box>
        </Flex>
        <Flex
          sx={{
            border: '1px solid',
            borderColor: 'border',
            py: '22px',
            px: '18px',
          }}>
          <DocumentCountIcon />
          <Box ml={2}>
            <Box
              sx={{
                fontSize: '10px',
                mb: '3px',
              }}>
              Pending approvals
            </Box>
            <Box
              sx={{
                fontSize: '10px',
                fontWeight: 700,
              }}>
              0
            </Box>
          </Box>
        </Flex>
      </Grid>

      <PendingDocumentBlock />
    </Container>
  );
};

export default Dashboard;
