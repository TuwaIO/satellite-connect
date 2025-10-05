import { Connector, CreateConnectorFn } from '@wagmi/core';

/** EVM-specific connector type */
export type ConnectorEVM = Connector<CreateConnectorFn>;
