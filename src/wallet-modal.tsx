"use client";
import React from "react";
import { useState, useEffect } from "react";

import { X, ArrowLeft } from "lucide-react";
import Lenis from "@studio-freight/lenis";

import { Button } from "./components/ui/button";
import { MainPage } from "./components/main-page";
import { TokenSelectionPage } from "./components/token-selection-page";
import { SendPage } from "./components/send-page";
import { ReceivePage } from "./components/receive-page";
import { LoadingContent } from "./components/loading-content";
// Text component is not used in this file
import { availableTokens, tokens } from "../data/token-data";

type PageType = "main" | "token-selection" | "send" | "receive";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [activeTab, setActiveTab] = React.useState("tokens");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isContentReady, setIsContentReady] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<PageType>("main");
  const [previousPage, setPreviousPage] = React.useState<PageType>("main");
  const [isPageTransitioning, setIsPageTransitioning] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState(tokens[1]); // Default to ETH
  const [selectedReceiveToken, setSelectedReceiveToken] = React.useState<
    (typeof availableTokens)[0] | null
  >(null);
  const [sendAmount, setSendAmount] = React.useState("");
  const [recipientAddress, setRecipientAddress] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [expandedToken, setExpandedToken] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [receiveButtonPressed, setReceiveButtonPressed] = React.useState(false);
  const [sendButtonPressed, setSendButtonPressed] = React.useState(false);
  const [hoveredToken, setHoveredToken] = React.useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const lenisRef = React.useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (isOpen && scrollContainerRef.current && isContentReady) {
      lenisRef.current = new Lenis({
        wrapper: scrollContainerRef.current,
        content: scrollContainerRef.current.firstElementChild as HTMLElement,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return () => {
        lenisRef.current?.destroy();
      };
    }
  }, [isOpen, isContentReady]);

  // Handle modal open/close animations with proper delays
  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentPage("main");
      setPreviousPage("main");
      setIsPageTransitioning(false);
      setExpandedToken(null);
      setSearchQuery("");
      setSelectedReceiveToken(null);
      setReceiveButtonPressed(false);
      setSendButtonPressed(false);
      setHoveredToken(null);
      setCopiedAddress(false);

      const contentTimer = setTimeout(() => {
        setIsContentReady(true);
      }, 150);

      return () => clearTimeout(contentTimer);
    } else {
      setIsContentReady(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setCurrentPage("main");
        setPreviousPage("main");
        setIsPageTransitioning(false);
        setExpandedToken(null);
        setSearchQuery("");
        setSelectedReceiveToken(null);
        setReceiveButtonPressed(false);
        setSendButtonPressed(false);
        setHoveredToken(null);
        setCopiedAddress(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handlePageTransition = (newPage: PageType) => {
    setIsPageTransitioning(true);
    setPreviousPage(currentPage);

    setTimeout(() => {
      setCurrentPage(newPage);
      setTimeout(() => {
        setIsPageTransitioning(false);
      }, 50);
    }, 200);
  };

  const handleClose = () => {
    setCurrentPage("main");
    setExpandedToken(null);
    setSearchQuery("");
    setReceiveButtonPressed(false);
    setSendButtonPressed(false);
    onClose();
  };

  const handleBack = () => {
    if (currentPage === "receive") {
      handlePageTransition("token-selection");
    } else {
      handlePageTransition("main");
    }
  };

  const handleSend = () => {
    setSendButtonPressed(true);
    setTimeout(() => {
      handlePageTransition("send");
      setSendButtonPressed(false);
    }, 200);
  };

  const handleReceive = () => {
    setReceiveButtonPressed(true);
    setTimeout(() => {
      handlePageTransition("token-selection");
      setReceiveButtonPressed(false);
    }, 200);
  };

  const handleTokenSelect = (token: (typeof availableTokens)[0]) => {
    setSelectedReceiveToken(token);
    handlePageTransition("receive");
  };

  const copyAddress = () => {
    if (selectedReceiveToken) {
      navigator.clipboard.writeText(selectedReceiveToken.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const toggleTokenExpansion = (tokenSymbol: string) => {
    setExpandedToken(expandedToken === tokenSymbol ? null : tokenSymbol);

    setTimeout(() => {
      if (lenisRef.current && expandedToken !== tokenSymbol) {
        const tokenElement = document.getElementById(`token-${tokenSymbol}`);
        if (tokenElement) {
          lenisRef.current.scrollTo(tokenElement, { offset: -20 });
        }
      }
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal Content */}
        <div
          className={`relative w-full max-w-md mx-4 max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0 rotate-0"
              : "scale-90 opacity-0 translate-y-8 rotate-1"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-between border-b border-gray-700 shadow-xl">
            <div className="flex items-center gap-4">
              {currentPage !== "main" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 hover:-translate-x-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white font-bold"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent tracking-tight">
                    D-Sports Wallet
                  </h1>
                  <p className="text-xs text-gray-400 font-medium tracking-wide transition-colors duration-300">
                    {currentPage === "main" && "Portfolio Overview"}
                    {currentPage === "token-selection" && "Select Token"}
                    {currentPage === "send" && "Send Transaction"}
                    {currentPage === "receive" && "Receive Funds"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-10 w-10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 hover:rotate-90"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollContainerRef}
            className="bg-gradient-to-b from-white to-gray-50 max-h-[calc(90vh-64px)] overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {!isContentReady ? (
              <LoadingContent />
            ) : (
              <>
                {currentPage === "main" && (
                  <MainPage
                    isContentReady={isContentReady}
                    isPageTransitioning={isPageTransitioning}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tokens={tokens}
                    expandedToken={expandedToken}
                    hoveredToken={hoveredToken}
                    setHoveredToken={setHoveredToken}
                    toggleTokenExpansion={toggleTokenExpansion}
                    handleSend={handleSend}
                    handleReceive={handleReceive}
                    sendButtonPressed={sendButtonPressed}
                    receiveButtonPressed={receiveButtonPressed}
                  />
                )}
                {currentPage === "token-selection" && (
                  <TokenSelectionPage
                    isPageTransitioning={isPageTransitioning}
                    isContentReady={isContentReady}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    availableTokens={availableTokens}
                    handleTokenSelect={handleTokenSelect}
                  />
                )}
                {currentPage === "send" && (
                  <SendPage
                    isPageTransitioning={isPageTransitioning}
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                    tokens={tokens}
                    sendAmount={sendAmount}
                    setSendAmount={setSendAmount}
                    recipientAddress={recipientAddress}
                    setRecipientAddress={setRecipientAddress}
                    memo={memo}
                    setMemo={setMemo}
                  />
                )}
                {currentPage === "receive" && (
                  <ReceivePage
                    isPageTransitioning={isPageTransitioning}
                    selectedReceiveToken={selectedReceiveToken}
                    copyAddress={copyAddress}
                    copiedAddress={copiedAddress}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
          Web3 Wallet Demo
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 hover:shadow-xl shadow-lg text-white font-semibold px-8 py-3 rounded-xl"
        >
          Open Wallet
        </Button>
      </div>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
