import { useEffect, useState } from 'react';
import styled from '@xstyled/emotion';
import { Box, Text, Flex } from '@wraft/ui';
import {
  CheckCircle,
  WarningCircle,
  Clock,
  Upload,
  Warning,
} from '@phosphor-icons/react';

interface ScannerTextProps {
  text: string;
  className?: string;
  scannerColor?: string;
  scannerWidth?: string;
  scanDuration?: number;
  status?: 'completed' | 'uploading' | 'pending' | 'error' | 'warning';
}

const ScannerContainer = styled(Box)`
  position: relative;
  overflow: hidden;
`;

const ScannerText = styled(Text)`
  font-size: sm2;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: gray.1100;
`;

const ScannerLight = styled(Box)<{
  $scannerColor: string;
  $scannerWidth: string;
  $scanDuration: number;
}>`
  position: absolute;
  top: 0;
  height: 100%;
  width: ${(props) => props.$scannerWidth};
  background: linear-gradient(
    to right,
    transparent 0%,
    ${(props) => props.$scannerColor} 50%,
    transparent 100%
  );
  animation: scan ${(props) => props.$scanDuration}s linear infinite;
  pointer-events: none;

  @keyframes scan {
    0% {
      left: -${(props) => props.$scannerWidth};
    }
    100% {
      left: 100%;
    }
  }
`;

const StatusIcon = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

export default function ScannerTextComponent({
  text,
  className,
  scannerColor = 'rgba(255, 255, 255, 0.8)',
  scannerWidth = '25%',
  scanDuration = 3,
  status,
}: ScannerTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusIcon = (xstatus: string) => {
    switch (xstatus) {
      case 'completed':
        return <CheckCircle size={16} color="var(--green-500)" weight="fill" />;
      case 'uploading':
        return <Upload size={16} color="blue" weight="fill" />;
      case 'pending':
        return <Clock size={16} color="red" weight="fill" />;
      case 'error':
        return <Warning size={16} color="green" weight="fill" />;
      case 'warning':
        return <WarningCircle size={16} color="red" weight="fill" />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <Flex alignItems="center">
        {status && <StatusIcon>{getStatusIcon(status)}</StatusIcon>}
        <ScannerText className={className}>{text}</ScannerText>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" gap="sm">
      <ScannerContainer>
        <ScannerText className={className}>{text}</ScannerText>
        <ScannerLight
          $scannerColor={scannerColor}
          $scannerWidth={scannerWidth}
          $scanDuration={scanDuration}
        />
      </ScannerContainer>
      {status && <StatusIcon>{getStatusIcon(status)}</StatusIcon>}
    </Flex>
  );
}
