import { useState, useEffect } from 'react';

const STORAGE_KEY = 'meleji-daily-message-data';

interface DailyMessageData {
  count: number;
  lastResetDate: string;
}

const DAILY_MESSAGE_LIMIT = 25;
const FREE_MESSAGE_LIMIT = 25; // Free users get 25 messages per day

export function useDailyMessageLimit() {
  const [messageData, setMessageData] = useState<DailyMessageData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Reset count if it's a new day
        if (data.lastResetDate !== today) {
          const resetData = { count: 0, lastResetDate: today };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
          return resetData;
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error reading daily message data:', error);
    }
    
    // Default data for new users
    const defaultData = { count: 0, lastResetDate: new Date().toDateString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  });

  // Check for daily reset on component mount and periodically
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toDateString();
      if (messageData.lastResetDate !== today) {
        const resetData = { count: 0, lastResetDate: today };
        setMessageData(resetData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
      }
    };

    // Check immediately
    checkDailyReset();

    // Check every minute for date changes
    const interval = setInterval(checkDailyReset, 60000);

    return () => clearInterval(interval);
  }, [messageData.lastResetDate]);

  const incrementMessageCount = () => {
    const today = new Date().toDateString();
    const newData = {
      count: messageData.count + 1,
      lastResetDate: today
    };
    
    setMessageData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const getRemainingMessages = () => {
    return Math.max(0, DAILY_MESSAGE_LIMIT - messageData.count);
  };

  const isLimitReached = () => {
    return messageData.count >= DAILY_MESSAGE_LIMIT;
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilReset = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  return {
    messageCount: messageData.count,
    remainingMessages: getRemainingMessages(),
    isLimitReached: isLimitReached(),
    incrementMessageCount,
    getTimeUntilReset,
    dailyLimit: DAILY_MESSAGE_LIMIT
  };
}