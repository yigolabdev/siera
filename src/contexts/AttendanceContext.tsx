import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getDocuments, setDocument, updateDocument as firestoreUpdate, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { AttendanceRecord, AttendanceStats } from '../types';

interface AttendanceContextType {
  attendances: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
  addAttendance: (attendance: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAttendance: (id: string, attendance: Partial<AttendanceRecord>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  getAttendanceById: (id: string) => AttendanceRecord | undefined;
  getAttendancesByEvent: (eventId: string) => AttendanceRecord[];
  getAttendancesByUser: (userId: string) => AttendanceRecord[];
  getUserAttendanceStats: (userId: string) => AttendanceStats | null;
  getAllAttendanceStats: () => AttendanceStats[];
  markAttendance: (eventId: string, userId: string, userName: string, status: AttendanceRecord['attendanceStatus']) => Promise<void>;
  refreshAttendances: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadAttendances = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getDocuments<AttendanceRecord>('attendances');
      
      if (result.success && result.data) {
        setAttendances(result.data);
        console.log('✅ Firebase에서 출석 데이터 로드:', result.data.length);
      } else {
        setAttendances([]);
        console.log('ℹ️ Firebase에서 로드된 출석 데이터가 없습니다.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 출석 데이터 로드 실패:', message);
      setError(message);
      setAttendances([]);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firebase 초기 데이터 로드
  useEffect(() => {
    loadAttendances();
  }, [loadAttendances]);

  const addAttendance = useCallback(async (attendanceData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = `attendance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const attendance: AttendanceRecord = {
        ...attendanceData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await setDocument('attendances', id, attendance);
      if (result.success) {
        setAttendances(prev => [...prev, attendance]);
        console.log('✅ 출석 기록 추가 성공:', id);
      } else {
        throw new Error(result.error || '출석 기록 추가 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { attendance: attendanceData });
      throw error;
    }
  }, []);

  const updateAttendance = useCallback(async (id: string, updatedAttendance: Partial<AttendanceRecord>) => {
    try {
      const updateData = {
        ...updatedAttendance,
        updatedAt: new Date().toISOString(),
      };
      
      const result = await firestoreUpdate('attendances', id, updateData);
      if (result.success) {
        setAttendances(prev => prev.map(attendance => 
          attendance.id === id ? { ...attendance, ...updateData } : attendance
        ));
        console.log('✅ 출석 기록 수정 성공:', id);
      } else {
        throw new Error(result.error || '출석 기록 수정 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { attendanceId: id });
      throw error;
    }
  }, []);

  const deleteAttendance = useCallback(async (id: string) => {
    try {
      const result = await deleteDocument('attendances', id);
      if (result.success) {
        setAttendances(prev => prev.filter(attendance => attendance.id !== id));
        console.log('✅ 출석 기록 삭제 성공:', id);
      } else {
        throw new Error(result.error || '출석 기록 삭제 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { attendanceId: id });
      throw error;
    }
  }, []);

  const markAttendance = useCallback(async (
    eventId: string, 
    userId: string, 
    userName: string, 
    status: AttendanceRecord['attendanceStatus']
  ) => {
    try {
      // 기존 출석 기록이 있는지 확인
      const existingRecord = attendances.find(
        a => a.eventId === eventId && a.userId === userId
      );
      
      if (existingRecord) {
        // 기존 기록 업데이트
        await updateAttendance(existingRecord.id, {
          attendanceStatus: status,
          checkInTime: status === 'present' || status === 'late' ? new Date().toISOString() : undefined,
        });
      } else {
        // 새 기록 추가
        await addAttendance({
          eventId,
          userId,
          userName,
          attendanceStatus: status,
          checkInTime: status === 'present' || status === 'late' ? new Date().toISOString() : undefined,
          recordedBy: userId, // 기록한 관리자 ID (현재는 본인)
        });
      }
      console.log('✅ 출석 체크 완료:', { eventId, userId, status });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { eventId, userId });
      throw error;
    }
  }, [attendances, addAttendance, updateAttendance]);

  const refreshAttendances = useCallback(async () => {
    await loadAttendances();
  }, [loadAttendances]);

  const getAttendanceById = useCallback((id: string) => {
    return attendances.find(attendance => attendance.id === id);
  }, [attendances]);

  const getAttendancesByEvent = useCallback((eventId: string) => {
    return attendances.filter(attendance => attendance.eventId === eventId);
  }, [attendances]);

  const getAttendancesByUser = useCallback((userId: string) => {
    return attendances.filter(attendance => attendance.userId === userId);
  }, [attendances]);

  const getUserAttendanceStats = useCallback((userId: string): AttendanceStats | null => {
    const userAttendances = getAttendancesByUser(userId);
    
    if (userAttendances.length === 0) return null;
    
    const attended = userAttendances.filter(a => a.attendanceStatus === 'present').length;
    const absent = userAttendances.filter(a => a.attendanceStatus === 'absent').length;
    const excused = userAttendances.filter(a => a.attendanceStatus === 'excused').length;
    const late = userAttendances.filter(a => a.attendanceStatus === 'late').length;
    const totalEvents = userAttendances.length;
    const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : 0;
    
    return {
      userId,
      userName: userAttendances[0]?.userName || '',
      totalEvents,
      attended,
      absent,
      excused,
      late,
      attendanceRate,
    };
  }, [getAttendancesByUser]);

  const getAllAttendanceStats = useCallback((): AttendanceStats[] => {
    // 모든 사용자의 출석 통계 계산
    const userIds = [...new Set(attendances.map(a => a.userId))];
    
    return userIds
      .map(userId => getUserAttendanceStats(userId))
      .filter((stats): stats is AttendanceStats => stats !== null)
      .sort((a, b) => b.attendanceRate - a.attendanceRate);
  }, [attendances, getUserAttendanceStats]);

  const value = useMemo(() => ({
    attendances,
    isLoading,
    error,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceById,
    getAttendancesByEvent,
    getAttendancesByUser,
    getUserAttendanceStats,
    getAllAttendanceStats,
    markAttendance,
    refreshAttendances,
  }), [
    attendances,
    isLoading,
    error,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceById,
    getAttendancesByEvent,
    getAttendancesByUser,
    getUserAttendanceStats,
    getAllAttendanceStats,
    markAttendance,
    refreshAttendances,
  ]);

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

export const useAttendances = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendances must be used within an AttendanceProvider');
  }
  return context;
};
