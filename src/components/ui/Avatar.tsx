import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-full bg-indigo-100 ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : name ? (
        <span className="font-medium text-indigo-800">
          {getInitials(name)}
        </span>
      ) : (
        <span className="font-medium text-indigo-800">
          ?
        </span>
      )}
    </div>
  );
};

interface AvatarGroupProps {
  avatars: {
    src?: string;
    name?: string;
    alt?: string;
  }[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 3,
  size = 'md',
  className = '',
}) => {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayed.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt || `Avatar ${index + 1}`}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-full bg-gray-200 border-2 border-white ${
            size === 'xs' ? 'w-6 h-6 text-xs' :
            size === 'sm' ? 'w-8 h-8 text-xs' :
            size === 'md' ? 'w-10 h-10 text-sm' :
            size === 'lg' ? 'w-12 h-12 text-base' :
            'w-16 h-16 text-lg'
          }`}
        >
          <span className="font-medium text-gray-600">+{remaining}</span>
        </div>
      )}
    </div>
  );
};