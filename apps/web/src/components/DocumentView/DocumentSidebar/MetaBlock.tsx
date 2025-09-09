import React, { useState } from 'react';
import {
  Drawer,
  useDrawer,
  Box,
  Flex,
  Button,
  Text,
  InputText,
  Field,
} from '@wraft/ui';
import { useForm } from 'react-hook-form';
import { EditIcon } from '@wraft/icon';

import { convertToVariableName } from 'utils';

import { useDocument } from '../DocumentContext';
import apiService from '../APIModel';

const MetaBlock = () => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { editorMode, cId, token, meta, setMeta } = useDocument();

  const orderedKeys = ['type', 'contract_value', 'start_date', 'expiry_date'];

  const { register, handleSubmit } = useForm();
  const mobileMenuDrawer = useDrawer();

  const onSubmit = async (data: Record<string, any>) => {
    try {
      setSubmitting(true);

      const response = await apiService.put(
        `contents/${cId}/meta`,
        { ...data },
        token,
      );

      if (response?.meta) {
        setMeta((prev: any) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to update meta:', error);
    } finally {
      setSubmitting(false);
      closeDrawer();
    }
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Box mt="xl">
      <>
        {meta && meta.length > 0 && (
          <>
            <Flex justify="space-between">
              <Text fontWeight="500" color="text-secondary">
                Meta Info
              </Text>
              {editorMode !== 'view' && (
                <Box onClick={openDrawer}>
                  <EditIcon width={14} className="main-icon" />
                </Box>
              )}
            </Flex>

            <Box
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              mt="sm">
              {meta &&
                typeof meta === 'object' &&
                orderedKeys.map((key) => {
                  let value = meta[key];

                  if (key === 'contract_value' && typeof value === 'string') {
                    value = !isNaN(parseFloat(value))
                      ? `$${parseFloat(value).toLocaleString('en-US')}`
                      : value;
                  }

                  return (
                    value !== undefined && (
                      <Flex
                        key={key}
                        borderBottom="1px solid"
                        borderColor="border"
                        p="md">
                        <Text flex="0 0 60%" fontWeight="heading">
                          {String(value)}
                        </Text>
                        <Text
                          flex="0 0 40%"
                          color="text-secondary"
                          fontWeight="heading"
                          textTransform="capitalize"
                          textAlign="right">
                          {key.replace(/_/g, ' ')}
                        </Text>
                      </Flex>
                    )
                  );
                })}
            </Box>
          </>
        )}
      </>

      <Drawer
        open={isDrawerOpen}
        store={mobileMenuDrawer}
        aria-label="field drawer"
        withBackdrop={true}
        onClose={closeDrawer}>
        <Flex
          as="form"
          h="100vh"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}>
          <Box flexShrink="0">
            <Drawer.Header>
              <Drawer.Title>Meta Info</Drawer.Title>
            </Drawer.Header>
          </Box>
          <Box flex={1} overflowY="auto" px="xl" py="md">
            {meta && Object.keys(meta).length > 0 && (
              <Box>
                {Object.entries(meta)
                  .filter(([key]) => key !== 'type')
                  .map(([key, value]) => (
                    <Box key={key} pb="sm">
                      {key === 'start_date' || key === 'expiry_date' ? (
                        <Field label={key.replace(/_/g, ' ')}>
                          <InputText
                            placeholder=""
                            type="date"
                            defaultValue={String(value)}
                            {...register(convertToVariableName(key))}
                          />
                        </Field>
                      ) : key === 'contract_value' ? (
                        <Field label={key.replace(/_/g, ' ')}>
                          <InputText
                            placeholder=""
                            type="number"
                            defaultValue={`${!isNaN(parseFloat(value as string)) ? parseFloat(value as string) : ''}`}
                            {...register(convertToVariableName(key))}
                          />
                        </Field>
                      ) : (
                        <Field label={key.replace(/_/g, ' ')}>
                          <InputText
                            placeholder=""
                            defaultValue={String(value)}
                            {...register(convertToVariableName(key))}
                          />
                        </Field>
                      )}
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
          <Flex flexShrink="0" px="xl" py="md" gap="sm">
            <Button type="submit" loading={submitting}>
              Update
            </Button>
            <Button variant="secondary" onClick={closeDrawer}>
              Close
            </Button>
          </Flex>
        </Flex>
      </Drawer>
    </Box>
  );
};
export default MetaBlock;
