import React, { useEffect } from 'react';
import { Mountain, Users, Calendar, Award, Globe, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from './Landing/LandingNavbar';
import { LandingFooter } from './Landing/LandingFooter';
import { FadeIn } from '../components/ui/FadeIn';

const AboutSierra = () => {
  const navigate = useNavigate();

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-slate-100 selection:text-slate-900">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&h=1200&fit=crop" 
            alt="Mountain" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
          <FadeIn>
            <button
              onClick={() => navigate('/')}
              className="mb-8 text-white/70 hover:text-white inline-flex items-center gap-2 text-sm font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              홈으로 돌아가기
            </button>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              시애라 (詩愛羅, <span className="text-emerald-400">Sierra</span>)
            </h1>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-xl md:text-2xl text-white/90 font-light mb-8">
              시(詩)와 사랑(愛)이 가득한 네트워크(羅)
            </p>
          </FadeIn>

          <FadeIn delay={600}>
            <div className="w-24 h-1 bg-emerald-400 mx-auto"></div>
          </FadeIn>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Mountain className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">시애라란?</h2>
              </div>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-white">
                  대한민국의 <span className="font-semibold">산업계, 학계/연구기관, 정부/공공기관</span> 등의 리더들로 구성된 등산동호회입니다.
                </p>
                <p className="text-white">
                  산행을 통하여 심신을 단련하고 회원 상호간 친목과 협력을 도모합니다.
                </p>
                <p className="text-emerald-400 font-semibold text-xl pt-4 border-t border-slate-800">
                  21년의 전통을 이어온 따뜻한 문화를 공유하는 오프라인 신뢰 네트워크
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              시애라 <span className="text-emerald-400">핵심 지표</span>
            </h2>
            <p className="text-center text-white mb-16">
              21년간 이어온 시애라의 발자취
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={100}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 text-white hover:border-slate-600 transition-all duration-300">
                <Calendar className="w-12 h-12 mb-6 text-emerald-400" />
                <div className="text-6xl font-bold mb-3">228</div>
                <div className="text-white text-xl font-medium mb-2">정기산행</div>
                <div className="text-slate-400 text-sm">(해외 16회)</div>
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
                  2026년 1월 기준
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 text-white hover:border-slate-600 transition-all duration-300">
                <Users className="w-12 h-12 mb-6 text-emerald-400" />
                <div className="text-6xl font-bold mb-3">99</div>
                <div className="text-white text-xl font-medium mb-2">정회원</div>
                <div className="text-slate-400 text-sm">활동 회원</div>
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
                  2026년 1월 기준
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 text-white hover:border-slate-600 transition-all duration-300">
                <Award className="w-12 h-12 mb-6 text-emerald-400" />
                <div className="text-6xl font-bold mb-3">21</div>
                <div className="text-white text-xl font-medium mb-2">전통의 역사</div>
                <div className="text-slate-400 text-sm">변함없는 가치</div>
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
                  2005년 ~ 현재
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              <span className="text-emerald-400">산행 일정</span>
            </h2>
            <p className="text-center text-white text-lg mb-16">
              매해 <span className="font-bold">12회(매달 1회)</span>로 구성. 전문 산악인의 리드 하에 진행됩니다.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            <FadeIn delay={100}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 text-white text-2xl font-bold mb-6">
                  10
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">당일산행</h3>
                <p className="text-slate-400 text-lg">매달 둘째 토요일</p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 text-white text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">1박2일 국내산행</h3>
                <p className="text-slate-400 text-lg">2026년 6/13~14, 오대산</p>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 text-white text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">3박4일 해외산행</h3>
                <p className="text-slate-400 text-lg">2026년 10/8~11, 칭다오 라오산</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              <span className="text-emerald-400">회원 구성</span>
            </h2>
            <p className="text-center text-white mb-16">
              다양한 분야의 리더들이 함께합니다
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={100}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">CEO / 전문경영인</h3>
                </div>
                <p className="text-white text-lg leading-relaxed">
                  건설, 자동차, 석유화학, 반도체, 인공지능, 제약/바이오, 금융, 부동산, 교육, 예술 등 <span className="font-semibold">다양한 산업분야</span>
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-10 hover:border-slate-600 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Award className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">전문직</h3>
                </div>
                <p className="text-white text-lg leading-relaxed">
                  교수, 변호사, 변리사, 회계사, 세무사, 노무사, 건축사 등 <span className="font-semibold">각 분야 전문가</span>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-emerald-400">주요 연혁</span>
              </h2>
              <p className="text-white text-lg">
                21년간 이어온 시애라의 발자취
              </p>
            </div>
          </FadeIn>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700 hidden md:block"></div>

            <div className="space-y-12">
              {/* 2005 */}
              <FadeIn delay={100}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right">
                    <div className="inline-block bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">2005. 2</div>
                      <p className="text-white text-lg">
                        SERICEO의 등산동호회로 발족.<br />북한산 첫 산행.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0 z-10 border-4 border-slate-950">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              </FadeIn>

              {/* 2013 */}
              <FadeIn delay={200}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2"></div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0 z-10 border-4 border-slate-950">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="md:w-1/2">
                    <div className="inline-block bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">2013. 5</div>
                      <p className="text-white text-lg">
                        정기산행 100회 달성
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* 2022 */}
              <FadeIn delay={300}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right">
                    <div className="inline-block bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">2022. 1</div>
                      <p className="text-white text-lg">
                        SERICEO로부터 독립
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0 z-10 border-4 border-slate-950">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              </FadeIn>

              {/* 2023 */}
              <FadeIn delay={400}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2"></div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0 z-10 border-4 border-slate-950">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="md:w-1/2">
                    <div className="inline-block bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">2023. 9</div>
                      <p className="text-white text-lg">
                        정기산행 200회 달성
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-12 md:p-16 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="inline-block px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
                  <span className="text-emerald-400 text-sm font-bold tracking-wider">MEMBERSHIP</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  21년 전통의 시애라와 함께하세요
                </h2>
                <p className="text-white text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  건강한 루틴과 검증된 네트워크. 전문직·CEO·임원들이 선택한 품격 있는 교류의 장입니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-10 py-4 bg-slate-700 text-white border border-slate-600 rounded-xl font-bold text-lg hover:bg-slate-600 hover:border-slate-500 transition-all"
                  >
                    홈으로 돌아가기
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-10 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg"
                  >
                    가입 신청하기
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default AboutSierra;
