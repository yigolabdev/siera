import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useMembers } from '../contexts/MemberContext';
import { useExecutives } from '../contexts/ExecutiveContext';
import { User, Mail, Phone, Briefcase, Building, Lock, Save, Eye, EyeOff, Camera, Trash2, Shield, Edit, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadFile, deleteFile } from '../lib/firebase/storage';
import { formatPhoneNumberInput, removePhoneNumberHyphens, formatPhoneNumber } from '../utils/format';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Profile = () => {
  const { user, updateProfileImage, updateUser } = useAuth();
  const { refreshMembers } = useMembers();
  const { executives } = useExecutives();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthYear: '',
    company: '',
    position: '',
    referredBy: '',
    hikingLevel: '',
    bio: '',
  });
  
  // 현재 사용자의 운영진 정보 찾기
  const userExecutive = executives.find(exec => exec.memberId === user?.id);
  
  // user 정보가 로드되면 formData와 profileImage 업데이트
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : '', // DB 값을 포맷팅하여 표시
        gender: user.gender || '',
        birthYear: user.birthYear || '',
        company: user.company || '',
        position: user.position || '',
        referredBy: user.referredBy || '',
        hikingLevel: user.hikingLevel || '',
        bio: user.bio || '',
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumberInput(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

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
      
      // 선택된 파일 저장
      setSelectedFile(file);
      
      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = async () => {
    if (!user) return;
    
    setIsUploadingImage(true);
    try {
      // Firebase Storage에서 기존 이미지 삭제
      if (user.profileImage && user.profileImage.includes('firebase')) {
        const imagePath = `profiles/${user.id}/profile.jpg`;
        await deleteFile(imagePath);
      }
      
      // 프로필 이미지 제거
      await updateProfileImage(null);
      
      setProfileImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      alert('프로필 이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
    }
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSaveProfile = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    console.log('💾 프로필 저장 시작');
    console.log('현재 user:', user);
    console.log('저장할 formData:', formData);
    
    setIsSaving(true);
    try {
      // 1. 프로필 이미지 업로드 (선택된 파일이 있는 경우)
      let imageUrl = profileImage;
      
      if (selectedFile) {
        console.log('📤 프로필 이미지 업로드 시작...');
        const imagePath = `profiles/${user.id}/profile.jpg`;
        
        // 기존 이미지 삭제
        if (user.profileImage && user.profileImage.includes('firebase')) {
          await deleteFile(imagePath).catch(err => console.log('기존 이미지 삭제 실패 (무시):', err));
        }
        
        // 새 이미지 업로드
        const uploadResult = await uploadFile(imagePath, selectedFile);
        
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          console.log('✅ 이미지 업로드 성공:', imageUrl);
        } else {
          throw new Error('이미지 업로드 실패');
        }
      }
      
      // 2. 프로필 정보 업데이트
      const updateData: Record<string, any> = {
        name: formData.name,
        email: formData.email,
        phoneNumber: removePhoneNumberHyphens(formData.phone), // 하이픈 제거 후 저장
        gender: formData.gender,
        birthYear: formData.birthYear,
        company: formData.company,
        position: formData.position,
        referredBy: formData.referredBy,
        hikingLevel: formData.hikingLevel,
        bio: formData.bio,
      };
      
      // profileImage가 있을 때만 포함 (undefined 제거)
      if (imageUrl) {
        updateData.profileImage = imageUrl;
      }
      
      console.log('📤 Firestore 업데이트 요청:', updateData);
      
      await updateUser(updateData);
      
      console.log('✅ 프로필 업데이트 완료');
      
      // MemberContext 데이터 새로고침 (Admin/MemberManagement 페이지 동기화)
      console.log('🔄 MemberContext 새로고침 시작...');
      await refreshMembers();
      console.log('✅ MemberContext 새로고침 완료');
      
      setSelectedFile(null);
      alert('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error: any) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.\n\n' + (error.message || '다시 시도해주세요.'));
    } finally {
      setIsSaving(false);
    }
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
        <h1 className="text-4xl font-bold text-slate-900 mb-3">프로필 설정</h1>
        <p className="text-xl text-slate-600">
          회원 정보를 수정하고 관리하세요.
        </p>
      </div>
      
      {/* Profile Image */}
      <Card className="mb-6 hover:shadow-xl transition-all">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg ring-4 ring-slate-100">
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
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 active:scale-95 transition-all ring-4 ring-white"
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
            <p className="text-slate-900 font-bold text-xl">{user?.name || '게스트'}</p>
            <p className="text-slate-600">{user?.email || 'email@example.com'}</p>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleImageClick}
              className="btn-primary flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              사진 변경
            </button>
            {profileImage && (
              <button
                onClick={handleRemoveImage}
                disabled={isUploadingImage || isSaving}
                className="px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-semibold hover:bg-red-100 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    사진 삭제
                  </>
                )}
              </button>
            )}
          </div>
          
          <Badge variant="info" className="mt-3">
            JPG, PNG, GIF 형식 지원 (최대 5MB)
          </Badge>
        </div>
      </Card>
      
      {/* Profile Information */}
      <Card className="mb-6 hover:shadow-xl transition-all">
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Edit className="w-7 h-7 text-primary-600" />
            기본 정보
          </h2>
          <p className="text-slate-600">개인 정보를 업데이트하세요</p>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                이름 <Badge variant="danger">필수</Badge>
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
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Mail className="w-4 h-4 text-primary-600" />
                이메일 <Badge variant="danger">필수</Badge>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="admin@siera.com"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Phone className="w-4 h-4 text-primary-600" />
                연락처 <Badge variant="danger">필수</Badge>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="input-field"
                placeholder="010-1234-5678"
                maxLength={13}
              />
            </div>
            
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                성별 <Badge variant="danger">필수</Badge>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="input-field"
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                출생연도 <Badge variant="danger">필수</Badge>
              </label>
              <input
                type="text"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="input-field"
                placeholder="1990"
                maxLength={4}
              />
            </div>
            
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                입회일자
              </label>
              <input
                type="text"
                value={user?.joinDate || '-'}
                className="input-field bg-slate-100 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="text-xs text-slate-500 mt-1">입회일자는 수정할 수 없습니다</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Building className="w-4 h-4 text-primary-600" />
                소속
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
                placeholder="Yigo Lab"
              />
            </div>
            
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary-600" />
                직책 (직장)
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="input-field"
                placeholder="예: 대표이사, 전무, 부장 등"
              />
            </div>
          </div>
          
          {/* 시애라 클럽 운영진 정보 (있는 경우에만 표시) */}
          {userExecutive && (
            <div className="pt-4">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-emerald-900">시애라 클럽 운영진</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-emerald-700 font-semibold">직책:</span>
                    <span className="ml-2 text-emerald-900">{userExecutive.position}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-semibold">구분:</span>
                    <span className="ml-2 text-emerald-900">
                      {userExecutive.category === 'chairman' ? '회장단' : '운영위원'}
                    </span>
                  </div>
                  {userExecutive.startTerm && userExecutive.endTerm && (
                    <div className="col-span-2">
                      <span className="text-emerald-700 font-semibold">임기:</span>
                      <span className="ml-2 text-emerald-900">
                        {userExecutive.startTerm} ~ {userExecutive.endTerm}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-emerald-600 mt-2">
                  운영진 정보는 운영진 관리 페이지에서 수정할 수 있습니다
                </p>
              </div>
            </div>
          )}
          
          {/* 산행 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                추천인
              </label>
              <input
                type="text"
                value={formData.referredBy}
                onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                className="input-field"
                placeholder="시애라 회원 이름 (선택)"
              />
              <p className="text-xs text-slate-500 mt-1">가입 시 추천인을 입력하셨다면 표시됩니다</p>
            </div>
            
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                산행능력
              </label>
              <select
                value={formData.hikingLevel}
                onChange={(e) => setFormData({ ...formData, hikingLevel: e.target.value })}
                className="input-field"
              >
                <option value="">선택하세요</option>
                <option value="beginner">초급 - 둘레길, 낮은 산 (2~3시간)</option>
                <option value="intermediate">중급 - 일반 산행 (4~5시간)</option>
                <option value="advanced">상급 - 장시간 산행 (6시간 이상)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">본인의 체력 수준에 맞는 산행능력을 선택해주세요</p>
            </div>
          </div>
          
          <div>
            <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
              <User className="w-4 h-4 text-primary-600" />
              자기소개
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field"
              rows={4}
              placeholder="간단한 자기소개를 작성해주세요. 경력, 관심사, 산행 경험 등을 자유롭게 작성하실 수 있습니다."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-slate-500">
                자기소개는 회원명부에서 다른 회원들에게 공개됩니다.
              </p>
              <p className="text-sm text-slate-500">
                {formData.bio.length}/500
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving || isUploadingImage}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                프로필 저장
              </>
            )}
          </button>
        </div>
      </Card>
      
      {/* Password Change */}
      <Card className="hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-7 h-7 text-red-600" />
              비밀번호 변경
            </h2>
            <p className="text-slate-600">보안을 위해 주기적으로 변경하세요</p>
          </div>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-4 py-2 bg-primary-100 text-primary-700 border-2 border-primary-200 rounded-xl font-semibold hover:bg-primary-200 active:scale-[0.98] transition-all"
            >
              비밀번호 변경
            </button>
          )}
        </div>
        
        {isEditingPassword ? (
          <div className="space-y-5">
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                현재 비밀번호 <Badge variant="danger">필수</Badge>
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                새 비밀번호 <Badge variant="danger">필수</Badge>
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="flex text-slate-700 font-semibold mb-2 items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                새 비밀번호 확인 <Badge variant="danger">필수</Badge>
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <Card className="bg-blue-50 border-2 border-blue-200">
              <p className="text-sm text-blue-900 font-bold mb-2">비밀번호 안전 수칙</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ 최소 8자 이상</li>
                <li>✓ 영문, 숫자, 특수문자 조합 권장</li>
                <li>✓ 다른 사이트와 다른 비밀번호 사용</li>
              </ul>
            </Card>
            
            <div className="flex gap-4 pt-4">
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
          <div className="text-center py-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">비밀번호를 변경하려면 위의 버튼을 클릭하세요</p>
          </div>
        )}
      </Card>
      
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
