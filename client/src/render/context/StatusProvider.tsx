import React, {
  useState, createContext, useEffect, useContext, useCallback,
} from 'react';
import { MetricsV2 } from '../../models/metrics';

export interface Status {
  online: boolean
  metrics: MetricsV2 | null
  loading: boolean
  collectMetrics: () => void
}

const defaultContext: Status = {
  online: false,
  metrics: null,
  loading: true,
  collectMetrics: () => null,
};

export const StatusContext = createContext<Status>(defaultContext);

const StatusProvider = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false)
  const [metrics, setMetrics] = useState<MetricsV2 | null>(null)

  const collectMetrics = useCallback(async () => {
    try {
      const [isOnline, data] = await window.electron.getMetrics();
      setOnline(isOnline);
      setMetrics(data);
    } catch {
      setOnline(false);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    collectMetrics();
    const interval = setInterval(collectMetrics, 15_000);
    return () => clearInterval(interval);
  }, [collectMetrics]);

  return (
    <StatusContext.Provider
      value={{ online, metrics, loading, collectMetrics }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext)

export default StatusProvider;
