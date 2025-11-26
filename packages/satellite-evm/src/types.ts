import { BaseConnector } from '@tuwaio/satellite-core';
import { Connector, CreateConnectorFn } from '@wagmi/core';

/** EVM-specific connector type */
export type ConnectorEVM = Connector<CreateConnectorFn>;

/**
 * Extended wallet interface for EVM-specific properties
 */
export interface EVMConnection extends BaseConnector {
  /** Connected Wallet Standard account */
  connector?: ConnectorEVM;
}
