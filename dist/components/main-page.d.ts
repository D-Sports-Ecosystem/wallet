interface MainPageProps {
    isContentReady: boolean;
    isPageTransitioning: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tokens: any[];
    expandedToken: string | null;
    hoveredToken: string | null;
    setHoveredToken: (token: string | null) => void;
    toggleTokenExpansion: (tokenSymbol: string) => void;
    handleSend: () => void;
    handleReceive: () => void;
    sendButtonPressed: boolean;
    receiveButtonPressed: boolean;
}
export declare function MainPage({ isContentReady, isPageTransitioning, activeTab, setActiveTab, tokens, expandedToken, hoveredToken, setHoveredToken, toggleTokenExpansion, handleSend, handleReceive, sendButtonPressed, receiveButtonPressed, }: MainPageProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=main-page.d.ts.map