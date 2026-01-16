import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  WhereFilterOp,
  QueryConstraint,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * 문서 생성 (자동 ID)
 */
export const createDocument = async <T>(collectionName: string, data: T) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      success: true,
      id: docRef.id,
    };
  } catch (error: any) {
    console.error('Create document error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 문서 생성 (커스텀 ID)
 */
export const setDocument = async <T>(
  collectionName: string,
  docId: string,
  data: T,
  merge = false
) => {
  try {
    await setDoc(
      doc(db, collectionName, docId),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge }
    );
    
    return {
      success: true,
      id: docId,
    };
  } catch (error: any) {
    console.error('Set document error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 문서 읽기
 */
export const getDocument = async <T>(collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: { id: docSnap.id, ...docSnap.data() } as T,
      };
    } else {
      return {
        success: false,
        error: 'Document not found',
      };
    }
  } catch (error: any) {
    console.error('Get document error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 컬렉션의 모든 문서 읽기
 */
export const getDocuments = async <T>(
  collectionName: string,
  constraints?: QueryConstraint[]
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);
    
    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return {
      success: true,
      data: documents,
    };
  } catch (error: any) {
    console.error('Get documents error:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * 문서 업데이트
 */
export const updateDocument = async <T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    
    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Update document error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 문서 삭제
 */
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Delete document error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 조건부 쿼리
 */
export const queryDocuments = async <T>(
  collectionName: string,
  filters: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>,
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = [];
    
    // where 조건 추가
    filters.forEach((filter) => {
      constraints.push(where(filter.field, filter.operator, filter.value));
    });
    
    // orderBy 추가
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }
    
    // limit 추가
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return {
      success: true,
      data: documents,
    };
  } catch (error: any) {
    console.error('Query documents error:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

/**
 * Timestamp를 Date로 변환
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Date를 Timestamp로 변환
 */
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};
