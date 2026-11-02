import { useEffect, useState } from 'react';
import { getPatients } from '../services/patientService.js';

export default function useFetchPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getPatients({ signal: controller.signal })
      .then(setPatients)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { patients, loading, error };
}
