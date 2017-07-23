interface ConnectionOptions {

}

interface IConfigSignature {
  signature_header: Buffer;
  signature: Buffer;
}

interface ICryptoKey {
  getSKI(): string;
  isSymmetric(): boolean;
  isPrivate(): boolean;
  getPublicKey(): ICryptoKey;
  toBytes(): string;
}

interface ICryptoKeyStore {

}

interface IKeyValueStore {

}

interface IIdentityFiles {
  privateKey: string;
  signedCert: string;
}

interface IIdentityPEMs {
  privateKeyPEM: string;
  signedCertPEM: string;
}

interface IUserOptions {
  username: string;
  mspid: string;
  cryptoContent: IIdentityFiles | IIdentityPEMs;
}

interface IUserConfig {
  enrollmentID: string;
  name: string
  roles?: string[];
  affiliation?: string;
}

interface ICryptoSuite {
  sign(key: ICryptoKey, digest: Buffer): Buffer;
  setCryptoKeyStore(cryptoKeyStore: ICryptoKeyStore): void;
}

interface IChannelRequest {
  name: string;
  orderer: Orderer;
  envelope?: Buffer;
  config?: Buffer;
  txId?: TransactionId;
  signatures: IConfigSignature[];
}

interface IBroadcastResponse {
  status: string;
}

interface IIdentity {

}

interface ISigningIdentity {

}

declare class User {
  constructor(config: IUserConfig);
  getName(): string;
  getRoles(): string[];
  setRoles(roles: string[]): void;
  getAffiliation(): string;
  setAffiliation(affiliation: string): void;
  getIdentity(): IIdentity;
  getSigningIdentity(): ISigningIdentity;
  setCryptoSuite(suite: ICryptoSuite): void;
  setEnrollment(privateKey: ICryptoKey, certificate: string, mspId: string): Promise<void>;
}

declare class Orderer {
  constructor(url: string, opts: ConnectionOptions);
}

declare class Channel {
  constructor(name: string, client: Client);
  addOrderer(orderer: Orderer): void;
}

declare abstract class BaseClient {
  static newCryptoSuite(): ICryptoSuite;
  static newCryptoKeyStore(obj?: { path: string }): ICryptoKeyStore;
  static newDefaultKeyValueStore(obj?: { path: string }): Promise<IKeyValueStore>;
  setCryptoSuite(suite: ICryptoSuite): void;
  getCryptoSuite(): ICryptoSuite;
}

declare class TransactionId {
  constructor(userContext: User);
  getTransactionId(): string;
}

declare class Client extends BaseClient {
  isDevMode(): boolean;
  setDevMode(mode: boolean): void;
  newOrderer(url: string, opts: ConnectionOptions): Orderer;
  newChannel(name: string): Channel;
  newTransactionID(): TransactionId;
  extractChannelConfig(envelope: Buffer): Buffer;
  createChannel(request: IChannelRequest): Promise<IBroadcastResponse>;
  createUser(opts: IUserOptions): Promise<User>;
  signChannelConfig(config: Buffer): IConfigSignature;
  setStateStore(store: IKeyValueStore): void;

}

declare module 'fabric-client' {
  export = Client;
}