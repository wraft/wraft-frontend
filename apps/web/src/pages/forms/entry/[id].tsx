import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Spinner, Text } from 'theme-ui';
import { Button } from '@wraft/ui';

import { Logo } from 'components/Icons';
import FormViewForm from 'components/FormViewForm';
import { fetchAPI } from 'utils/models';

type Props = object;

const Index = (props: Props) => {
  const [items, setItems] = useState<any>([]);
  const [formdata, setFormdata] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const cId: string = router.query.id as string;
  const loadData = (id: string) => {
    setLoading(true);

    fetchAPI(`forms/${id}`)
      .then((data: any) => {
        console.log(data);
        setFormdata(data);
        const fileds = data.fields.map((i: any) => {
          return {
            id: i.id,
            name: i.name,
            type: i.field_type.name,
            fieldTypeId: i.field_type.id,
            required: i.validations.some(
              (val: any) =>
                val.validation.rule === 'required' &&
                val.validation.value === true,
            ),
            value: undefined,
          };
        });
        setItems(fileds);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cId && cId.length > 0) loadData(cId);
  }, [cId]);

  if (loading) {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}>
        <Spinner width={32} />
      </Flex>
    );
  }

  return (
    <Box sx={{ background: 'background' }}>
      <Box sx={{ position: 'absolute', top: 4, left: 4 }}>
        <Logo />
      </Box>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            my: 5,
            maxWidth: '80ch',
            width: '100%',
          }}>
          <Box sx={{ width: '100%', height: '4px', bg: 'green.700' }}></Box>
          <Box
            sx={{
              bg: 'white',
              p: 4,
              border: '1px solid',
              borderTop: 'none',
              borderColor: 'border',
            }}>
            <Text as="p" variant="h4Medium">
              {formdata?.name || 'name'}
            </Text>
            <Text as="p" variant="h6Regular" sx={{ mt: 3, color: 'gray.600' }}>
              {formdata?.description || 'description'}
            </Text>
          </Box>
          <Box
            sx={{
              mt: 4,
              bg: 'white',
              border: '1px solid',
              borderColor: 'border',
            }}>
            <FormViewForm items={items} />
          </Box>
          <Flex sx={{ p: 4, pl: 0, gap: '16px' }}>
            <Button>Save</Button>
            <Button variant="secondary">Cancel</Button>
          </Flex>
          <Text as="p" variant="pR" mt={4}>
            This content is created by the owner of the form. The data you
            submit will be sent to the form owner. Wraft is not responsible for
            the privacy or security practices of its customers, including those
            of this form owner. Never give out your password.
          </Text>
          <Text as="p" variant="pR" mt={4}>
            Powered by <Text variant="pB">Wraft Forms</Text>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Index;
