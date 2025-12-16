import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Briefcase, Building, Lock, Save, Eye, EyeOff, Camera, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '010-1234-5678',
    occupation: '○○그룹',
    position: '회장',
    company: '○○그룹',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      
      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setProfileImage(null);
    updateProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSaveProfile = () => {
    // 프로필 이미지 저장
    if (profileImage) {
      updateProfileImage(profileImage);
    }
    // TODO: 실제 프로필 업데이트 로직 (이미지 및 기타 정보 포함)
    alert('프로필이 성공적으로 업데이트되었습니다.');
  };
  
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    
    // TODO: 실제 비밀번호 변경 로직
    alert('비밀번호가 성공적으로 변경되었습니다.');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsEditingPassword(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">프로필 설정</h1>
        <p className="text-lg text-slate-600">
          회원 정보를 수정하고 관리하세요.
        </p>
      </div>
      
      {/* Profile Image */}
      <div className="card mb-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center shadow-card">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-white" />
              )}
            </div>
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-card hover:bg-primary-700 active:scale-95 transition-all"
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div className="mt-4 text-center">
            <p className="text-slate-900 font-semibold text-lg">{user?.name || '게스트'}</p>
            <p className="text-slate-600 text-sm">{user?.email || 'email@example.com'}</p>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleImageClick}
              className="btn-primary text-sm"
            >
              사진 변경
            </button>
            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 active:scale-[0.98] transition-all"
              >
                사진 삭제
              </button>
            )}
          </div>
          
          <p className="text-xs text-slate-500 mt-3">
            JPG, PNG, GIF 형식 지원 (최대 5MB)
          </p>
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="card mb-6">
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">기본 정보</h2>
          <p className="text-slate-600">개인 정보를 업데이트하세요</p>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="홍길동"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="email@example.com"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="010-1234-5678"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                회사/기관
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
                placeholder="○○그룹"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                직업
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="input-field"
                placeholder="대표이사"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                직책
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="input-field"
                placeholder="회장"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={handleSaveProfile}
            className="btn-primary"
          >
            프로필 저장
          </button>
        </div>
      </div>
      
      {/* Password Change */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">비밀번호 변경</h2>
            <p className="text-slate-600">보안을 위해 주기적으로 변경하세요</p>
          </div>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-200 active:scale-[0.98] transition-all"
            >
              비밀번호 변경
            </button>
          )}
        </div>
        
        {isEditingPassword ? (
          <div className="space-y-5">
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                현재 비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-field pr-10"
                  placeholder="현재 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                새 비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field pr-10"
                  placeholder="새 비밀번호 (최소 8자)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">
                새 비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field pr-10"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-900 font-medium mb-2">비밀번호 안전 수칙</p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• 최소 8자 이상</li>
                <li>• 영문, 숫자, 특수문자 조합 권장</li>
                <li>• 다른 사이트와 다른 비밀번호 사용</li>
              </ul>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="flex-1 btn-secondary"
              >
                취소
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 btn-primary"
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            비밀번호를 변경하려면 위의 버튼을 클릭하세요
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          ← 뒤로 가기
        </button>
      </div>
    </div>
  );
};

export default Profile;

