import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../../components/ui/FadeIn';
import { ChevronDown, Loader2, Smartphone, ArrowRight, CheckCircle, Mountain, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContextEnhanced';
import Modal from '../../components/ui/Modal';
import { isInAppBrowser, openInExternalBrowser, isKakaoTalkBrowser } from '../../utils/browserDetect';
import { cleanupRecaptcha } from '../../lib/firebase/auth';
import { GoogleIcon, KakaoIcon } from '../../components/icons/SocialIcons';

export const LandingHero: React.FC = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);
  
  // SMS 인증 관련 상태
  const [showSmsLogin, setShowSmsLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [smsError, setSmsError] = useState('');
  const [smsSuccess, setSmsSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  // 인앱 브라우저 감지
  const [isInApp, setIsInApp] = useState(false);
  const recaptchaInitialized = useRef(false);
  
  const navigate = useNavigate();
  const { loginWithGoogle, initPhoneAuth, sendPhoneCode, verifyPhoneCode, logout, user, firebaseUser, isLoading: authLoading, googleRedirectResult, clearGoogleRedirectResult } = useAuth();

  // 인앱 브라우저 감지
  useEffect(() => {
    setIsInApp(isInAppBrowser());
  }, []);

  // 이미 로그인된 사용자 자동 리디렉션
  // 모바일에서 Google 로그인은 popup→redirect 방식으로 동작하므로,
  // 리디렉트 후 onAuthStateChanged가 상태를 복구하면 이 useEffect가 라우팅을 담당.
  // navigate()를 사용하여 전체 페이지 리로드 없이 즉시 라우팅.
  useEffect(() => {
    if (hasCheckedUser || isGoogleLoggingIn || showSmsLogin || authLoading) return;

    if (user) {
      setHasCheckedUser(true);
      navigate(user.isApproved ? '/home/events' : '/home', { replace: true });
      return;
    }

    if (firebaseUser && !user) {
      setHasCheckedUser(true);
      navigate('/complete-profile', { replace: true });
      return;
    }
  }, [user, firebaseUser, authLoading, hasCheckedUser, isGoogleLoggingIn, showSmsLogin, navigate]);

  // Google redirect 결과 처리 (모바일에서 signInWithRedirect 후 돌아왔을 때)
  useEffect(() => {
    if (!googleRedirectResult || hasCheckedUser) return;

    setHasCheckedUser(true);
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
  }, [googleRedirectResult, hasCheckedUser, clearGoogleRedirectResult, navigate]);

  // SMS 인증 카운트다운
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // SMS 모달 열릴 때 reCAPTCHA 초기화
  useEffect(() => {
    if (showSmsLogin && !recaptchaInitialized.current) {
      // DOM 렌더링 후 초기화
      const timer = setTimeout(() => {
        initPhoneAuth('sms-send-button');
        recaptchaInitialized.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (!showSmsLogin) {
      recaptchaInitialized.current = false;
      cleanupRecaptcha();
    }
  }, [showSmsLogin, initPhoneAuth]);

  const handleGoogleLogin = async () => {
    if (isGoogleLoggingIn) return;
    
    // 인앱 브라우저에서는 외부 브라우저로 이동
    if (isInApp) {
      openInExternalBrowser();
      return;
    }
    
    setIsGoogleLoggingIn(true);
    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        if (result.isPendingUser) {
          navigate('/home', { replace: true });
        } else if (result.needsProfile || result.isNewUser) {
          navigate('/complete-profile', { replace: true });
        } else {
          navigate('/home/events', { replace: true });
        }
        return;
      } else if (result.message && !result.message.includes('취소')) {
        setErrorMessage(result.message);
        setShowErrorModal(true);
      }
    } catch (error: any) {
      setErrorMessage('Google 로그인 중 오류가 발생했습니다.\n아래 휴대폰 인증을 이용해주세요.');
      setShowErrorModal(true);
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  // 전화번호 포맷팅
  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return numbers.slice(0, 3) + '-' + numbers.slice(3);
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
  };

  // SMS 인증코드 전송
  const handleSendSms = async () => {
    if (isSendingSms || countdown > 0) return;
    
    const cleanNumber = phoneNumber.replace(/[-\s]/g, '');
    if (cleanNumber.length < 10) {
      setSmsError('올바른 전화번호를 입력해주세요.');
      return;
    }
    
    setIsSendingSms(true);
    setSmsError('');
    setSmsSuccess('');
    
    try {
      // reCAPTCHA 재초기화 (재전송 시)
      if (smsSent) {
        initPhoneAuth('sms-send-button');
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      
      const result = await sendPhoneCode(cleanNumber);
      
      if (result.success) {
        setSmsSent(true);
        setCountdown(180); // 3분 카운트다운
        setSmsSuccess('인증코드가 전송되었습니다.\nSMS를 확인해주세요.');
      } else {
        setSmsError(result.error || 'SMS 전송에 실패했습니다.');
      }
    } catch {
      setSmsError('SMS 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingSms(false);
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (isVerifying || !verificationCode) return;
    
    if (verificationCode.length !== 6) {
      setSmsError('6자리 인증코드를 입력해주세요.');
      return;
    }
    
    setIsVerifying(true);
    setSmsError('');
    setSmsSuccess('');
    
    try {
      const result = await verifyPhoneCode(verificationCode);
      
      if (result.success) {
        if (result.matchedMember) {
          setSmsSuccess(`${result.matchedMember.name}님, 환영합니다! 로그인되었습니다.`);
          setTimeout(() => navigate('/home/events', { replace: true }), 2500);
        } else if (result.isPendingUser) {
          setSmsSuccess('인증이 완료되었습니다. 승인 대기 중입니다.');
          setTimeout(() => navigate('/home', { replace: true }), 2500);
        } else if (result.needsProfile || result.isNewUser) {
          setShowSmsLogin(false);
          setErrorMessage('등록되지 않은 전화번호입니다.\n입회 신청을 진행해주세요.');
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
            navigate('/register', { replace: true });
          }, 3000);
        } else {
          setSmsSuccess('로그인되었습니다!');
          setTimeout(() => navigate('/home/events', { replace: true }), 2000);
        }
      } else {
        setSmsError(result.message || '인증에 실패했습니다.');
      }
    } catch {
      setSmsError('인증 확인 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // SMS 모달 닫기
  const handleCloseSmsModal = () => {
    setShowSmsLogin(false);
    setPhoneNumber('');
    setVerificationCode('');
    setSmsSent(false);
    setSmsError('');
    setSmsSuccess('');
    setCountdown(0);
    cleanupRecaptcha();
    recaptchaInitialized.current = false;
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 모바일 환경: 인증 확인 중에는 스플래시 스크린 표시 (랜딩 페이지 깜빡임 방지)
  if (authLoading) {
    return (
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="text-center">
          {/* 로고 */}
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/10">
            <Mountain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">시애라 클럽</h1>
          <p className="text-sm text-white/50 mb-6 tracking-widest uppercase">Sierra Club</p>
          {/* 로딩 인디케이터 */}
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80 mx-auto mb-4"></div>
          <p className="text-sm text-white/60">로그인 중입니다. 잠시만 기다려주세요.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop" 
          alt="Majestic Mountain Range" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center">
          {/* Main Content */}
          <div className="text-center mb-12 md:mb-40">
            <FadeIn delay={200}>
              <h2 className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
                2005 ~ 2026 Heritage
              </h2>
            </FadeIn>
            
            <FadeIn delay={400}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                리더들을 위한<br />
                하이 트러스트 커뮤니티
              </h1>
            </FadeIn>

            <FadeIn delay={600}>
              <p className="text-gray-200 text-xs md:text-lg mb-6 md:mb-10 max-w-2xl leading-relaxed font-light mx-auto">
                건강한 루틴과 검증된 네트워크. 전문직·CEO·임원들이 선택한 품격 있는 교류의 장, 시애라 클럽입니다.
              </p>
            </FadeIn>

            <FadeIn delay={800}>
              <div className="flex flex-row gap-3 justify-center">
                <button 
                  onClick={scrollToAbout}
                  disabled={isGoogleLoggingIn}
                  className="inline-block border-2 border-white text-white px-6 md:px-10 py-2.5 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  더보기
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  disabled={isGoogleLoggingIn}
                  className="inline-block border-2 border-white bg-white text-black px-6 md:px-10 py-2.5 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                >
                  시애라 소개 보기
                </button>
              </div>
            </FadeIn>
          </div>

          {/* 인앱 브라우저 안내 배너 */}
          {isInApp && (
            <FadeIn delay={900} className="w-full max-w-3xl">
              <div className="bg-amber-500/90 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-400 text-center">
                <p className="text-white text-sm font-medium">
                  {isKakaoTalkBrowser() ? '카카오톡' : '인앱'} 브라우저에서 접속하셨습니다.
                </p>
                <p className="text-white/80 text-xs mt-1">
                  Google 로그인은 외부 브라우저에서만 가능합니다. 아래 <strong>휴대폰 인증</strong>을 이용해주세요.
                </p>
              </div>
            </FadeIn>
          )}

          {/* 로그인 & 산행 신청 영역 */}
          <FadeIn delay={1000} className="w-full max-w-3xl">
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl shadow-2xl w-full border border-slate-700 overflow-hidden">
              {/* 데스크톱 레이아웃 */}
              <div className="hidden md:flex">
                {/* 로그인 영역 */}
                <div className="flex-1 p-5 border-r border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">회원 로그인</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoggingIn}
                      className="flex-1 bg-white text-slate-700 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isGoogleLoggingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          로그인 중...
                        </>
                      ) : isInApp ? (
                        <>
                          <GoogleIcon />
                          <span>외부 브라우저</span>
                        </>
                      ) : (
                        <>
                          <GoogleIcon />
                          <span>Google</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSmsLogin(true)}
                      disabled={isGoogleLoggingIn}
                      className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>휴대폰 인증</span>
                    </button>
                  </div>
                </div>

                {/* 산행 신청 영역 */}
                <div className="flex-1 p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">산행 신청</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/quick-apply')}
                      disabled={isGoogleLoggingIn}
                      className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <Mountain className="w-4 h-4" />
                      간편 산행 신청
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/guest-application')}
                      disabled={isGoogleLoggingIn}
                      className="flex-1 bg-amber-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <Users className="w-4 h-4" />
                      게스트 신청
                    </button>
                  </div>
                </div>
              </div>

              {/* 모바일 레이아웃 */}
              <div className="md:hidden p-4 space-y-4">
                {/* 로그인 영역 */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">회원 로그인</p>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoggingIn}
                      className="w-full bg-white text-slate-700 py-3.5 rounded-lg font-semibold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGoogleLoggingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          로그인 중...
                        </>
                      ) : isInApp ? (
                        <>
                          <GoogleIcon />
                          <span>외부 브라우저에서 Google 로그인</span>
                        </>
                      ) : (
                        <>
                          <GoogleIcon />
                          <span>Google 로그인</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSmsLogin(true)}
                      disabled={isGoogleLoggingIn}
                      className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Smartphone className="w-5 h-5" />
                      <span>휴대폰 번호로 로그인</span>
                    </button>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-slate-700" />

                {/* 산행 신청 영역 */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">산행 신청</p>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => navigate('/quick-apply')}
                      disabled={isGoogleLoggingIn}
                      className="flex-1 bg-green-600 text-white py-3.5 rounded-lg font-bold text-base hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Mountain className="w-5 h-5" />
                      <span>간편 산행 신청</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/guest-application')}
                      disabled={isGoogleLoggingIn}
                      className="flex-1 bg-amber-500 text-white py-3.5 rounded-lg font-bold text-base hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Users className="w-5 h-5" />
                      <span>게스트 신청</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* SMS 인증 모달 */}
      {showSmsLogin && (
        <Modal onClose={handleCloseSmsModal} maxWidth="max-w-md">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">휴대폰 인증</h3>
              <p className="text-sm text-slate-500 mt-1">
                등록된 휴대폰 번호로 간편하게 로그인하세요
              </p>
            </div>

            {!smsSent ? (
              /* Step 1: 전화번호 입력 */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">휴대폰 번호</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(formatPhoneInput(e.target.value));
                      setSmsError('');
                    }}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center tracking-widest"
                    maxLength={13}
                    autoFocus
                  />
                </div>

                {smsError && (
                  <p className="text-sm text-red-500 text-center">{smsError}</p>
                )}

                <button
                  id="sms-send-button"
                  type="button"
                  onClick={handleSendSms}
                  disabled={isSendingSms || phoneNumber.replace(/[-\s]/g, '').length < 10}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingSms ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      인증코드 받기
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Step 2: 인증코드 입력 */
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-emerald-700">
                    <strong>{phoneNumber}</strong>으로 인증코드를 전송했습니다
                  </p>
                  {countdown > 0 && (
                    <p className="text-xs text-emerald-600 mt-1">
                      남은 시간: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">인증코드 6자리</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setVerificationCode(val);
                      setSmsError('');
                    }}
                    placeholder="000000"
                    className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center tracking-[0.5em] font-mono"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {smsError && (
                  <p className="text-sm text-red-500 text-center">{smsError}</p>
                )}
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
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      인증 확인
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setSmsSent(false);
                      setVerificationCode('');
                      setSmsError('');
                      setSmsSuccess('');
                      recaptchaInitialized.current = false;
                      cleanupRecaptcha();
                      setTimeout(() => {
                        initPhoneAuth('sms-send-button');
                        recaptchaInitialized.current = true;
                      }, 500);
                    }}
                    className="text-slate-500 hover:text-slate-700 underline"
                  >
                    번호 다시 입력
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      recaptchaInitialized.current = false;
                      cleanupRecaptcha();
                      setTimeout(() => {
                        initPhoneAuth('sms-send-button');
                        recaptchaInitialized.current = true;
                        setTimeout(() => handleSendSms(), 500);
                      }, 500);
                    }}
                    disabled={countdown > 0}
                    className="text-emerald-600 hover:text-emerald-700 underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `재전송 (${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')})` : '인증코드 재전송'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                SMS 인증 시 통신사 문자 수신 비용이 발생할 수 있습니다
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <Modal onClose={() => setShowErrorModal(false)} maxWidth="max-w-md">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">알림</h3>
            <p className="text-slate-600 mb-6 whitespace-pre-line">
              {errorMessage}
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-base hover:bg-slate-800 transition-all"
              >
                확인
              </button>
              {errorMessage.includes('휴대폰') && (
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    setShowSmsLogin(true);
                  }}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-base hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  휴대폰 인증으로 전환
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Scroll Indicator */}
      {!isGoogleLoggingIn && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/70 cursor-pointer" onClick={scrollToAbout}>
          <ChevronDown size={32} strokeWidth={1} />
        </div>
      )}

    </section>
  );
};
