import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Text, Flex, Button, Modal, Field, InputText } from '@wraft/ui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';

import apiService from 'components/DocumentView/APIModel';
import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';
import { emailPattern } from 'utils/zodPatterns';
import { nameRegex } from 'utils/regex';
import { ContentInstance } from 'utils/types/content';

import { SignatureCanvasComponent } from './SignatureCanvas';
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

  const getRandomLightColor = () => {
    const r = Math.floor(200 + Math.random() * 55);
    const g = Math.floor(200 + Math.random() * 55);
    const b = Math.floor(200 + Math.random() * 55);
    return { r, g, b };
  };

  const onSubmit = async (data: Signer) => {
    setLoading(true);

    try {
      const response = await postAPI(`contents/${cId}/add_counterparty`, {
        ...data,
        color_rgb: getRandomLightColor(),
      });
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

          <Flex justifyContent="flex-end" mt="lg" gap="sm">
            <Button variant="primary" loading={isLoading} type="submit">
              Add Signer
            </Button>
            <Button variant="tertiary" onClick={onClose}>
              Cancel
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
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [isRequestSignatureLoading, setIsRequestSignatureLoading] =
    useState(false);
  const [isSavingSignature, setIsSavingSignature] = useState(false);
  const [currentCounterParty, setCurrentCounterParty] = useState<any>(null);

  const {
    activeCounterparty,
    cId: contentId,
    contents,
    docRole,
    signerBoxes,
    signers,
    token,
    inviteType,
    setContents,
    setSignerBoxes,
    setSigners,
  } = useDocument();
  const { userProfile } = useAuth();

  const nullCounterParties = useMemo(() => {
    return signerBoxes?.filter((item: any) => item.counter_party === null);
  }, [signerBoxes]);

  const hasAnyPlaceHolderAssigned = useMemo(() => {
    return signerBoxes?.some(
      (item: any) => item?.counter_party?.email === userProfile?.email,
    );
  }, [signerBoxes]);

  const onInvite = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    if (cId && token && contents) {
      fetchSigners();
    }
  }, [cId, token, contents]);

  const fetchSigners = async () => {
    try {
      const response = (await apiService.get(
        `/contents/${cId}/counterparties`,
        token,
      )) as CounterpartiesResponse;
      setSigners(response.counterparties);
    } catch (error) {
      console.error('Failed to fetch signers:', error);
    }
  };

  const onRequestSignature = async () => {
    if (nullCounterParties.length > 0) {
      setInfoModalOpen(true);
      return;
    }

    setIsRequestSignatureLoading(true);
    const requestSignature = postAPI(`contents/${cId}/request_signature`, {});
    toast.promise(
      requestSignature,
      {
        loading: 'Sending Request...',
        success: () => {
          setIsRequestSignatureLoading(false);
          return 'Request sent successfully';
        },
        error: (error) => {
          setIsRequestSignatureLoading(false);
          const errorMessage =
            error.response?.data || error.message || 'invailed token';
          return errorMessage;
        },
      },
      {
        duration: 4000,
        position: 'top-right',
      },
    );
  };

  const handleSignatureSave = async (signatureDataUrl: string) => {
    if (!signatureDataUrl) {
      return;
    }

    setIsSavingSignature(true);

    const res = await fetch(signatureDataUrl);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append('signature_image', blob, 'signature.png');

    try {
      const response: any = await apiService.post(
        `contents/${contentId}/append_signature`,
        formData,
        token || '',
      );

      setSignerBoxes((prev: any) =>
        prev.map((box: any) =>
          box?.counter_party?.id === currentCounterParty?.id
            ? {
                ...box,
                counter_party: {
                  ...box?.counter_party,
                  signature_status: 'signed',
                },
              }
            : box,
        ),
      );
      if (contents) {
        const updatedContents: ContentInstance = {
          ...contents,
          content: {
            ...contents.content,
            signed_doc_url: response?.signed_pdf_url || null,
          },
        };
        setContents(updatedContents);
      }
      toast.success('Signature saved successfully', {
        duration: 1000,
        position: 'top-right',
      });
      setIsSignatureModalOpen(false);
    } catch (error) {
      console.error('Error uploading signature:', error);
      toast.error('Failed to save signature');
    } finally {
      setIsSavingSignature(false);
    }
  };

  const handleSignatureCancel = () => {
    setIsSignatureModalOpen(false);
  };

  return (
    <>
      <Text as="h5" mb="sm">
        Signers
      </Text>
      <Box mt="md">
        {signers &&
          signers.map((signer: any) => (
            <Box
              key={signer.id}
              mb="md"
              border="1px solid"
              borderColor="border"
              p="md">
              <Flex
                h="80px"
                mb="sm"
                justifyContent="center"
                alignItems="center"
                backgroundColor={
                  signer.signature_status === 'signed'
                    ? 'background-secondary'
                    : 'green.300'
                }
                position="relative">
                {signer.signature_status === 'signed' && (
                  <Text
                    fontSize="sm"
                    mb="xs"
                    position="absolute"
                    right="10"
                    top="10"
                    color="text-secondary">
                    {signer.id}
                  </Text>
                )}
                {signer.signature_image && (
                  <Image
                    src={signer.signature_image}
                    width={230}
                    height={50}
                    alt="signature"
                  />
                )}
                {hasAnyPlaceHolderAssigned > 0 &&
                  nullCounterParties.length === 0 &&
                  userProfile?.email === signer.email &&
                  inviteType !== 'sign' &&
                  signer.signature_status !== 'signed' && (
                    <Text
                      cursor="pointer"
                      onClick={() => {
                        setCurrentCounterParty(signer);
                        setIsSignatureModalOpen(true);
                      }}>
                      Click and Sign
                    </Text>
                  )}
                {userProfile?.email === signer.email ||
                  (activeCounterparty?.email === signer.email &&
                    inviteType === 'sign' &&
                    signer.signature_status !== 'signed' && (
                      <Text
                        cursor="pointer"
                        onClick={() => {
                          setCurrentCounterParty(signer);
                          setIsSignatureModalOpen(true);
                        }}>
                        Click and Sign
                      </Text>
                    ))}
              </Flex>

              <Flex justifyContent="space-between" align={'center'}>
                <Box>
                  <Text>{signer.name}</Text>
                  <Text fontSize="sm" color="text-secondary">
                    {signer.email}
                  </Text>
                  {signer.signature_status === 'signed' && (
                    <Text fontSize="xs">{signer?.signature_date}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="sm" color="text.500" mb="xs">
                    {signer.signature_status === 'signed'
                      ? 'Signed'
                      : 'Pending'}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
      </Box>
      {docRole !== 'signer' && (
        <Flex gap="sm" direction="row">
          <Button variant="tertiary" onClick={onInvite} size="sm">
            Add Signer
          </Button>
          {signers.length > 0 && (
            <Button
              variant="tertiary"
              onClick={onRequestSignature}
              size="sm"
              loading={isRequestSignatureLoading}>
              Request Signature
            </Button>
          )}
        </Flex>
      )}

      <Modal
        open={isDialogOpen}
        ariaLabel="confirm model"
        onClose={() => setDialogOpen(false)}>
        <>
          {isDialogOpen && (
            <SignerAddBlock
              onClose={() => setDialogOpen(false)}
              addSigner={(data: any) =>
                //@ts-expect-error need to fix
                setSigners((prev: any) => [...prev, data])
              }
            />
          )}
        </>
      </Modal>

      <Modal
        open={infoModalOpen}
        ariaLabel="confirm model"
        onClose={() => setInfoModalOpen(false)}>
        <>
          <Modal.Header>Info</Modal.Header>
          <Box>Please assign a signer to the signature placeholder.</Box>
          <Flex gap="sm">
            <Button onClick={() => setInfoModalOpen(false)} variant="tertiary">
              Cancel
            </Button>
          </Flex>
        </>
      </Modal>

      <Modal
        open={isSignatureModalOpen}
        ariaLabel="signature modal"
        onClose={() => setDialogOpen(false)}>
        <Box>
          <Flex justifyContent="space-between" align="center">
            <Text variant="lg" fontWeight="heading">
              Signature
            </Text>
            <Button
              variant="ghost"
              onClick={() => setIsSignatureModalOpen(false)}>
              <X />
            </Button>
          </Flex>
          {isSignatureModalOpen && (
            <SignatureCanvasComponent
              onSave={handleSignatureSave}
              onCancel={handleSignatureCancel}
              loading={isSavingSignature}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default SignerBlock;
