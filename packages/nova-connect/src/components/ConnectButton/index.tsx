import { NovaConnectProviderProps } from '../../hooks/useNovaConnect';
import { NovaConnectProvider } from '../../providers';
import { ConnectButton as CB, ConnectButtonProps } from './ConnectButton';

export { ConnectButtonProps } from './ConnectButton';

export function ConnectButton({
  store,
  labels,
  ...props
}: Pick<NovaConnectProviderProps, 'labels'> & ConnectButtonProps) {
  return (
    <NovaConnectProvider store={store} labels={labels}>
      <CB store={store} {...props} />
    </NovaConnectProvider>
  );
}
