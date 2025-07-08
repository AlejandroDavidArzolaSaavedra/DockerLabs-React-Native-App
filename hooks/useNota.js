import { useState, useEffect } from 'react';
import { getNotesByVM } from '../services/notaService';

export const useNotes = (vmName) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vmName) {
      setNotes([]);
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError(null);

    getNotesByVM(vmName)
      .then(data => {
        if (isActive) {
          setNotes(data);
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
  }, [vmName]);

  return { notes, loading, error };
};
