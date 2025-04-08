"use client";
import React, { useState, useEffect } from 'react';
import './ClaimCoin.css';

// Types
type ClaimCoinProps = {
  userAddress: string;
};

type TabType = 'claim' | 'tasks';

type SocialPlatform = 'telegram' | 'twitter' | 'discord' | 'instagram';

// Social platform configuration
const socialPlatforms: Record<SocialPlatform, {
  name: string;
  color: string;
  url: string;
  icon: React.ReactNode;
}> = {
  telegram: {
    name: 'Telegram',
    color: '#0088cc',
    url: 'https://t.me/AstraCoinOfficial',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
      </svg>
    )
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    url: 'https://twitter.com/AstraCoinOfficial',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  discord: {
    name: 'Discord',
    color: '#7289DA',
    url: 'https://discord.com/invite/AstraCoin',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    )
  },
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    url: 'https://instagram.com/AstraCoinOfficial',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
};

export function ClaimCoin({ userAddress }: ClaimCoinProps) {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('claim');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [socialFollowed, setSocialFollowed] = useState<Record<SocialPlatform, boolean>>({
    telegram: false,
    twitter: false,
    discord: false,
    instagram: false
  });
  const [balance, setBalance] = useState(5000); // User's ASTRA balance

  // Load social platform follow status
  useEffect(() => {
    const loadSocialStatus = () => {
      const platforms: SocialPlatform[] = ['telegram', 'twitter', 'discord', 'instagram'];
      const status: Record<SocialPlatform, boolean> = {
        telegram: false,
        twitter: false,
        discord: false,
        instagram: false
      };

      platforms.forEach(platform => {
        status[platform] = localStorage.getItem(`${platform}_followed_${userAddress}`) === 'true';
      });

      setSocialFollowed(status);
    };

    loadSocialStatus();
  }, [userAddress]);

  // Check claim status and set up countdown
  useEffect(() => {
    const checkClaimStatus = () => {
      const lastClaimTime = localStorage.getItem(`lastClaim_${userAddress}`);

      if (lastClaimTime) {
        const lastClaim = new Date(lastClaimTime);
        const now = new Date();
        const nextClaimTime = new Date(lastClaim);
        nextClaimTime.setHours(nextClaimTime.getHours() + 24);

        if (now < nextClaimTime) {
          setHasClaimed(true);

          const timeLeft = nextClaimTime.getTime() - now.getTime();
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

          setCountdown({ hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft });
          return true;
        } else {
          setHasClaimed(false);
          setCountdown(null);
          return false;
        }
      }
      return false;
    };

    const isClaimActive = checkClaimStatus();
    const intervalId = setInterval(() => {
      if (countdown) {
        if (countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) {
          setHasClaimed(false);
          setCountdown(null);
          clearInterval(intervalId);
        } else {
          let newHours = countdown.hours;
          let newMinutes = countdown.minutes;
          let newSeconds = countdown.seconds - 1;

          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }

          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }

          setCountdown({ hours: newHours, minutes: newMinutes, seconds: newSeconds });
        }
      } else if (isClaimActive) {
        checkClaimStatus();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [userAddress, countdown]);

  // Handlers
  const handleSocialFollow = (platform: SocialPlatform) => {
    // Open respective social platform in a new tab
    window.open(socialPlatforms[platform].url, '_blank');

    // Mark as followed
    setSocialFollowed(prev => ({
      ...prev,
      [platform]: true
    }));

    // Save follow status in localStorage
    localStorage.setItem(`${platform}_followed_${userAddress}`, 'true');
  };

  const handleClaim = async () => {
    try {
      // Check if user has followed all required social platforms
      if (!allSocialFollowed) {
        setError('Please follow our Telegram, Twitter, Discord, and Instagram accounts to claim your rewards');
        return;
      }

      setIsClaiming(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update local storage with claim time
      localStorage.setItem(`lastClaim_${userAddress}`, new Date().toISOString());

      // Update balance
      setBalance(prevBalance => prevBalance + 1000);

      // Show success screen
      setClaimSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setHasClaimed(true);
        setClaimSuccess(false);
        setCountdown({ hours: 23, minutes: 59, seconds: 59 });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim coins');
    } finally {
      setIsClaiming(false);
    }
  };

  // Computed properties
  const allSocialFollowed = Object.values(socialFollowed).every(Boolean);

  // Component rendering functions
  const renderSocialButtons = (platform: SocialPlatform) => {
    const { name, color, icon } = socialPlatforms[platform];
    const isFollowed = socialFollowed[platform];

    return (
      <div className="social-button" key={platform}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="social-icon" style={{ backgroundColor: color }}>
            {icon}
          </div>
          <span>{name}</span>
        </div>
        <button
          onClick={() => handleSocialFollow(platform)}
          disabled={isFollowed}
          className={`follow-btn ${isFollowed ? 'followed-btn' : ''}`}
          aria-label={`Follow ${name}`}
        >
          {isFollowed ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Followed
            </>
          ) : 'Follow'}
        </button>
      </div>
    );
  };

  const renderSocialBadge = (platform: SocialPlatform) => {
    const { name, color, icon } = socialPlatforms[platform];
    const isComplete = socialFollowed[platform];

    return (
      <div
        key={platform}
        className={`social-badge ${isComplete ? 'completed' : ''}`}
        onClick={() => !isComplete && handleSocialFollow(platform)}
        style={{ cursor: isComplete ? 'default' : 'pointer' }}
      >
        <div className="badge-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="badge-label">{name}</div>

        {isComplete && (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
    );
  };

  // Success screen component
  if (claimSuccess) {
    return (
      <div className="success-container">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#4CAF50" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3>Claim Successful!</h3>
        <p style={{ color: 'white', marginBottom: '15px' }}>1,000 ASTRA has been added to your wallet.</p>
        <div className="reward-amount" style={{
          background: 'white',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2rem'
        }}>
          {(balance).toLocaleString()} ASTRA
        </div>
      </div>
    );
  }

  // Main component
  return (
    <div className="claim-coin-container">
      {/* Daily Claim Header */}
      <div className="astra-header">
        <div className="astra-daily-badge">Daily Astra Claim</div>
        <div className="astra-amount-display">
          <div className="astra-coin-icon">$</div>
          <span>5,000 ASTRA</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button
          onClick={() => setActiveTab('claim')}
          className={`tab-button ${activeTab === 'claim' ? 'active' : ''}`}
          aria-label="View Claim Tab"
        >
          Claim Tokens
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          aria-label="View Tasks Tab"
        >
          Tasks
        </button>
      </div>

      {/* Claim Tab Content */}
      {activeTab === 'claim' && (
        <div className="claim-section">
          {/* Reward Card */}
          <div className="reward-card">
            <h2>Daily Astra Claim</h2>
            <p>Claim your daily rewards and earn Astra tokens</p>
            
            <div className="reward-amount">
              <span>1,000 ASTRA</span>
            </div>

            <div className="claim-status">
              <span className={hasClaimed ? 'claimed' : 'available'}>
                {hasClaimed ? 'Claimed' : 'Available'}
              </span>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            {hasClaimed ? (
              <>
                <button className="already-claimed-btn" disabled>
                  Already Claimed
                </button>
                {countdown && (
                  <div className="countdown-container" aria-label="Time until next claim">
                    <div className="countdown-item">
                      <div className="countdown-value">{countdown.hours.toString().padStart(2, '0')}</div>
                      <div className="countdown-label">Hours</div>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-value">{countdown.minutes.toString().padStart(2, '0')}</div>
                      <div className="countdown-label">Minutes</div>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-value">{countdown.seconds.toString().padStart(2, '0')}</div>
                      <div className="countdown-label">Seconds</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleClaim}
                disabled={isClaiming || !allSocialFollowed}
                className="claim-button"
                aria-label="Claim rewards"
              >
                {isClaiming ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : !allSocialFollowed ? (
                  'Follow All Channels to Claim'
                ) : (
                  'Claim Tokens'
                )}
              </button>
            )}
          </div>

          {/* Follow Card */}
          <div className="follow-card">
            <h2>Follow Requirements</h2>
            <p>Follow our official channels to claim</p>

            <div className="social-grid">
              {Object.keys(socialPlatforms).map((platform) =>
                renderSocialButtons(platform as SocialPlatform)
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab Content */}
      {activeTab === 'tasks' && (
        <div className="tasks-container">
          <div className="task-card">
            <div className="task-status">
              <h3>Social Media Status</h3>
              <div className="task-badge">
                {Object.values(socialFollowed).filter(Boolean).length} / 4 completed
              </div>
            </div>

            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Object.values(socialFollowed).filter(Boolean).length / 4 * 100}
            >
              <div
                className="progress-fill"
                style={{ width: `${Object.values(socialFollowed).filter(Boolean).length / 4 * 100}%` }}
              />
            </div>

            <div className="social-grid-tasks">
              {Object.keys(socialPlatforms).map((platform) =>
                renderSocialBadge(platform as SocialPlatform)
              )}
            </div>
          </div>

          <div className="task-card">
            <h3>Follow Benefits</h3>

            <div className="benefit-list">
              <div className="benefit-item">
                <div className="benefit-icon" style={{ backgroundColor: '#e3f2fd' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1976D2" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4>Stay Updated</h4>
                  <p>Get the latest news and updates about AstraCoin</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon" style={{ backgroundColor: '#f3e5f5' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9C27B0" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4>Exclusive Content</h4>
                  <p>Access to exclusive content and announcements</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon" style={{ backgroundColor: '#e8f5e9' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#4CAF50" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4>Bonus Rewards</h4>
                  <p>Unlock bonus rewards and airdrops</p>
                </div>
              </div>
            </div>
          </div>

          <div className="coming-soon-section">
            <h3 style={{ marginBottom: '15px' }}>Coming Soon</h3>

            <div className="coming-soon-item">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6e8efb" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Global Staking</span>
              </div>
              <span className="coming-soon-badge">Soon</span>
            </div>

            <div className="coming-soon-item">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#a777e3" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>NFT Rewards</span>
              </div>
              <span className="coming-soon-badge">Soon</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}