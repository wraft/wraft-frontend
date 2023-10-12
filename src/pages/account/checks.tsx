import { FC } from 'react';
import Head from 'next/head';
import Page from '../../components/PageFrame';
import { Text, Flex, Box } from 'theme-ui';
import PageHeader from '../../components/PageHeader';
import OrgSidebar from '../../components/OrgSidebar';

/**
 *  @TODO Icons: Convert to local files
 */
// import { CheckCircle } from '@styled-icons/bootstrap/CheckCircle';

/**
 * Simple Check Box
 * @returns
 */

const checkBoxes = [
  {
    name: 'All Layouts mapped to Assets are present',
  },
  {
    name: 'Theme has fonts',
  },
  {
    name: 'E-mail delivery',
  },
];

const Contents: FC = () => {
  return (
    <>
      <Head>
        <title>Checks | Wraft</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Settings" desc="Infrastructure Checks">
          <Box sx={{ ml: 'auto' }} />
        </PageHeader>
        <Flex sx={{ px: 4 }}>
          <OrgSidebar />
          <Box pl={4}>
            {checkBoxes &&
              checkBoxes.map((cb: any) => (
                <Flex sx={{ p: 3, border: 'solid 1px #ddd' }} key={cb?.name}>
                  {/* <CheckCircle width="24" height="24px" color="green.2" /> */}
                  <Text
                    as="h3"
                    sx={{ fontWeight: 400, color: 'gray.6', ml: 3 }}>
                    {cb?.name}
                  </Text>
                </Flex>
              ))}
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
