import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { getDocuments, getDocument, setDocument, updateDocument as firestoreUpdate, deleteDocument, queryDocuments } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { Payment, User } from '../types';
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
    userPhone?: string;
    userCompany?: string;
    userPosition?: string;
    isGuest?: boolean;
  }, eventCost?: string) => Promise<void>;
  _activate: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);
  
  // 🔥 AuthContext 사용
  const auth = useAuth();
  
  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getDocuments<Payment>('payments');
      
      if (result.success && result.data) {
        setPayments(result.data);
      } else {
        setPayments([]);
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
    if (!_activated) return;
    const initializeData = async () => {
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
  }, [_activated, auth.firebaseUser, auth.isLoading, loadPayments]);

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
      // 1. 결제 상태 확인으로 변경
      await updatePayment(id, {
        paymentStatus: 'confirmed',
        paymentDate: new Date().toISOString(),
      });
      
      // 2. 연결된 participation도 confirmed로 변경
      const payment = payments.find(p => p.id === id);
      if (payment?.participationId) {
        try {
          await firestoreUpdate('participations', payment.participationId, {
            status: 'confirmed',
            updatedAt: new Date().toISOString(),
          });
        } catch (partError) {
          // participation 상태 변경 실패 (결제 확인은 완료)
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { paymentId: id });
      throw error;
    }
  }, [updatePayment, payments]);

  const cancelPayment = useCallback(async (id: string, reason?: string) => {
    try {
      // 1. 결제 취소
      await updatePayment(id, {
        paymentStatus: 'cancelled',
        memo: reason || '결제 취소됨',
      });
      
      // 2. 연결된 participation도 취소
      const payment = payments.find(p => p.id === id);
      if (payment?.participationId) {
        try {
          await firestoreUpdate('participations', payment.participationId, {
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason || '결제 취소에 의한 자동 취소',
            updatedAt: new Date().toISOString(),
          });
        } catch (partError) {
          // participation 취소 실패
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { paymentId: id });
      throw error;
    }
  }, [updatePayment, payments]);

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
      userPhone?: string;
      userCompany?: string;
      userPosition?: string;
      isGuest?: boolean;
    },
    eventCost?: string
  ) => {
    try {
      // 로컬 중복 체크 (빠른 필터)
      const existingByParticipation = payments.find(
        p => p.participationId === participation.id
      );
      if (existingByParticipation) return;
      
      const existingByUserEvent = payments.find(
        p => p.userId === participation.userId && 
             p.eventId === participation.eventId &&
             p.paymentStatus !== 'cancelled' &&
             p.refundStatus !== 'completed'
      );
      if (existingByUserEvent) return;
      
      // Firestore 레벨 중복 체크 (경합 조건 방지)
      const firestoreCheck = await queryDocuments<Payment>('payments', [
        { field: 'userId', operator: '==', value: participation.userId },
        { field: 'eventId', operator: '==', value: participation.eventId },
      ]);
      if (firestoreCheck.success && firestoreCheck.data && firestoreCheck.data.length > 0) {
        const activePayment = firestoreCheck.data.find(
          p => p.paymentStatus !== 'cancelled'
        );
        if (activePayment) return;
      }
      
      // 참가비 파싱 (예: "20,000원" -> 20000)
      const amount = eventCost 
        ? parseInt(eventCost.replace(/[^0-9]/g, '')) || 0
        : 0;
      
      // 회원 DB에서 실제 개인 정보 조회
      let memberName = participation.userName;
      let memberEmail = participation.userEmail;
      let memberCompany = participation.userCompany || '';
      let memberPosition = participation.userPosition || '';
      let memberPhone = participation.userPhone || '';
      let isGuest = participation.isGuest || false;
      
      try {
        // 1차: members 컬렉션에서 조회
        const memberResult = await getDocument<User>('members', participation.userId);
        if (memberResult.success && memberResult.data) {
          const member = memberResult.data;
          memberName = member.name || participation.userName;
          memberEmail = member.email || participation.userEmail;
          memberCompany = member.company || participation.userCompany || '';
          memberPosition = member.position || participation.userPosition || '';
          memberPhone = member.phoneNumber || participation.userPhone || '';
        } else {
          // 2차: pendingUsers 컬렉션에서 조회 (미승인 사용자)
          let foundInPending = false;
          try {
            const pendingResult = await getDocument<any>('pendingUsers', participation.userId);
            if (pendingResult.success && pendingResult.data) {
              const pending = pendingResult.data;
              memberName = pending.name || participation.userName;
              memberEmail = pending.email || participation.userEmail;
              memberCompany = pending.company || participation.userCompany || '';
              memberPosition = pending.position || participation.userPosition || '';
              memberPhone = pending.phoneNumber || pending.phone || participation.userPhone || '';
              // 승인된 pendingUser는 게스트가 아님 (승인 후에도 pendingUsers 문서가 남아있을 수 있음)
              // isGuest는 participation 데이터의 값을 유지
              foundInPending = true;
            }
          } catch {
            // pendingUsers 조회 실패
          }
          
          // 3차: guestApplications 컬렉션에서 조회 (게스트 신청)
          if (!foundInPending) {
            try {
              const guestResult = await getDocument<any>('guestApplications', participation.userId);
              if (guestResult.success && guestResult.data) {
                const guest = guestResult.data;
                memberName = guest.name || participation.userName;
                memberEmail = guest.email || participation.userEmail;
                memberCompany = guest.company || participation.userCompany || '';
                memberPosition = guest.position || participation.userPosition || '';
                memberPhone = guest.phoneNumber || guest.phone || participation.userPhone || '';
                isGuest = true;
              }
            } catch {
              // guestApplications 조회 실패, participation 정보 사용
            }
          }
        }
      } catch (memberErr) {
        // 회원 DB 조회 실패, participation 정보 사용
      }
      
      // 결제 레코드 생성 (pending 상태) - 회원 DB 기반 정보 사용
      await addPayment({
        participationId: participation.id,
        eventId: participation.eventId,
        userId: participation.userId,
        userName: memberName,
        email: memberEmail,
        company: memberCompany,
        position: memberPosition,
        phoneNumber: memberPhone,
        applicationDate: new Date().toISOString(),
        paymentStatus: 'pending',
        amount: amount,
        memo: '산행 신청 완료 (입금 대기)',
        isGuest: isGuest,
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
    _activate,
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
    _activate,
  ]);

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};
