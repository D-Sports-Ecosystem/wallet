import React from 'react';
import { TokenBalance } from '../types';
interface ContextDrivenTokenTabProps {
    className?: string;
    onTokenClick?: (token: TokenBalance) => void;
    onSend?: (token: TokenBalance) => void;
    onReceive?: (token: TokenBalance) => void;
    onSwap?: (token: TokenBalance) => void;
}
declare const ContextDrivenTokenTab: React.FC<ContextDrivenTokenTabProps>;
export default ContextDrivenTokenTab;
//# sourceMappingURL=ContextDrivenTokenTab.d.ts.map