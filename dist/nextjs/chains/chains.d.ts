export interface Chain {
    name: string;
    chainId: number;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}
declare const chainNames: readonly ["ethereum", "polygon", "bsc", "arbitrum", "optimism", "avalanche", "goerli", "mumbai", "bscTestnet"];
export type ChainName = typeof chainNames[number];
export declare const chains: Record<ChainName, Chain>;
export {};
//# sourceMappingURL=chains.d.ts.map