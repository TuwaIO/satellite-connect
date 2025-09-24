/**
 * @file This file contains a utility to ensure the user's wallet is connected to the correct chain before proceeding with a transaction.
 */

import { Config, getAccount, switchChain } from '@wagmi/core';

/**
 * Checks if the user's wallet is connected to the specified chain. If not, it prompts
 * the user to switch to the correct chain.
 *
 * This function is a crucial prerequisite for any action that requires a specific network.
 *
 * @param {number} chainId - The ID of the desired blockchain network.
 * @param {Config} config - The wagmi configuration object.
 * @returns {Promise<void>} A promise that resolves when the wallet is on the correct chain.
 * It rejects if the user cancels the switch or if another error occurs.
 *
 * @throws {Error} Throws a specific error if the user rejects the chain switch or if the switch fails for other reasons.
 */
export async function checkAndSwitchChain(chainId: number, config: Config): Promise<void> {
  const { connector, chainId: activeChainId } = getAccount(config);

  // Proceed only if a wallet is connected and it is on a different chain than required.
  if (connector && activeChainId !== chainId) {
    try {
      // Pause execution and wait for the user to confirm the chain switch in their wallet.
      await switchChain(config, { chainId });
    } catch (error) {
      if ((error as any).cause?.name === 'UserRejectedRequestError') {
        throw new Error('User rejected the request to switch network.');
      }
      console.error('Failed to switch network:', error);
      throw new Error('An error occurred while switching the network.');
    }
  }
}
