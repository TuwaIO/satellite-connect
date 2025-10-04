/**
 * @file This file contains the `WalletAvatar` component for displaying a user's avatar.
 */

import { cn } from '@tuwaio/nova-core';
import makeBlockie from 'ethereum-blockies-base64';
import { useEffect, useMemo, useState } from 'react';

export type WalletAvatarProps = {
  /** The user's wallet address, used for the blockie fallback and background color. */
  address: string;
  /** An optional URL for the user's ENS avatar image. */
  ensAvatar?: string | null;
  /** Optional additional CSS classes for the container. */
  className?: string;
};

function isHex(value: unknown, { strict = true }: { strict?: boolean | undefined } = {}): value is `0x${string}` {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}
const zeroAddress = '0x0000000000000000000000000000000000000000';

/**
 * A component that displays a user's avatar.
 *
 * It prioritizes showing the provided `ensAvatar`. If unavailable or if the image fails to load,
 * it falls back to a procedurally generated "blockie" based on the user's address.
 * It also generates a unique background color from the address as a placeholder.
 */
export function WalletAvatar({ address, ensAvatar, className }: WalletAvatarProps) {
  // The source URL for the image, which can change if the ENS avatar fails to load.
  const [imageSrc, setImageSrc] = useState(ensAvatar);

  // Memoize the generated blockie to avoid re-creating it on every render.
  const blockie = useMemo(() => makeBlockie(isHex(address) ? address : zeroAddress), [address]);

  // Memoize the background color to avoid re-calculating it on every render.
  const bgColor = useMemo(() => `#${address.slice(2, 8)}`, [address]);

  // This effect resets the image source whenever the `ensAvatar` prop changes.
  useEffect(() => {
    setImageSrc(ensAvatar);
  }, [ensAvatar]);

  // If the ENS avatar URL is invalid, this handler will set the image source to the blockie fallback.
  const handleError = () => {
    setImageSrc(blockie);
  };

  return (
    <div className={cn('h-6 w-6 flex-shrink-0 rounded-full', className)} style={{ backgroundColor: bgColor }}>
      <img
        key={ensAvatar} // Force re-mount of img tag when ensAvatar changes
        className="h-full w-full rounded-full object-cover"
        src={imageSrc || blockie}
        alt={address}
        onError={handleError}
      />
    </div>
  );
}
