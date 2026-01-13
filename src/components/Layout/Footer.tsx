import { Mountain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Club Info */}
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-white" />
            <span className="text-base font-semibold text-white">시애라 (Sierra)</span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white hover:text-primary-400 transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-white hover:text-primary-400 transition-colors">
              이용약관
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-white">
            &copy; 2026 시애라. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

