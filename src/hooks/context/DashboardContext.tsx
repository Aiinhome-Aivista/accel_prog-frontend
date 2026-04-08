import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardKPI } from '../../features/pages/dashboard/dashboard.models';

interface DashboardContextType {
  kpiData: DashboardKPI | null;
  isLoadingKPI: boolean;
  refreshKPI: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [kpiData, setKpiData] = useState<DashboardKPI | null>(null);
  const [isLoadingKPI, setIsLoadingKPI] = useState(false);

  const refreshKPI = useCallback(async () => {
    // Determine the userId to use, fallback to a default if necessary (matching Dashboard.tsx logic)
    const userId = user?.id || 1; 
    
    setIsLoadingKPI(true);
    try {
      const response = await dashboardService.getDashboardKPI(userId);
      if (response.status === 'success' && response.data) {
        setKpiData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch Dashboard KPI:", error);
    } finally {
      setIsLoadingKPI(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshKPI();
    } else {
      setKpiData(null);
    }
  }, [isAuthenticated, user, refreshKPI]);

  return (
    <DashboardContext.Provider value={{ kpiData, isLoadingKPI, refreshKPI }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
