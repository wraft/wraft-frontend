import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Text, Flex, Button, Modal, Field, InputText } from '@wraft/ui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { AvatarCard } from 'common/AvatarCard';
import { postAPI, fetchAPI } from 'utils/models';
import { emailPattern } from 'utils/zodPatterns';
import { nameRegex } from 'utils/regex';

import { useDocument } from '../../DocumentContext';

// import * as S from './styles';

type Counterparty = {
  id: string;
  name: string;
  email: string;
  updated_at: string;
  signature_date: string | null;
  created_at: string;
  signature_status: 'pending' | 'signed' | 'rejected';
};

type CounterpartiesResponse = {
  counterparties: Counterparty[];
};

export const SignerSchema = z.object({
  email: emailPattern,
  name: z
    .string()
    .min(3, { message: 'Please enter a name' })
    .regex(nameRegex, 'Allows only letters and spaces'),
});

export type Signer = z.infer<typeof SignerSchema>;

const SignerAddBlock = ({
  onClose,
  addSigner,
}: {
  onClose: () => void;
  addSigner: any;
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { cId } = useDocument();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Signer>({ resolver: zodResolver(SignerSchema) });

  const onSubmit = async (data: Signer) => {
    setLoading(true);

    try {
      const response = await postAPI(`contents/${cId}/add_counterparty`, data);
      addSigner(response);
      setLoading(false);
      onClose();

      toast.success('Added Signer Successfully', {
        duration: 1000,
        position: 'top-right',
      });

      // setVerifyData(response);
    } catch (error) {
      toast.error(error.response?.data || error.message || 'invailed token', {
        duration: 3000,
        position: 'top-right',
      });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="heading" mb="md">
        Add Signer
      </Text>

      <Box w="400px">
        <Flex
          direction="column"
          gap="sm"
          as="form"
          onSubmit={handleSubmit(onSubmit)}>
          <Field label="Name" required error={errors?.name?.message}>
            <InputText {...register('name')} placeholder="Enter Name" />
          </Field>
          <Field label="Email" required error={errors?.email?.message}>
            <InputText
              type="email"
              {...register('email')}
              placeholder="Enter your email address"
            />
          </Field>

          <Flex justifyContent="space-between" mt="lg">
            <Button variant="primary" loading={isLoading} type="submit">
              Add Signer
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const SignerBlock = () => {
  const { cId } = useDocument();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [signers, setSigners] = useState<Counterparty[]>([]);

  const onInvite = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchSigners();
  }, []);

  const fetchSigners = async () => {
    try {
      const response = (await fetchAPI(
        `contents/${cId}/counterparties`,
      )) as CounterpartiesResponse;
      setSigners(response.counterparties);
    } catch (error) {
      console.error('Failed to fetch signers:', error);
    }
  };

  const onRequestSignature = async () => {
    try {
      const response = await postAPI(`contents/${cId}/request_signature`, {});
    } catch (error) {
      toast.error(error.response?.data || error.message || 'invailed token', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };
  return (
    <>
      <Text as="h5" mb="sm">
        Signers
      </Text>
      <Box mt="md">
        {signers &&
          signers.map((signer: any) => (
            <Flex
              key={signer.id}
              mb="md"
              justifyContent="space-between"
              align={'center'}>
              <Box>
                <Text>{signer.name}</Text>
                <Text fontSize="sm" mb="xs" color="text-secondary">
                  {signer.email}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="text.500" mb="xs">
                  {signer.signature_status}
                </Text>
              </Box>
            </Flex>
          ))}
      </Box>
      <Flex gap="sm" direction="row">
        <Button variant="tertiary" onClick={onInvite} size="sm">
          Add Signer
        </Button>
        {signers.length > 0 && (
          <Button variant="tertiary" onClick={onRequestSignature} size="sm">
            Request Signature
          </Button>
        )}
      </Flex>
      <Modal
        open={isDialogOpen}
        ariaLabel="confirm model"
        onClose={() => setDialogOpen(false)}>
        <SignerAddBlock
          onClose={() => setDialogOpen(false)}
          addSigner={(data: Counterparty) =>
            setSigners((prev) => [...prev, data])
          }
        />
      </Modal>
    </>
  );
};

export default SignerBlock;
