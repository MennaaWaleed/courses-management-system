// src/features/student/BatchLectures/hooks/useLectures.js
import { useState, useEffect, useCallback } from 'react';
import { getLecturesByBatch } from '../../../../api/lectureApi';

export const useLectures = (batchId) => {
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLectures = useCallback(async () => {
    if (!batchId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getLecturesByBatch(batchId);
      // Sort by lectureOrder to ensure correct sequence
      const sortedData = data.sort((a, b) => a.lectureOrder - b.lectureOrder);
      setLectures(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return { lectures, isLoading, error, refetch: fetchLectures };
};