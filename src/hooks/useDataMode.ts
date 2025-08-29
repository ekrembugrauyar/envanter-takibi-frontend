// Data Mode Hook - Mock data ile real API arasında geçiş
import { useState, useEffect } from 'react';

export type DataMode = 'mock' | 'api';

interface UseDataModeReturn {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  isMockMode: boolean;
  isApiMode: boolean;
  toggleMode: () => void;
}

export const useDataMode = (): UseDataModeReturn => {
  // Local storage'dan mode'u al, varsayılan olarak mock
  const [mode, setModeState] = useState<DataMode>(() => {
    const savedMode = localStorage.getItem('dataMode');
    return (savedMode as DataMode) || 'mock';
  });

  // Mode değiştiğinde local storage'a kaydet
  useEffect(() => {
    localStorage.setItem('dataMode', mode);
  }, [mode]);

  // Mode'u değiştir
  const setMode = (newMode: DataMode) => {
    setModeState(newMode);
  };

  // Mode'u toggle et
  const toggleMode = () => {
    setModeState(prevMode => prevMode === 'mock' ? 'api' : 'mock');
  };

  return {
    mode,
    setMode,
    isMockMode: mode === 'mock',
    isApiMode: mode === 'api',
    toggleMode,
  };
};

// Environment variable'dan mode'u kontrol et
export const getDefaultDataMode = (): DataMode => {
  const envMode = import.meta.env.VITE_ENABLE_MOCK_DATA;
  
  if (envMode === 'false') {
    return 'api';
  }
  
  if (envMode === 'true') {
    return 'mock';
  }
  
  // Varsayılan olarak mock mode
  return 'mock';
};

// Mode indicator component için utility
export const getModeIndicatorText = (mode: DataMode): string => {
  return mode === 'mock' ? 'Demo Mode' : 'Live Mode';
};

export const getModeIndicatorColor = (mode: DataMode): string => {
  return mode === 'mock' ? 'text-orange-600' : 'text-green-600';
};

export const getModeIndicatorBgColor = (mode: DataMode): string => {
  return mode === 'mock' ? 'bg-orange-100' : 'bg-green-100';
};
