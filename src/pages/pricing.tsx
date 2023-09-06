import { FC } from 'react';
import Head from 'next/head';
import UserNav from '../components/UserNav';
import Footer from '../components/Footer';
import { Box, Flex, Text } from 'theme-ui';
import HR from '../components/HR';

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
  return (
    <Box
      sx={{
        height: '448px',
        width: '315px',
        p: 4,
        border: '1px solid',
        borderColor: 'neutral.2',
        borderRadius: '12px',
      }}>
      <Text
        as="h1"
        sx={{
          fontFamily: 'satoshi',
          fontWeight: 400,
          fontSize: 6,
          color: 'gray.8',
        }}>
        {title}
      </Text>
      <HR my="28px" />
      <Text as="h1" sx={{ fontWeight: 700, fontSize: 6, color: 'gray.8' }}>
        ${price}
        <Text as="span" sx={{ fontSize: 2, color: 'gray.3' }}>
          /monthly
        </Text>
      </Text>
      <Text
        sx={{
          color: 'gray.8',
          fontSize: 1,
          fontWeight: 400,
          mt: 3,
          mb: '16px',
        }}>
        What’s included
      </Text>
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
            maxWidth: '410px',
            textAlign: 'center',
            color: 'gray.8',
            mt: 5,
            mb: '80px',
          }}>
          Different plans for different needs
        </Text>
        <Flex>
          <Card title="Basic" price={299} />
        </Flex>
      </Box>
      <Footer />
    </>
  );
};

export default Index;
