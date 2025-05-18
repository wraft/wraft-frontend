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
import { Signature } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
import { convertToVariableName } from 'utils';

import { useDocument } from '../DocumentContext';
import apiService from '../APIModel';

const MetaBlock = () => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { editorMode, cId, token, isInvite, meta, setMeta } = useDocument();

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
        isInvite,
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

  const taskList = [
    {
      name: 'Task 1',
      description: 'Description for Task 1',
      dueDate: '2023-12-31',
      status: 'pending',
      priority: 'high',
    },
  ];

  return (
    <Box mt="xl">
      <>
        <Flex justify="space-between">
          <Text as="h6" fontWeight={600} color="gray.1100" mb="md">
            Contract Fields
          </Text>
          {editorMode !== 'view' && (
            <Box onClick={openDrawer}>
              <EditIcon width={14} color="gray.1100" className="main-icon" />
            </Box>
          )}
        </Flex>

        <Box border="1px solid" borderColor="border" borderRadius="lg">
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
                    p="sm">
                    <Text flex="0 0 60%" fontWeight="heading">
                      {key.replace(/_/g, ' ')}
                    </Text>
                    <Text
                      flex="0 0 40%"
                      color="text-secondary"
                      fontWeight="heading"
                      textTransform="capitalize"
                      textAlign="right">
                      {String(value)}
                    </Text>
                  </Flex>
                )
              );
            })}
        </Box>
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
