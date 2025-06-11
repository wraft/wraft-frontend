import React from 'react';
import { Flex, Text } from '@wraft/ui';
import { Avatar } from 'theme-ui';

/**
 * Props for the UserCard component
 * @interface UserCardProps
 * @property {string} [profilePic] - URL of the user's profile picture
 * @property {string} [name] - Name of the user
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Size of the avatar and text
 * @property {'xs' | 'sm' | 'md' | 'lg'} [gap='sm'] - Gap between avatar and text
 */
interface UserCardProps {
  profilePic?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * UserCard component displays a user's avatar and name
 * @component
 * @param {UserCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * // Basic usage
 * <UserCard profilePic="/avatar.jpg" name="John Doe" />
 *
 * @example
 * // With custom size and gap
 * <UserCard
 *   profilePic="/avatar.jpg"
 *   name="John Doe"
 *   size="lg"
 *   gap="md"
 * />
 */
const UserCard: React.FC<UserCardProps> = ({
  profilePic,
  name,
  size = 'md',
  gap = 'sm',
}) => {
  const avatarSizes = {
    sm: { width: '16px', height: '16px' },
    md: { width: '24px', height: '24px' },
    lg: { width: '32px', height: '32px' },
  };

  return (
    <Flex alignItems="center" gap={gap}>
      {profilePic && <Avatar sx={avatarSizes[size]} src={profilePic} />}
      {name && <Text fontSize="sm2">{name}</Text>}
    </Flex>
  );
};

export default UserCard;
