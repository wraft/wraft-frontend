import { useState } from 'react';
import toast from 'react-hot-toast';

import { postAPI } from 'utils/models';

interface Template {
  id: string;
  name: string;
  description: string;
  file_name: string;
  file_size: string;
  thumbnail_url: string;
  zip_file_url: string;
}

interface UseTemplateInstallationOptions {
  onInstallSuccess?: (template: Template) => void;
  onInstallError?: (error: any, template: Template) => void;
}

export const useTemplateInstallation = (
  options: UseTemplateInstallationOptions = {},
) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToInstall, setTemplateToInstall] = useState<Template | null>(
    null,
  );

  const handleTemplateSelect = (template: Template) => {
    setTemplateToInstall(template);
    setIsModalOpen(true);
  };

  const handleInstall = async () => {
    if (!templateToInstall) return;

    try {
      setIsInstalling(true);
      setInstallProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setInstallProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Make the API call
      await postAPI(
        `template_assets/public/${templateToInstall.id}/install`,
        {},
      );

      clearInterval(progressInterval);
      setInstallProgress(100);

      // Show success message
      toast.success(
        `Template "${templateToInstall.name}" installed successfully!`,
        {
          duration: 4000,
          position: 'top-right',
        },
      );

      // Trigger success callback
      options.onInstallSuccess?.(templateToInstall);

      // Close modal and reset state
      setTimeout(() => {
        handleModalClose();
        setIsInstalling(false);
        setInstallProgress(0);
      }, 1000);
    } catch (error: any) {
      console.error('Failed to install template:', error);

      // Show error message
      toast.error(
        error?.message ||
          `Failed to install template "${templateToInstall.name}". Please try again.`,
        {
          duration: 6000,
          position: 'top-right',
        },
      );

      // Trigger error callback
      options.onInstallError?.(error, templateToInstall);

      setIsInstalling(false);
      setInstallProgress(0);
    }
  };

  const handleModalClose = () => {
    if (!isInstalling) {
      setIsModalOpen(false);
      setTemplateToInstall(null);
      setInstallProgress(0);
    }
  };

  return {
    // State
    isInstalling,
    installProgress,
    isModalOpen,
    templateToInstall,

    // Actions
    handleTemplateSelect,
    handleInstall,
    handleModalClose,
  };
};
