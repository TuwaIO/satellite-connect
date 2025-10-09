import { cn } from '@tuwaio/nova-core';
import { standardButtonClasses } from '@tuwaio/nova-core';
import React from 'react';

type ButtonAction = string | (() => void);

interface DisclaimerProps {
  title: string;
  description: string;
  learnMoreAction: ButtonAction;
  listAction?: ButtonAction;
  className?: string;
}

const isLink = (action: ButtonAction): action is string => typeof action === 'string';

export function Disclaimer({ title, description, learnMoreAction, listAction, className }: DisclaimerProps) {
  const LinkButton: React.FC<{ action: string; children: React.ReactNode }> = ({ action, children }) => (
    <a href={action} target="_blank" rel="noopener noreferrer" className={standardButtonClasses}>
      {children}
    </a>
  );

  const ActionButton: React.FC<{ action: () => void; children: React.ReactNode }> = ({ action, children }) => (
    <button type="button" onClick={action} className={standardButtonClasses}>
      {children}
    </button>
  );

  return (
    <div
      className={cn(
        'p-2 rounded-xl border border-[var(--tuwa-border-primary)] flex flex-col gap-2 sm:p-4 sm:gap-4',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[var(--tuwa-text-primary)]">{title}</h3>
        <p className="text-sm text-[var(--tuwa-text-secondary)]">{description}</p>
      </div>

      <div className="flex gap-3 justify-end">
        {isLink(learnMoreAction) ? (
          <LinkButton action={learnMoreAction}>Learn More</LinkButton>
        ) : (
          <ActionButton action={learnMoreAction}>Learn More</ActionButton>
        )}
        {listAction && (
          <>
            {isLink(listAction) ? (
              <LinkButton action={listAction}>List of networks</LinkButton>
            ) : (
              <ActionButton action={listAction}>List of networks</ActionButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
