import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-slate-300 block mb-1">SIERRA 산악회</span>
          <p>Since 2005. High-Trust Hiking Club for Leaders.</p>
        </div>
        
        <div className="flex flex-col md:items-end text-center md:text-right space-y-2">
          <div className="flex gap-4 justify-center md:justify-end">
            <Link to="/" className="hover:text-white transition-colors">회원 로그인</Link>
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors font-bold">개인정보처리방침</a>
          </div>
          <p>
            개인정보는 가입 심사 및 운영 연락 목적으로만 수집되며,<br className="md:hidden"/> 탈퇴 시 즉시 파기됩니다.
          </p>
          <p className="opacity-50">© 2025 SIERRA Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
