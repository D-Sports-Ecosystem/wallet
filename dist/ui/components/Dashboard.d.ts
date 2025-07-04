import React from 'react';
import { DashboardProps } from '../types';
/**
 * Dashboard - The main wallet dashboard component.
 *
 * This component provides a comprehensive interface for managing wallet operations,
 * viewing assets (tokens, NFTs, inventory), and handling wallet creation/import flows.
 * It supports theming, data fetching, and various wallet operations.
 *
 * @example
 * ```tsx
 * import { Dashboard } from '@d-sports/wallet';
 *
 * function App() {
 *   return (
 *     <Dashboard
 *       session={userSession}
 *       onCreateWallet={handleCreateWallet}
 *       fetchTokens={fetchTokensFromAPI}
 *       fetchNFTs={fetchNFTsFromAPI}
 *       theme={customTheme}
 *     />
 *   );
 * }
 * ```
 *
 * @param props - Configuration props for the dashboard
 * @returns A complete wallet dashboard interface
 */
declare const Dashboard: React.FC<DashboardProps>;
export default Dashboard;
//# sourceMappingURL=Dashboard.d.ts.map