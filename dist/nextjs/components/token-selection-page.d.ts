interface TokenSelectionPageProps {
    isPageTransitioning: boolean;
    isContentReady: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    availableTokens: any[];
    handleTokenSelect: (token: any) => void;
}
export declare function TokenSelectionPage({ isPageTransitioning, isContentReady, searchQuery, setSearchQuery, availableTokens, handleTokenSelect, }: TokenSelectionPageProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=token-selection-page.d.ts.map