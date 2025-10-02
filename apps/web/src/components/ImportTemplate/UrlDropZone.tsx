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

const extractTemplateId = (url: string): string => {
  const match = url.match(
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  );
  return match ? match[0] : '';
};

const UrlUploader = ({
  onUpload,
  onStateChange,
  onError,
}: UrlUploaderProps) => {
  const searchParams = useSearchParams();
  const [importUrl, setImportUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [templateInfo, setTemplateInfo] = useState<{
    fileName: string;
    fileSize: string;
    itemsCount: number;
  } | null>(null);

  const simulateProgress = async () => {
    for (let p = 20; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(p);

      const secondsLeft = Math.max(0, 2 - (p / 100) * 2);
      setTimeLeft(`${secondsLeft.toFixed(1)} seconds left`);

      onStateChange?.({
        state: ActionState.PROCESSING,
        progress: p,
        message: `Uploading... ${p}%`,
      });
    }
    setTimeLeft('Upload complete');
  };

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      if (urlParam.startsWith('import-')) {
        setImportUrl(`http://app.wraft.app/manage/import?url=${urlParam}`);
      } else {
        setImportUrl(urlParam);
      }
    }
  }, [searchParams]);

  const handleUrlUpload = async () => {
    if (!importUrl.trim()) return;

    const templateId = extractTemplateId(importUrl);

    if (!templateId) {
      toast.error('Invalid template URL');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setTimeLeft('2.0 seconds left');
      setTemplateInfo(null);

      onStateChange?.({
        state: ActionState.PROCESSING,
        progress: 10,
        message: 'Starting upload...',
      });

      const res = (await postAPI(
        `template_assets/public/${templateId}/install`,
        {},
      )) as TemplateResponse;

      if (res.items && res.items.length > 0) {
        const mainItem = res.items[0];
        const fileName = mainItem.title || mainItem.name;
        const itemsCount = res.items.length;

        const fileSize =
          itemsCount > 5
            ? '2.4 MB'
            : `${Math.max(0.5, itemsCount * 0.3).toFixed(1)} MB`;

        setTemplateInfo({
          fileName: `${fileName}`,
          fileSize,
          itemsCount,
        });
      }

      await simulateProgress();

      onUpload(res, 'url');

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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box bg="gray.400" borderRadius="sm" p="md" mb="md">
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
                  <File size={22} />
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
            h="6px"
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
