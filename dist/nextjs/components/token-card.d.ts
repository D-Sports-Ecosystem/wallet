interface TokenCardProps {
    token: any;
    index: number;
    isContentReady: boolean;
    expandedToken: string | null;
    hoveredToken: string | null;
    setHoveredToken: (token: string | null) => void;
    toggleTokenExpansion: (tokenSymbol: string) => void;
}
export declare function TokenCard({ token, index, isContentReady, expandedToken, hoveredToken, setHoveredToken, toggleTokenExpansion, }: TokenCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=token-card.d.ts.map