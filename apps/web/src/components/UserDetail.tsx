import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Flex } from 'theme-ui';

import { fetchAPI } from 'utils/models';

const Form = () => {
  const [sachet, setSachet] = useState<any>();
  // const [_ains, setMains] = useState<any>();
  // const [chartData, setChartData] = useState<any>();

  const router = useRouter();
  const cId: string = router.query.id as string;

  const loadDataSuccess = (data: any) => {
    setSachet(data);
  };

  const loadData = (id: string) => {
    fetchAPI(`profiles/${id}`).then((data: any) => {
      loadDataSuccess(data);
    });
  };

  useEffect(() => {
    loadData(cId);
  }, []);

  // useEffect(() => {
  //   if (sachet && sachet.id) {
  //     setMains(sachet.nutrition_infos);
  //   }
  // }, [sachet]);

  return (
    <Box py={3}>
      {sachet && (
        <Box>
          <Text variant="pagetitle">{sachet.name}</Text>
          <Box>
            <Text pt={1}>{sachet?.user?.contact_info?.email}</Text>
            <Text pt={2}>{sachet?.user?.contact_info?.mob}</Text>
          </Box>

          <Text>
            Calory Slab: {sachet?.nutrition_info?.calories_per_day?.range_start}{' '}
            - {sachet?.nutrition_info?.calories_per_day?.range_end}
          </Text>
          <Flex mt={4} sx={{ borderBottom: 'solid 1px #ddd' }}>
            <Box
              p={3}
              sx={{
                borderTop: 'solid 1px #ddd',
                borderLeft: 'solid 1px #ddd',
                borderRight: 'solid 1px #ddd',
              }}>
              <Text variant="blocktitle">Orders</Text>
            </Box>
          </Flex>
          <Box variant="tableItem" pt={4} pb={4}>
            {sachet.user.orders &&
              sachet.user.orders.map((m: any) => (
                <Box key={m.amount}>
                  <Text variant="cardtitle">
                    {m.start_date} to {m.end_date}
                  </Text>

                  <Text mt={2}>{m.amount} QAR</Text>
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Form;
