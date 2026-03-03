import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Smartphone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import SEOHead from '../components/SEOHead';
import Modal from '../components/ui/Modal';
import { isInAppBrowser, openInExternalBrowser, isKakaoTalkBrowser } from '../utils/browserDetect';
import { cleanupRecaptcha } from '../lib/firebase/auth';
import { GoogleIcon, KakaoIcon } from '../components/icons/SocialIcons';

const Register = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, initPhoneAuth, sendPhoneCode, verifyPhoneCode, firebaseUser, user, isLoading, googleRedirectResult, clearGoogleRedirectResult } = useAuth();
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  
  // SMS 인증 상태
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [smsError, setSmsError] = useState('');
  const [smsSuccess, setSmsSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const recaptchaInitialized = useRef(false);

  // 이미 Firebase Auth로 인증된 상태면 바로 적절한 페이지로 이동 (계정 재선택 방지)
  useEffect(() => {
    if (isLoading) return;
    if (firebaseUser && !user) {
      navigate('/complete-profile', { replace: true });
    } else if (firebaseUser && user && !user.isApproved) {
      navigate('/home', { replace: true });
    } else if (firebaseUser && user?.isApproved) {
      navigate('/home/events', { replace: true });
    }
  }, [firebaseUser, user, isLoading, navigate]);

  // Google redirect 결과 처리 (모바일)
  useEffect(() => {
    if (!googleRedirectResult) return;
    clearGoogleRedirectResult();
    if (googleRedirectResult.success) {
      if (googleRedirectResult.isPendingUser) {
        navigate('/home', { replace: true });
      } else if (googleRedirectResult.needsProfile || googleRedirectResult.isNewUser) {
        navigate('/complete-profile', { replace: true });
      } else {
        navigate('/home/events', { replace: true });
      }
    }
  }, [googleRedirectResult, clearGoogleRedirectResult, navigate]);

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsInApp(isInAppBrowser());
  }, []);

  // 카운트다운
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // SMS 모달 reCAPTCHA 초기화
  useEffect(() => {
    if (showSmsModal && !recaptchaInitialized.current) {
      const timer = setTimeout(() => {
        initPhoneAuth('reg-sms-send-button');
        recaptchaInitialized.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
    if (!showSmsModal) {
      recaptchaInitialized.current = false;
      cleanupRecaptcha();
    }
  }, [showSmsModal, initPhoneAuth]);

  const handleGoogleSignup = async () => {
    if (isGoogleLoggingIn) return;
    
    if (isInApp) {
      openInExternalBrowser();
      return;
    }
    
    setIsGoogleLoggingIn(true);
    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        if (result.isPendingUser) {
          navigate('/home');
        } else if (result.isNewUser || result.needsProfile) {
          navigate('/complete-profile');
        } else {
          navigate('/home/events');
        }
      } else if (result.message && !result.message.includes('취소')) {
        alert(result.message || 'Google 회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Google 회원가입 오류:', error);
      alert('Google 회원가입 중 오류가 발생했습니다.\n휴대폰 인증을 이용해주세요.');
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return numbers.slice(0, 3) + '-' + numbers.slice(3);
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
  };

  const handleSendSms = async () => {
    if (isSendingSms || countdown > 0) return;
    const cleanNumber = phoneNumber.replace(/[-\s]/g, '');
    if (cleanNumber.length < 10) { setSmsError('올바른 전화번호를 입력해주세요.'); return; }
    setIsSendingSms(true); setSmsError(''); setSmsSuccess('');
    try {
      if (smsSent) {
        initPhoneAuth('reg-sms-send-button');
        await new Promise((r) => setTimeout(r, 500));
      }
      const result = await sendPhoneCode(cleanNumber);
      if (result.success) { setSmsSent(true); setCountdown(180); setSmsSuccess('인증코드가 전송되었습니다.'); }
      else setSmsError(result.error || 'SMS 전송에 실패했습니다.');
    } catch { setSmsError('SMS 전송 중 오류가 발생했습니다.'); }
    finally { setIsSendingSms(false); }
  };

  const handleVerifyCode = async () => {
    if (isVerifying || verificationCode.length !== 6) return;
    setIsVerifying(true); setSmsError(''); setSmsSuccess('');
    try {
      const result = await verifyPhoneCode(verificationCode);
      if (result.success) {
        if (result.matchedMember) {
          setSmsSuccess(`${result.matchedMember.name}님, 환영합니다! 기존 회원으로 로그인되었습니다.`);
          setTimeout(() => { setShowSmsModal(false); navigate('/home/events'); }, 2500);
        } else if (result.isPendingUser) {
          setSmsSuccess('인증이 완료되었습니다. 승인 대기 중입니다.');
          setTimeout(() => { setShowSmsModal(false); navigate('/home'); }, 2500);
        } else if (result.needsProfile || result.isNewUser) {
          setSmsSuccess('인증이 완료되었습니다! 프로필을 작성해주세요.');
          setTimeout(() => { setShowSmsModal(false); navigate('/complete-profile'); }, 2500);
        } else {
          setSmsSuccess('로그인되었습니다!');
          setTimeout(() => { setShowSmsModal(false); navigate('/home/events'); }, 2000);
        }
      } else { setSmsError(result.message || '인증에 실패했습니다.'); }
    } catch { setSmsError('인증 확인 중 오류가 발생했습니다.'); }
    finally { setIsVerifying(false); }
  };

  const handleCloseSmsModal = () => {
    setShowSmsModal(false); setPhoneNumber(''); setVerificationCode('');
    setSmsSent(false); setSmsError(''); setSmsSuccess(''); setCountdown(0);
    cleanupRecaptcha(); recaptchaInitialized.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="입회신청"
        description="시애라 등산 커뮤니티 입회 신청 페이지. Google 간편 로그인으로 빠르게 가입하고, 게스트 산행 2회 참석 후 정회원이 될 수 있습니다."
        path="/register"
      />
      <div className="max-w-md w-full">
        {/* 뒤로 가기 버튼 */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          메인으로 돌아가기
        </Link>

        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            시애라 클럽 가입
          </h1>
          <p className="text-slate-600 text-lg">
            간편하게 회원가입하고 시애라 클럽에 참여하세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
            간편 회원가입
          </h2>

          {isInApp && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 text-center">
                {isKakaoTalkBrowser() ? '카카오톡' : '인앱'} 브라우저에서 접속 중입니다.
                <br />
                <strong>휴대폰 인증</strong>을 이용해주세요.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Google 회원가입 버튼 (우선 표시) */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoggingIn}
              className="w-full bg-white text-slate-700 py-4 rounded-lg font-semibold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border-2 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              {isGoogleLoggingIn ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  처리 중...
                </>
              ) : isInApp ? (
                <>
                  <GoogleIcon size={24} />
                  <span>외부 브라우저에서 Google 가입</span>
                </>
              ) : (
                <>
                  <GoogleIcon size={24} />
                  <span>Google로 회원가입</span>
                </>
              )}
            </button>

            {/* SMS 인증 버튼 */}
            <button
              type="button"
              onClick={() => setShowSmsModal(true)}
              disabled={isGoogleLoggingIn}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smartphone className="w-6 h-6" />
              <span>휴대폰 번호로 가입</span>
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 leading-relaxed">
              <span className="font-semibold">정회원 가입 프로세스:</span>
              <br />
              1. 휴대폰 번호 또는 Google 계정으로 간편 가입
              <br />
              2. 추가 정보 입력 (이름, 연락처 등)
              <br />
              3. 게스트로 산행 2회 참석
              <br />
              4. 관리자 승인 후 정회원 전환
            </p>
          </div>
          <div className="mt-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-800 leading-relaxed">
              <span className="font-semibold">게스트 산행 안내:</span>
              <br />
              입회 신청 후 바로 게스트로 산행에 참여하실 수 있습니다.
              <br />
              게스트 산행 2회 참석 후 정회원으로 승인됩니다.
            </p>
          </div>

          {/* 이미 회원인 경우 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              이미 회원이신가요?{' '}
              <Link
                to="/"
                className="text-slate-900 font-semibold hover:text-slate-700 transition-colors"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            회원가입 시{' '}
            <Link to="/terms" className="text-slate-700 hover:text-slate-900 underline">
              이용약관
            </Link>
            {' '}및{' '}
            <Link to="/privacy" className="text-slate-700 hover:text-slate-900 underline">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>

      {/* SMS 인증 모달 */}
      {showSmsModal && (
        <Modal onClose={handleCloseSmsModal} maxWidth="max-w-md">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">휴대폰 인증</h3>
              <p className="text-sm text-slate-500 mt-1">휴대폰 번호로 간편하게 가입하세요</p>
            </div>

            {!smsSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">휴대폰 번호</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(formatPhoneInput(e.target.value)); setSmsError(''); }}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-widest"
                    maxLength={13}
                    autoFocus
                  />
                </div>
                {smsError && <p className="text-sm text-red-500 text-center">{smsError}</p>}
                <button
                  id="reg-sms-send-button"
                  type="button"
                  onClick={handleSendSms}
                  disabled={isSendingSms || phoneNumber.replace(/[-\s]/g, '').length < 10}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingSms ? (<><Loader2 className="w-5 h-5 animate-spin" />전송 중...</>) : (<><ArrowRight className="w-5 h-5" />인증코드 받기</>)}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-emerald-700"><strong>{phoneNumber}</strong>으로 인증코드를 전송했습니다</p>
                  {countdown > 0 && <p className="text-xs text-emerald-600 mt-1">남은 시간: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">인증코드 6자리</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={verificationCode}
                    onChange={(e) => { setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)); setSmsError(''); }}
                    placeholder="000000"
                    className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-[0.5em] font-mono"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                {smsError && <p className="text-sm text-red-500 text-center">{smsError}</p>}
                {smsSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center animate-in fade-in">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-800">{smsSuccess}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (<><Loader2 className="w-5 h-5 animate-spin" />확인 중...</>) : (<><CheckCircle className="w-5 h-5" />인증 확인</>)}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => { setSmsSent(false); setVerificationCode(''); setSmsError(''); setSmsSuccess(''); recaptchaInitialized.current = false; cleanupRecaptcha(); setTimeout(() => { initPhoneAuth('reg-sms-send-button'); recaptchaInitialized.current = true; }, 500); }} className="text-slate-500 hover:text-slate-700 underline">번호 다시 입력</button>
                  <button type="button" onClick={() => { recaptchaInitialized.current = false; cleanupRecaptcha(); setTimeout(() => { initPhoneAuth('reg-sms-send-button'); recaptchaInitialized.current = true; setTimeout(() => handleSendSms(), 500); }, 500); }} disabled={countdown > 0} className="text-emerald-600 hover:text-emerald-700 underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed">
                    {countdown > 0 ? `재전송 (${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')})` : '인증코드 재전송'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Register;
