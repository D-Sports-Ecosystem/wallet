interface SendPageProps {
    isPageTransitioning: boolean;
    selectedToken: any;
    setSelectedToken: (token: any) => void;
    tokens: any[];
    sendAmount: string;
    setSendAmount: (amount: string) => void;
    recipientAddress: string;
    setRecipientAddress: (address: string) => void;
    memo: string;
    setMemo: (memo: string) => void;
}
export declare function SendPage({ isPageTransitioning, selectedToken, setSelectedToken, tokens, sendAmount, setSendAmount, recipientAddress, setRecipientAddress, memo, setMemo, }: SendPageProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=send-page.d.ts.map