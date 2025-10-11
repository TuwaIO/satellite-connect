// just for test

'use client';

import { createSolanaRPC } from '@tuwaio/orbit-solana';
import { produce } from 'immer';
import { PropsWithChildren, useMemo } from 'react';
import { createStore } from 'zustand/vanilla';

import { solanaRPCUrls } from '@/configs/appConfig';
import { PROGRAM_ID } from '@/constants';
import { Store, StoreContext } from '@/hooks/storeHook';
import { getSolanatestProgramAccounts } from '@/programs';

export function StoreProvider({ children }: PropsWithChildren) {
  const store = useMemo(() => {
    return createStore<Store>()((set) => ({
      accounts: {},
      accountsLoading: true,
      getAccounts: async () => {
        const accountsInfo = (await getSolanatestProgramAccounts(
          createSolanaRPC({ rpcUrlOrMoniker: 'devnet', rpcUrls: solanaRPCUrls }),
          PROGRAM_ID,
        )) as never as {
          address: string;
          data: { count: number };
          executable: boolean;
          exists: boolean;
          lamports: bigint;
          programAddress: string;
          space: bigint;
        }[];
        set((state) =>
          produce(state, (draft) => {
            accountsInfo.forEach((account) => {
              draft.accounts[account.address] = account.data.count;
            });
            draft.accountsLoading = false;
          }),
        );
      },
      removeAccFromStore: (address) => {
        set((state) =>
          produce(state, (draft) => {
            delete draft.accounts[address];
          }),
        );
      },
    }));
  }, []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
