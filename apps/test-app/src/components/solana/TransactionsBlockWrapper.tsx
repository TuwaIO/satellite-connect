'use client';

import { textCenterEllipsis } from '@tuwaio/nova-core';
import { HashLink } from '@tuwaio/nova-transactions';
import { selectAdapterByKey, TransactionAdapter } from '@tuwaio/pulsar-core';
import { SolanaWallet } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { address } from 'gill';
import { ReactNode, useEffect } from 'react';

import { TxActionButtonClose } from '@/components/solana/TxActionButtonClose';
import { TxActionButtonDecrement } from '@/components/solana/TxActionButtonDecrement';
import { TxActionButtonIncrement } from '@/components/solana/TxActionButtonIncrement';
import { TxActionButtonInitialize } from '@/components/solana/TxActionButtonInitialize';
import { PROGRAM_ID } from '@/constants';
import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';

export const TransactionsBlockWrapper = ({
  connectWidget,
  toggleButton,
}: {
  connectWidget: ReactNode;
  toggleButton: ReactNode;
}) => {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const accounts = useStore((state) => state.accounts);
  const getAccounts = useStore((state) => state.getAccounts);
  const accountsLoading = useStore((state) => state.accountsLoading);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  const foundAdapter = selectAdapterByKey({
    adapterKey: TransactionAdapter.SOLANA,
    adapter: getAdapter(),
  });

  const activeWalletSolana = activeWallet as SolanaWallet;

  useEffect(() => {
    if (!activeWallet) return;
    getAccounts(activeWallet);
  }, [activeWallet]);

  const openSolscan = () => {
    window.open(foundAdapter?.getExplorerUrl(`/account/${PROGRAM_ID}`), '_blank', 'noopener,noreferrer');
  };

  const sortedAccounts = Object.entries(accounts).sort(([, countA], [, countB]) => countB - countA);

  return (
    <div className="p-4 relative">
      <div className="m-auto w-full max-w-md h-auto min-h-[680px] bg-[var(--tuwa-bg-primary)] rounded-2xl shadow-2xl border border-[var(--tuwa-border-primary)] overflow-hidden flex flex-col relative">
        {toggleButton}
        <header className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] p-6 pt-12 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h1 className="text-2xl font-bold text-[var(--tuwa-text-on-accent)] mb-1 leading-tight">Solana Demo</h1>
            <p className="text-blue-100 text-sm leading-tight">Transaction Tracking Example</p>
          </div>

          <div className="flex items-center justify-end min-w-[180px] mt-2.5">
            <div className="transform transition-all duration-200 ease-in-out">{connectWidget}</div>
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8">
          <section className="text-center">
            <h2 className="text-xl font-semibold text-[var(--tuwa-text-primary)] mb-2 leading-tight">
              Solana Program Interaction
            </h2>
            <p className="text-[var(--tuwa-text-secondary)] text-sm leading-tight">
              Test transaction tracking with a simple counter program
            </p>
          </section>

          <hr className="border-t border-[var(--tuwa-border-primary)]" />

          <article className="space-y-6 flex-1">
            <div className="bg-[var(--tuwa-bg-secondary)] rounded-xl p-4 border border-[var(--tuwa-border-secondary)] flex flex-col justify-center shadow-lg">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--tuwa-info-bg)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--tuwa-text-accent)] font-bold text-lg">#</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-[var(--tuwa-text-primary)] leading-tight">Program</h3>
                    <p className="text-xs text-[var(--tuwa-text-tertiary)] leading-tight">Solana Devnet</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-[var(--tuwa-text-secondary)] leading-tight">Account</div>
                  <button
                    onClick={openSolscan}
                    className="text-xs font-mono text-[var(--tuwa-text-accent)] hover:text-[var(--tuwa-button-gradient-from-hover)] leading-tight cursor-pointer transition-colors duration-200 underline hover:no-underline"
                  >
                    {textCenterEllipsis(PROGRAM_ID.toString(), 6, 6)}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activeWalletSolana?.connectedAccount ? (
                <div className="h-14">
                  <TxActionButtonInitialize activeWallet={activeWalletSolana} />
                </div>
              ) : (
                <p className="text-center text-sm text-[var(--tuwa-text-secondary)]">
                  Connect wallet to initialize transaction.
                </p>
              )}
            </div>

            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg text-[var(--tuwa-text-primary)] font-bold">Counters:</h3>
                <h3 className="text-lg text-[var(--tuwa-text-primary)] font-bold">
                  {accountsLoading ? (
                    <div className="flex items-center space-x-2 text-[var(--tuwa-text-secondary)]">
                      <div className="w-4 h-4 border-2 border-t-2 border-[var(--tuwa-border-primary)] rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    Object.values(accounts).length - 1
                  )}
                </h3>
              </div>

              <div className="grid gap-4 overflow-y-auto max-h-[320px] p-2 -m-2">
                {accountsLoading ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-t-4 border-[var(--tuwa-border-primary)] rounded-full animate-spin mb-4"></div>
                    <p className="text-lg text-[var(--tuwa-text-secondary)]">Fetching accounts...</p>
                  </div>
                ) : (
                  sortedAccounts.map(([key, value]) => (
                    <div
                      className="bg-[var(--tuwa-bg-secondary)] rounded-xl p-4 border border-[var(--tuwa-border-secondary)] min-h-[100px] flex flex-col justify-center"
                      key={key}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-[var(--tuwa-text-primary)] leading-tight">
                              Counter Program
                            </h3>
                            <p className="text-xs text-[var(--tuwa-text-tertiary)] leading-tight">Solana Devnet</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-sm text-[var(--tuwa-text-secondary)] leading-tight">Account</div>
                          <HashLink hash={key} explorerUrl={foundAdapter?.getExplorerUrl(`/address/${key}`)} />
                        </div>
                      </div>

                      <div className="flex items-center justify-center pt-2 border-t border-[var(--tuwa-border-secondary)]">
                        <div className="text-center">
                          <div className="text-xs text-[var(--tuwa-text-tertiary)] mb-1">Current Value</div>
                          <div className="text-2xl font-bold text-[var(--tuwa-text-accent)]">{value}</div>
                        </div>
                      </div>

                      {activeWalletSolana?.connectedAccount && (
                        <>
                          <hr className="border-t border-[var(--tuwa-border-primary)] my-4" />
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <TxActionButtonIncrement
                                activeWallet={activeWalletSolana}
                                currentCount={value}
                                solanatest={address(key)}
                              />
                              <TxActionButtonDecrement
                                activeWallet={activeWalletSolana}
                                currentCount={value}
                                solanatest={address(key)}
                              />
                            </div>
                            <TxActionButtonClose activeWallet={activeWalletSolana} solanatest={address(key)} />
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </article>
        </main>

        <footer className="bg-[var(--tuwa-bg-secondary)] px-8 py-4 border-t border-[var(--tuwa-border-primary)] flex-shrink-0 h-16 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs text-[var(--tuwa-text-tertiary)]">
            <span className="leading-none">Powered by</span>
            <a href="https://github.com/TuwaIO" target="_blank">
              <span className="font-semibold text-[var(--tuwa-text-accent)] leading-none">TUWA</span>
            </a>
            <span className="leading-none">•</span>
            <span className="leading-none">Web3 Transaction Tracking</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
