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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">프로필 설정</h1>
        <p className="text-xl text-gray-600">
          회원 정보를 수정하고 관리하세요.
        </p>
      </div>
      
      {/* Profile Image */}
      <div className="card mb-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-600 to-blue-600 flex items-center justify-center shadow-lg">
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
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors"
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
            <p className="text-gray-700 font-medium text-lg">{user?.name || '게스트'}</p>
            <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleImageClick}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>사진 변경</span>
            </button>
            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>사진 삭제</span>
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            JPG, PNG, GIF 형식 지원 (최대 5MB)
          </p>
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>
            <p className="text-gray-600">개인 정보를 업데이트하세요</p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>이름 <span className="text-red-500">*</span></span>
                </div>
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
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>이메일 <span className="text-red-500">*</span></span>
                </div>
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
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>연락처 <span className="text-red-500">*</span></span>
                </div>
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
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>회사/기관</span>
                </div>
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
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>직업</span>
                </div>
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
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>직책</span>
                </div>
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
        
        <div className="flex justify-end mt-6 pt-6 border-t">
          <button
            onClick={handleSaveProfile}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>프로필 저장</span>
          </button>
        </div>
      </div>
      
      {/* Password Change */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">비밀번호 변경</h2>
              <p className="text-gray-600">보안을 위해 주기적으로 변경하세요</p>
            </div>
          </div>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              비밀번호 변경
            </button>
          )}
        </div>
        
        {isEditingPassword ? (
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">비밀번호 안전 수칙</p>
              <ul className="text-sm text-blue-700 space-y-1">
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
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium text-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Lock className="h-5 w-5" />
                <span>비밀번호 변경</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            비밀번호를 변경하려면 위의 버튼을 클릭하세요
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          ← 뒤로 가기
        </button>
      </div>
    </div>
  );
};

export default Profile;

