import { useState, useEffect } from 'react';
import { getVirtualMachinesFiltered } from '../services/mvService';

export const useVirtualMachines = (filterType, filterValue) => {
  const [vms, setVMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true; 
    setLoading(true);
    setError(null);

    getVirtualMachinesFiltered(filterType, filterValue)
      .then(data => {
        if (isActive) {
          setVMs(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isActive) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { isActive = false; };
  }, [filterType, filterValue]);

  return { vms, loading, error };
};
