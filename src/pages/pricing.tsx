import { FC } from 'react';
import Head from 'next/head';
import UserNav from '../components/UserNav';
import Footer from '../components/Footer';
import { Box, Close, Flex, Text } from 'theme-ui';
import HR from '../components/HR';
import { IconCorrect, IconCorrectDark } from '../components/IconsPricing';
import ButtonCustom from '../components/ButtonCustom';

interface cardProps {
  dark?: boolean;
  title: string;
  price: number;
  fullAccess?: boolean;
  users?: boolean;
  storage?: boolean;
}

const Card = ({
  dark,
  title,
  price,
  fullAccess,
  users,
  storage,
}: cardProps) => {
  const bgColor: string = dark ? 'gray.8' : 'bgWhite';
  const text: string = dark ? 'bgWhite' : 'gray.8';
  const iconYes = dark ? <IconCorrectDark /> : <IconCorrect />;
  const iconNo = dark ? (
    <Close size={16} m={0} color="white" />
  ) : (
    <Close size={16} m={0} />
  );
  return (
    <Box
      bg={bgColor}
      sx={{
        height: '448px',
        width: '315px',
        p: 4,
        border: '1px solid',
        borderColor: 'neutral.2',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <Text
        as="h1"
        sx={{
          fontFamily: 'satoshi',
          fontWeight: 400,
          fontSize: 6,
          lineHeight: '1',
          color: text,
        }}>
        {title}
      </Text>
      <HR my="28px" color="gray.0" />
      <Text
        as="h1"
        sx={{
          fontWeight: 700,
          fontSize: 6,
          lineHeight: '1',
          color: text,
        }}>
        ${price}
        <Text as="span" sx={{ fontSize: 2, color: 'gray.3' }}>
          /monthly
        </Text>
      </Text>
      <Text
        as="p"
        mt="28px"
        mb="16px"
        sx={{
          color: text,
          fontSize: 1,
          fontWeight: 400,
        }}>
        What’s included
      </Text>
      <Flex sx={{ flexDirection: 'column', gap: '12px', mb: '30px' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: '12px',
            }}>
            {fullAccess ? iconYes : iconNo}
          </Box>
          <Text sx={{ fontSize: 0, fontWeight: 400, color: text }}>
            Full Access
          </Text>
        </Flex>
        <Flex sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: '12px',
            }}>
            {users ? iconYes : iconNo}
          </Box>
          <Text sx={{ fontSize: 0, fontWeight: 400, color: text }}>
            Upto 10 users
          </Text>
        </Flex>
        <Flex sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: '12px',
            }}>
            {storage ? iconYes : iconNo}
          </Box>
          <Text sx={{ fontSize: 0, fontWeight: 400, color: text }}>
            Upto 50GB of cloud storage
          </Text>
        </Flex>
      </Flex>
      <ButtonCustom text="Choose this plan" />
    </Box>
  );
};

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Pricing - Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <UserNav />
      <Box
        sx={{
          maxWidth: '1041px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mx: 'auto',
        }}>
        <Text
          as="h1"
          sx={{
            texWrap: 'balance',
            fontSize: [5, 5, 6],
            lineHeight: '1.25',
            maxWidth: '410px',
            textAlign: 'center',
            color: 'gray.8',
            mt: 5,
            mb: '80px',
          }}>
          Different plans for different needs
        </Text>
        <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Card title="Basic" price={299} fullAccess />
          <Card dark title="Pro" price={399} fullAccess users />
          <Card title="Expertise" price={599} fullAccess users storage />
        </Flex>
      </Box>
      <Footer />
    </>
  );
};

export default Index;
