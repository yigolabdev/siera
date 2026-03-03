import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useMembers } from '../contexts/MemberContext';
import { useExecutives } from '../contexts/ExecutiveContext';
import { User, Mail, Phone, Briefcase, Building, Lock, Save, Eye, EyeOff, Camera, Trash2, Shield, Edit, Calendar, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadFile, deleteFile } from '../lib/firebase/storage';
import { formatPhoneNumberInput, removePhoneNumberHyphens, formatPhoneNumber } from '../utils/format';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getMemberPhoto } from '../utils/memberPhoto';
import { getAuthProvider } from '../lib/firebase/auth';
const Profile = () => {
  const { user, updateProfileImage, updateUser } = useAuth();
  const { refreshMembers } = useMembers();
  const { executives } = useExecutives();
  const navigate = useNavigate();
  const location = useLocation();
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
    joinDate: '',
  });
  
  // 현재 사용자의 운영진 정보 찾기
  const userExecutive = executives.find(exec => exec.memberId === user?.id);
  
  // user 정보가 로드되면 formData와 profileImage 업데이트
  useEffect(() => {
    if (user) {
      // joinDate를 YYYY-MM 형식으로 변환 (input type="month" 호환)
      let joinDateFormatted = user.joinDate || '';
      if (joinDateFormatted && !joinDateFormatted.match(/^\d{4}-\d{2}$/)) {
        // "2024-01-15" → "2024-01", "2024년 1월" → 변환 시도
        const match = joinDateFormatted.match(/(\d{4})[-년./\s]*(\d{1,2})/);
        if (match) {
          joinDateFormatted = `${match[1]}-${match[2].padStart(2, '0')}`;
        }
      }

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : '',
        gender: user.gender || '',
        birthYear: user.birthYear || '',
        company: user.company || '',
        position: user.position || '',
        referredBy: user.referredBy || '',
        hikingLevel: user.hikingLevel || '',
        bio: user.bio || '',
        joinDate: joinDateFormatted,
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  // 편집 페이지에서 돌아왔을 때 크롭된 이미지 처리
  useEffect(() => {
    const state = location.state as { croppedImage?: Blob; shouldUpload?: boolean } | null;
    if (state?.croppedImage && state?.shouldUpload) {
      console.log('🖼️ [Profile] 크롭된 이미지 수신:', {
        size: state.croppedImage.size,
        type: state.croppedImage.type,
      });
      
      // Blob을 File 객체로 변환
      const croppedFile = new File(
        [state.croppedImage], 
        `profile_${Date.now()}.jpg`,
        {
          type: 'image/jpeg',
          lastModified: Date.now(),
        }
      );
      
      console.log('📁 [Profile] File 변환 완료:', {
        name: croppedFile.name,
        size: croppedFile.size,
        type: croppedFile.type,
      });
      
      // 선택된 파일 저장
      setSelectedFile(croppedFile);
      
      // 미리보기 설정
      const previewUrl = URL.createObjectURL(state.croppedImage);
      setProfileImage(previewUrl);
      
      console.log('✅ [Profile] 미리보기 URL 생성:', previewUrl);
      
      // state 초기화
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);
  
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
      // 파일 크기 체크 (30MB 제한)
      if (file.size > 30 * 1024 * 1024) {
        alert('파일 크기는 30MB를 초과할 수 없습니다.');
        return;
      }
      
      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      // 원본 이미지 읽기 후 편집 페이지로 이동
      const reader = new FileReader();
      reader.onloadend = () => {
        navigate('/home/profile/edit-photo', { 
          state: { imageSrc: reader.result as string } 
        });
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
    
    setIsSaving(true);
    try {
      // 1. 프로필 이미지 업로드 (선택된 파일이 있는 경우)
      let imageUrl = profileImage;
      
      if (selectedFile) {
        console.log('📤 [Profile] 이미지 업로드 시작:', {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        });
        
        const imagePath = `profiles/${user.id}/profile_${Date.now()}.jpg`;
        
        // 기존 이미지 삭제
        if (user.profileImage && user.profileImage.includes('firebase')) {
          const oldImagePath = `profiles/${user.id}/profile.jpg`;
          await deleteFile(oldImagePath).catch(err => {
            console.log('⚠️ [Profile] 기존 이미지 삭제 실패 (무시):', err);
          });
        }
        
        // 새 이미지 업로드
        console.log('⏳ [Profile] Firebase Storage 업로드 중...');
        const uploadResult = await uploadFile(imagePath, selectedFile);
        
        console.log('📦 [Profile] 업로드 결과:', uploadResult);
        
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          console.log('✅ [Profile] 이미지 업로드 성공:', imageUrl);
        } else {
          console.error('❌ [Profile] 이미지 업로드 실패:', uploadResult.error);
          throw new Error(uploadResult.error || '이미지 업로드 실패');
        }
      }
      
      // 2. 프로필 정보 업데이트
      const updateData: Record<string, any> = {
        name: formData.name,
        email: formData.email,
        phoneNumber: removePhoneNumberHyphens(formData.phone),
        gender: formData.gender,
        birthYear: formData.birthYear,
        company: formData.company,
        position: formData.position,
        referredBy: formData.referredBy,
        hikingLevel: formData.hikingLevel,
        bio: formData.bio,
        joinDate: formData.joinDate,
      };
      
      // profileImage가 있을 때만 포함 (undefined 제거)
      if (imageUrl && imageUrl.includes('firebase')) {
        updateData.profileImage = imageUrl;
      }
      
      console.log('📤 [Profile] Firestore 업데이트 요청:', updateData);
      
      await updateUser(updateData);
      
      console.log('✅ [Profile] 프로필 업데이트 완료');
      
      // MemberContext 데이터 새로고침 (Admin/MemberManagement 페이지 동기화)
      console.log('🔄 [Profile] MemberContext 새로고침 시작...');
      await refreshMembers();
      console.log('✅ [Profile] MemberContext 새로고침 완료');
      
      setSelectedFile(null);
      alert('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error: any) {
      console.error('❌ [Profile] 프로필 저장 실패:', error);
      
      // 상세한 에러 메시지
      let errorMessage = '프로필 저장에 실패했습니다.';
      if (error.code) {
        errorMessage += `\n\n오류 코드: ${error.code}`;
      }
      if (error.message) {
        errorMessage += `\n오류 내용: ${error.message}`;
      }
      
      // Firebase Storage 권한 에러
      if (error.code === 'storage/unauthorized') {
        errorMessage += '\n\n💡 해결 방법: 로그아웃 후 다시 로그인해주세요.';
      }
      
      alert(errorMessage);
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
      
      {/* Profile Image */}
      <Card className="mb-6 hover:shadow-xl transition-all">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg ring-4 ring-slate-100">
              {getMemberPhoto(user?.name || '', profileImage, user?.phoneNumber) ? (
                <img 
                  src={getMemberPhoto(user?.name || '', profileImage, user?.phoneNumber)!} 
                  alt="Profile" 
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <User className="h-16 w-16 text-white" />
              )}
            </div>
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
                <Calendar className="w-4 h-4 text-primary-600" />
                입회일
              </label>
              <input
                type="month"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="input-field"
                max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                min="2005-01"
              />
              <p className="text-xs text-slate-500 mt-1">시애라 클럽에 입회한 년/월을 선택해주세요</p>
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
      
      {/* 보안 / 비밀번호 섹션 */}
      <Card className="hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-7 h-7 text-red-600" />
              계정 보안
            </h2>
            <p className="text-slate-600">로그인 및 보안 정보를 확인하세요</p>
          </div>
          {getAuthProvider() === 'email' && !isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-4 py-2 bg-primary-100 text-primary-700 border-2 border-primary-200 rounded-xl font-semibold hover:bg-primary-200 active:scale-[0.98] transition-all"
            >
              비밀번호 변경
            </button>
          )}
        </div>
        
        {/* Google 로그인 사용자 */}
        {getAuthProvider() === 'google' && (
          <div className="text-center py-6 sm:py-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <p className="text-slate-700 font-semibold mb-1">Google 계정으로 로그인 중</p>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            <Card className="bg-green-50 border border-green-200 text-left">
              <p className="text-sm text-green-800">
                Google 계정의 보안 설정(2단계 인증 등)이 적용됩니다.
                비밀번호는 Google 계정에서 직접 관리하세요.
              </p>
            </Card>
          </div>
        )}

        {/* 휴대폰 로그인 사용자 */}
        {getAuthProvider() === 'phone' && (
          <div className="text-center py-6 sm:py-8">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">휴대폰 인증으로 로그인 중</p>
            <p className="text-sm text-slate-500 mb-4">{user?.phoneNumber}</p>
            <Card className="bg-green-50 border border-green-200 text-left">
              <p className="text-sm text-green-800">
                매 로그인 시 SMS 인증코드를 통해 본인 확인이 진행됩니다.
                별도의 비밀번호가 필요하지 않습니다.
              </p>
            </Card>
          </div>
        )}

        {/* 이메일/비밀번호 로그인 사용자 */}
        {getAuthProvider() === 'email' && (
          <>
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
          </>
        )}

        {/* 알 수 없는 인증 방식 */}
        {getAuthProvider() === 'unknown' && (
          <div className="text-center py-6 sm:py-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-sm text-slate-500">인증 정보를 확인할 수 없습니다.</p>
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
