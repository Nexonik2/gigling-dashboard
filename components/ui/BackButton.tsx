'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href, label = "< Back" }: BackButtonProps) {
  const router = useRouter();

  const baseStyles = "text-[var(--color-interactive)] text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer bg-transparent border border-[var(--color-interactive)]/30 px-4 py-2 rounded-lg hover:bg-[var(--color-interactive)]/10 hover:border-[var(--color-interactive)] w-max";

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={() => router.back()} className={baseStyles}>
      {label}
    </button>
  );
}