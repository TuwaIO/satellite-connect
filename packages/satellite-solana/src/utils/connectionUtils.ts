import type {
  StandardConnectFeature,
  StandardConnectMethod,
  StandardDisconnectFeature,
} from '@wallet-standard/features';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/features';
import { getWalletFeature, type UiWallet, type UiWalletAccount } from '@wallet-standard/ui';
import {
  getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletAccountForStandardWalletAccount,
  getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getWalletForHandle,
} from '@wallet-standard/ui-registry';

export async function connect(
  uiWallet: UiWallet,
  input?: Omit<NonNullable<Parameters<StandardConnectMethod>[0]>, 'silent'>,
): Promise<readonly UiWalletAccount[]> {
  const connectFeature = getWalletFeature(uiWallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect];
  const { accounts } = await connectFeature.connect(input);
  return accounts.map((account) =>
    getOrCreateUiWalletAccountForStandardWalletAccount(getWalletForHandle(uiWallet), account),
  );
}

export async function disconnect(uiWallet: UiWallet): Promise<void> {
  const disconnectFeature = getWalletFeature(uiWallet, StandardDisconnect) as
    | StandardDisconnectFeature[typeof StandardDisconnect]
    | undefined;
  await disconnectFeature?.disconnect();
}
