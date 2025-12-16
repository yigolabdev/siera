import { Mountain, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-mountain-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-primary-400" />
              <h3 className="text-xl font-bold">시애라</h3>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              품격있는 등산 문화를 선도하는<br />
              프리미엄 산악회입니다.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">연락처</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span className="text-base">02-1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span className="text-base">info@cheongsanhoi.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span className="text-base">서울특별시 강남구</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">안내</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary-400 transition-colors text-base">회칙</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors text-base">입회 안내</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors text-base">산행 규칙</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors text-base">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-mountain-700 mt-8 pt-8 text-center text-gray-400 text-base">
          <p>&copy; 2026 시애라. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

