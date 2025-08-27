import React from 'react';
import { Flex, Text, Avatar } from '@wraft/ui';

/**
 * Props for the UserCard component
 * @interface UserCardProps
 * @property {string} [profilePic] - URL of the user's profile picture
 * @property {string} [name] - Name of the user
 * @property {'xs' | 'sm' | 'md' | 'lg'} [size='md'] - Size of the avatar and text
 * @property {'xs' | 'sm' | 'md' | 'lg'} [gap='sm'] - Gap between avatar and text
 */
interface UserCardProps {
  profilePic?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
 *
 * @example
 * // Extra small size for compact layouts
 * <UserCard
 *   profilePic="/avatar.jpg"
 *   name="John Doe"
 *   size="xs"
 * />
 */
const UserCard: React.FC<UserCardProps> = ({
  profilePic,
  name,
  size = 'md',
  gap = 'sm',
}) => {
  const textSizes = {
    xs: 'sm',
    sm: 'sm',
    md: 'sm2',
    lg: 'md',
  };

  return (
    <Flex alignItems="center" gap={gap}>
      {profilePic && <Avatar size={size} src={profilePic} alt={name} />}
      {name && <Text fontSize={textSizes[size] as any}>{name}</Text>}
    </Flex>
  );
};

export default UserCard;
