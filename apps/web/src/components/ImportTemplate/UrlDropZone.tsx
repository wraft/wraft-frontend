'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Box, Text, InputText, Button, Flex } from '@wraft/ui';
import { File } from '@phosphor-icons/react';

import { IconFrame } from 'common/Atoms';
import { postAPI } from 'utils/models';

import { ActionState, ActionStateConfig } from './ImporterWrapper';

interface UrlUploaderProps {
  onUpload: (data: any, source?: 'upload' | 'url') => void;
  onStateChange?: (state: ActionStateConfig) => void;
  onError?: (error: any) => void;
}

interface TemplateResponse {
  items: Array<{
    title?: string;
    name?: string;
    created_at: string;
    id: string;
    item_type: string;
  }>;
  message: string;
  data?: any;
  meta?: any;
}

interface TemplateInfo {
  fileName: string;
  fileSize: string;
  itemsCount: number;
}

const PROGRESS_STEPS = [20, 40, 60, 80, 100];
const PROGRESS_DELAY = 200;
const UPLOAD_DURATION = 2;

const extractTemplateId = (url: string) =>
  url.match(/\b[0-9a-f-]{36}\b/i)?.[0] || '';

const calculateFileSize = (itemsCount: number): string => {
  if (itemsCount > 5) return '2.4 MB';
  return `${Math.max(0.5, itemsCount * 0.3).toFixed(1)} MB`;
};

const calculateTimeLeft = (progress: number): string => {
  if (progress === 100) return 'Upload complete';
  const secondsLeft = Math.max(
    0,
    UPLOAD_DURATION - (progress / 100) * UPLOAD_DURATION,
  );
  return `${secondsLeft.toFixed(1)} seconds left`;
};

const UrlUploader = ({
  onUpload,
  onStateChange,
  onError,
}: UrlUploaderProps) => {
  const searchParams = useSearchParams();
  const [importUrl, setImportUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [templateInfo, setTemplateInfo] = useState<TemplateInfo | null>(null);

  const updateProgress = async () => {
    for (const progress of PROGRESS_STEPS) {
      await new Promise((resolve) => setTimeout(resolve, PROGRESS_DELAY));

      setUploadProgress(progress);
      onStateChange?.({
        state: ActionState.PROCESSING,
        progress,
        message: `Uploading... ${progress}%`,
      });
    }
  };

  const extractTemplateInfo = (
    response: TemplateResponse,
  ): TemplateInfo | null => {
    if (!response.items?.length) return null;

    const mainItem = response.items[0];
    const fileName = mainItem.title || mainItem.name || 'Template';
    const itemsCount = response.items.length;
    const fileSize = calculateFileSize(itemsCount);

    return { fileName, fileSize, itemsCount };
  };

  const handleUrlUpload = async () => {
    const trimmedUrl = importUrl.trim();
    if (!trimmedUrl) return;

    const templateId = extractTemplateId(trimmedUrl);
    if (!templateId) {
      toast.error('Invalid template URL');
      return;
    }

    try {
      setUploadProgress(10);
      setTemplateInfo(null);

      onStateChange?.({
        state: ActionState.PROCESSING,
        progress: 10,
        message: 'Starting upload...',
      });

      const response = (await postAPI(
        `template_assets/public/${templateId}/install`,
        {},
      )) as TemplateResponse;

      const info = extractTemplateInfo(response);
      if (info) setTemplateInfo(info);

      await updateProgress();

      onUpload(response, 'url');

      onStateChange?.({
        state: ActionState.COMPLETED,
        progress: 100,
        message: 'Upload completed successfully',
      });

      toast.success('Template uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);

      onError?.(err);
      onStateChange?.({
        state: ActionState.ERROR,
        message: err?.message || 'Failed to upload template',
      });

      toast.error('Failed to upload template');
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (!urlParam) return;

    const formattedUrl = urlParam.startsWith('import-')
      ? `http://app.wraft.app/manage/import?url=${urlParam}`
      : urlParam;

    setImportUrl(formattedUrl);
  }, [searchParams]);

  const isUploading = uploadProgress > 0 && uploadProgress < 100;
  const timeLeft = calculateTimeLeft(uploadProgress);

  return (
    <Box>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box bg="gray.400" borderRadius="lg" p="md" mb="md">
          <Flex justifyContent="space-between" alignItems="center" mb="xs">
            <Flex alignItems="center" gap="sm">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="lg"
                h="lg"
                borderRadius="6px">
                <IconFrame color="primary">
                  <File size={24} />
                </IconFrame>
              </Box>
              <Box>
                <Text fontWeight="medium" fontSize="sm">
                  {templateInfo?.fileName}
                </Text>
                <Text fontSize="xs">
                  {templateInfo?.fileSize || '2.4 MB'} • {timeLeft}
                  {templateInfo?.itemsCount &&
                    ` • ${templateInfo.itemsCount} items`}
                </Text>
              </Box>
            </Flex>
            <Text fontSize="sm" fontWeight="medium">
              {uploadProgress}%
            </Text>
          </Flex>

          <Box
            w="100%"
            h={6}
            bg="white"
            borderRadius="xs"
            overflow="hidden"
            my="md"
            position="relative">
            <Box
              position="absolute"
              top="0"
              left="0"
              h="100%"
              w={`${uploadProgress}%`}
              bg="primary"
              borderRadius="sm"
              transition="width 0.3s ease"
            />
          </Box>
        </Box>
      )}

      <Box mb="md">
        <Text fontSize="" fontWeight="medium" mb="sm">
          Import From URL
        </Text>
        <InputText
          placeholder="Please add URL"
          value={importUrl}
          onChange={(e: any) => setImportUrl(e.target.value)}
          disabled={isUploading}
        />
      </Box>

      <Flex gap="sm" justifyContent="flex-end">
        <Button
          onClick={handleUrlUpload}
          disabled={!importUrl.trim() || isUploading}
          loading={isUploading}
          size="md">
          {isUploading ? 'Importing...' : 'Install'}
        </Button>
      </Flex>
    </Box>
  );
};

export default UrlUploader;
