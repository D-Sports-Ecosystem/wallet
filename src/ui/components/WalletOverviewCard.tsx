import React from "react";
import { WalletOverviewCardProps } from "../types";
import LoadingState from "../atoms/LoadingState";
import AnimatedContainer from "../atoms/AnimatedContainer";

const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({
  session,
  totalBalance,
  totalBalanceUSD,
  tokenCount,
  nftCount,
  onViewTokens,
  onViewNFTs,
  onViewInventory,
  isLoading = false,
  className = "",
  theme,
}) => {
  const cardStyles: React.CSSProperties = {
    backgroundColor: theme?.colors?.background || "#FFF",
    border: theme?.colors?.border
      ? `1px solid ${theme.colors.border}`
      : "1px solid #E5E5E7",
    borderRadius: theme?.borderRadius || "12px",
    padding: "24px",
    fontFamily: theme?.fontFamily,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const headerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  };

  const avatarStyles: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: theme?.colors?.primary || "#007AFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    fontSize: "20px",
    fontWeight: "600",
  };

  const balanceStyles: React.CSSProperties = {
    margin: "16px 0",
  };

  const primaryBalanceStyles: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "700",
    color: theme?.colors?.text || "#000",
    margin: "0 0 4px 0",
  };

  const secondaryBalanceStyles: React.CSSProperties = {
    fontSize: "16px",
    color: theme?.colors?.text ? `${theme.colors.text}80` : "#666",
    margin: "0",
  };

  const statsContainerStyles: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  };

  const statStyles: React.CSSProperties = {
    textAlign: "center",
    padding: "16px",
    backgroundColor: theme?.colors?.background
      ? `${theme.colors.background}80`
      : "#F8F9FA",
    borderRadius: theme?.borderRadius ? `${theme.borderRadius / 2}px` : "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
  };

  const statNumberStyles: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "600",
    color: theme?.colors?.primary || "#007AFF",
    margin: "0 0 4px 0",
  };

  const statLabelStyles: React.CSSProperties = {
    fontSize: "14px",
    color: theme?.colors?.text ? `${theme.colors.text}60` : "#666",
    margin: "0",
  };

  const walletAddressStyles: React.CSSProperties = {
    fontSize: "12px",
    color: theme?.colors?.text ? `${theme.colors.text}60` : "#666",
    fontFamily: "monospace",
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderUserInfo = () => {
    if (!session?.wallet && !session?.user) {
      return (
        <div style={headerStyles}>
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                color: theme?.colors?.text || "#000",
              }}
            >
              No Wallet Connected
            </h3>
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: theme?.colors?.text ? `${theme.colors.text}60` : "#666",
              }}
            >
              Connect a wallet to view your assets
            </p>
          </div>
        </div>
      );
    }

    const displayName = session?.user?.name || "Wallet User";
    const displayAvatar = session?.user?.avatar;
    const walletAddress = session?.wallet?.address;

    return (
      <div style={headerStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={avatarStyles}>
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                color: theme?.colors?.text || "#000",
              }}
            >
              {displayName}
            </h3>
            {walletAddress && (
              <p style={walletAddressStyles}>{formatAddress(walletAddress)}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!session?.wallet) return null;

    return (
      <div style={statsContainerStyles}>
        <div
          style={statStyles}
          onClick={onViewTokens}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.primary
              ? `${theme.colors.primary}10`
              : "#E3F2FD";
            e.currentTarget.style.borderColor =
              theme?.colors?.primary || "#007AFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.background
              ? `${theme.colors.background}80`
              : "#F8F9FA";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <p style={statNumberStyles}>{tokenCount || 0}</p>
          <p style={statLabelStyles}>Tokens</p>
        </div>

        <div
          style={statStyles}
          onClick={onViewNFTs}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.primary
              ? `${theme.colors.primary}10`
              : "#E3F2FD";
            e.currentTarget.style.borderColor =
              theme?.colors?.primary || "#007AFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.background
              ? `${theme.colors.background}80`
              : "#F8F9FA";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <p style={statNumberStyles}>{nftCount || 0}</p>
          <p style={statLabelStyles}>NFTs</p>
        </div>

        <div
          style={statStyles}
          onClick={onViewInventory}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.primary
              ? `${theme.colors.primary}10`
              : "#E3F2FD";
            e.currentTarget.style.borderColor =
              theme?.colors?.primary || "#007AFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme?.colors?.background
              ? `${theme.colors.background}80`
              : "#F8F9FA";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <p style={statNumberStyles}>∞</p>
          <p style={statLabelStyles}>Inventory</p>
        </div>
      </div>
    );
  };

  const renderBalance = () => {
    if (!session?.wallet) return null;

    if (isLoading) {
      return (
        <div style={balanceStyles}>
          <LoadingState variant="skeleton" size="medium" />
        </div>
      );
    }

    return (
      <div style={balanceStyles}>
        <h2 style={primaryBalanceStyles}>{totalBalance || "0.00"} ETH</h2>
        {totalBalanceUSD && (
          <p style={secondaryBalanceStyles}>${totalBalanceUSD} USD</p>
        )}
      </div>
    );
  };

  return (
    <AnimatedContainer variant="fade" isVisible={true}>
      <div className={`wallet-overview-card ${className}`} style={cardStyles}>
        {renderUserInfo()}
        {renderBalance()}
        {renderStats()}
      </div>
    </AnimatedContainer>
  );
};

export default WalletOverviewCard;
