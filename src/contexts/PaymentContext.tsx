import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getDocuments, setDocument, updateDocument as firestoreUpdate, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { Payment } from '../types';
import { waitForFirebase } from '../lib/firebase/config';
import { useAuth } from './AuthContextEnhanced';

interface PaymentContextType {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByEvent: (eventId: string) => Payment[];
  getPaymentsByUser: (userId: string) => Payment[];
  getPaymentsByStatus: (status: Payment['paymentStatus']) => Payment[];
  confirmPayment: (id: string) => Promise<void>;
  cancelPayment: (id: string, reason?: string) => Promise<void>;
  refreshPayments: () => Promise<void>;
  createPaymentForParticipation: (participation: {
    id: string;
    eventId: string;
    userId: string;
    userName: string;
    userEmail: string;
  }, eventCost?: string) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  // 🔥 AuthContext 사용
  const auth = useAuth();
  
  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 [PaymentContext] payments 데이터 로드 시작');
      
      const result = await getDocuments<Payment>('payments');
      
      if (result.success && result.data) {
        setPayments(result.data);
        console.log('✅ Firebase에서 결제 데이터 로드:', result.data.length, '개');
      } else {
        setPayments([]);
        console.log('ℹ️ Firebase에서 로드된 결제 데이터가 없습니다.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 결제 데이터 로드 실패:', message);
      setError(message);
      setPayments([]);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'PaymentContext.loadPayments',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firebase 초기 데이터 로드 - 로그인 상태 변경 시 재로드
  useEffect(() => {
    const initializeData = async () => {
      console.log('🔄 [PaymentContext] 데이터 로드 시작, 인증 상태:', {
        isAuthenticated: !!auth.firebaseUser,
        email: auth.firebaseUser?.email,
        hasLoadedOnce
      });
      
      // 로그인 상태이거나 아직 한 번도 로드하지 않았을 때만 로드
      if (auth.firebaseUser || !hasLoadedOnce) {
        await loadPayments();
        setHasLoadedOnce(true);
      }
    };
    
    // Auth 로딩이 완료된 후에만 실행
    if (!auth.isLoading) {
      initializeData();
    }
  }, [auth.firebaseUser, auth.isLoading, loadPayments]);

  const addPayment = useCallback(async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const payment: Payment = {
        ...paymentData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await setDocument('payments', id, payment);
      if (result.success) {
        setPayments(prev => [...prev, payment]);
        console.log('✅ 결제 추가 성공:', id);
      } else {
        throw new Error(result.error || '결제 추가 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { payment: paymentData });
      throw error;
    }
  }, []);

  const updatePayment = useCallback(async (id: string, updatedPayment: Partial<Payment>) => {
    try {
      const updateData = {
        ...updatedPayment,
        updatedAt: new Date().toISOString(),
      };
      
      const result = await firestoreUpdate('payments', id, updateData);
      if (result.success) {
        setPayments(prev => prev.map(payment => 
          payment.id === id ? { ...payment, ...updateData } : payment
        ));
        console.log('✅ 결제 수정 성공:', id);
      } else {
        throw new Error(result.error || '결제 수정 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { paymentId: id });
      throw error;
    }
  }, []);

  const deletePayment = useCallback(async (id: string) => {
    try {
      const result = await deleteDocument('payments', id);
      if (result.success) {
        setPayments(prev => prev.filter(payment => payment.id !== id));
        console.log('✅ 결제 삭제 성공:', id);
      } else {
        throw new Error(result.error || '결제 삭제 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { paymentId: id });
      throw error;
    }
  }, []);

  const confirmPayment = useCallback(async (id: string) => {
    try {
      await updatePayment(id, {
        paymentStatus: 'confirmed',
        paymentDate: new Date().toISOString(),
      });
      console.log('✅ 결제 확인 완료:', id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { paymentId: id });
      throw error;
    }
  }, [updatePayment]);

  const cancelPayment = useCallback(async (id: string, reason?: string) => {
    try {
      await updatePayment(id, {
        paymentStatus: 'cancelled',
        memo: reason || '결제 취소됨',
      });
      console.log('✅ 결제 취소 완료:', id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { paymentId: id });
      throw error;
    }
  }, [updatePayment]);

  const refreshPayments = useCallback(async () => {
    await loadPayments();
  }, [loadPayments]);

  /**
   * 산행 신청 시 자동으로 결제 레코드 생성
   * @param participation - 참가 신청 정보
   * @param eventCost - 산행 참가비 (선택사항)
   */
  const createPaymentForParticipation = useCallback(async (
    participation: {
      id: string;
      eventId: string;
      userId: string;
      userName: string;
      userEmail: string;
    },
    eventCost?: string
  ) => {
    try {
      // 이미 결제 레코드가 있는지 확인
      const existingPayment = payments.find(
        p => p.participationId === participation.id
      );
      
      if (existingPayment) {
        console.log('⚠️ 이미 결제 레코드가 존재합니다:', existingPayment.id);
        return;
      }
      
      // 참가비 파싱 (예: "20,000원" -> 20000)
      const amount = eventCost 
        ? parseInt(eventCost.replace(/[^0-9]/g, '')) || 0
        : 0;
      
      // 결제 레코드 생성 (pending 상태)
      await addPayment({
        participationId: participation.id,
        eventId: participation.eventId,
        userId: participation.userId,
        userName: participation.userName,
        email: participation.userEmail,
        company: '', // 추후 회원 정보에서 가져올 수 있음
        position: '',
        phoneNumber: '',
        applicationDate: new Date().toISOString(),
        paymentStatus: 'pending',
        amount: amount,
        memo: '산행 신청 완료 (입금 대기)',
      });
      
      console.log('✅ 결제 레코드 자동 생성 완료:', {
        participationId: participation.id,
        amount,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 결제 레코드 생성 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { participation });
      // 결제 레코드 생성 실패해도 산행 신청은 완료되어야 함
      // throw하지 않고 로그만 남김
    }
  }, [payments, addPayment]);

  const getPaymentById = useCallback((id: string) => {
    return payments.find(payment => payment.id === id);
  }, [payments]);

  const getPaymentsByEvent = useCallback((eventId: string) => {
    return payments.filter(payment => payment.eventId === eventId);
  }, [payments]);

  const getPaymentsByUser = useCallback((userId: string) => {
    return payments.filter(payment => payment.userId === userId);
  }, [payments]);

  const getPaymentsByStatus = useCallback((status: Payment['paymentStatus']) => {
    return payments.filter(payment => payment.paymentStatus === status);
  }, [payments]);

  const value = useMemo(() => ({
    payments,
    isLoading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
    getPaymentsByEvent,
    getPaymentsByUser,
    getPaymentsByStatus,
    confirmPayment,
    cancelPayment,
    refreshPayments,
    createPaymentForParticipation,
  }), [
    payments,
    isLoading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
    getPaymentsByEvent,
    getPaymentsByUser,
    getPaymentsByStatus,
    confirmPayment,
    cancelPayment,
    refreshPayments,
    createPaymentForParticipation,
  ]);

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
};
