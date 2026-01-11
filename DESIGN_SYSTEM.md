# 🎨 시애라 산악회 디자인 시스템

> **Version 1.0** - 2026년 1월  
> 메인 랜딩 페이지를 기준으로 한 전체 애플리케이션 디자인 가이드

---

## 📐 디자인 원칙

### 1. **심플하고 고급스러운 (Simple & Premium)**
- 불필요한 장식 없이 핵심에 집중
- 충분한 여백과 공간감
- 깔끔한 타이포그래피

### 2. **일관성 (Consistency)**
- 모든 페이지에서 동일한 컴포넌트 사용
- 통일된 색상 팔레트
- 반복적인 패턴과 레이아웃

### 3. **가독성 우선 (Readability First)**
- 명확한 계층 구조
- 충분한 대비(Contrast)
- 읽기 편한 폰트 크기

---

## 🎨 색상 시스템 (Color Palette)

### **Primary Colors (주요 색상)**
```css
/* Background */
--bg-dark: #020617          /* slate-950 - 다크 배경 */
--bg-darker: #0f172a        /* slate-900 - 카드, 컨테이너 */
--bg-light: #f8fafc         /* slate-50 - 밝은 배경 */
--bg-white: #ffffff         /* white - 카드, 입력 필드 */

/* Text */
--text-primary: #ffffff     /* white - 다크 배경 위 텍스트 */
--text-secondary: #cbd5e1   /* slate-300 - 서브 텍스트 (다크) */
--text-dark: #0f172a        /* slate-900 - 밝은 배경 위 텍스트 */
--text-muted: #64748b       /* slate-500 - 서브 텍스트 (밝음) */

/* Accent (강조 색상) */
--accent-emerald: #10b981   /* emerald-500 - 성공, 승인, 긍정 */
--accent-blue: #3b82f6      /* blue-500 - 정보, 링크 */
--accent-yellow: #eab308    /* yellow-500 - 경고, 대기 */
--accent-red: #ef4444       /* red-500 - 오류, 거절, 삭제 */
```

### **Semantic Colors (의미적 색상)**
```css
/* Success */
--success-bg: #dcfce7       /* green-100 */
--success-text: #166534     /* green-800 */
--success-border: #bbf7d0   /* green-200 */

/* Warning */
--warning-bg: #fef3c7       /* yellow-100 */
--warning-text: #92400e     /* yellow-800 */
--warning-border: #fde68a   /* yellow-200 */

/* Error/Danger */
--danger-bg: #fee2e2        /* red-100 */
--danger-text: #991b1b      /* red-800 */
--danger-border: #fecaca    /* red-200 */

/* Info */
--info-bg: #dbeafe          /* blue-100 */
--info-text: #1e40af        /* blue-800 */
--info-border: #bfdbfe      /* blue-200 */
```

---

## 🔤 타이포그래피 (Typography)

### **폰트 스케일**
```css
/* Headings */
--text-h1: 3.75rem / 60px     /* text-6xl */
--text-h2: 2.25rem / 36px     /* text-4xl */
--text-h3: 1.875rem / 30px    /* text-3xl */
--text-h4: 1.5rem / 24px      /* text-2xl */
--text-h5: 1.25rem / 20px     /* text-xl */
--text-h6: 1.125rem / 18px    /* text-lg */

/* Body */
--text-base: 1rem / 16px      /* text-base */
--text-sm: 0.875rem / 14px    /* text-sm */
--text-xs: 0.75rem / 12px     /* text-xs */
```

### **폰트 두께 (Font Weight)**
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### **사용 예시**
```tsx
// Page Title
<h1 className="text-4xl font-bold text-slate-900">페이지 제목</h1>

// Section Title
<h2 className="text-3xl font-semibold text-slate-900">섹션 제목</h2>

// Card Title
<h3 className="text-xl font-bold text-slate-900">카드 제목</h3>

// Body Text
<p className="text-base text-slate-700">본문 텍스트</p>

// Caption/Helper
<p className="text-sm text-slate-500">부가 설명</p>
```

---

## 📦 레이아웃 시스템 (Layout)

### **컨테이너 (Container)**
```tsx
// Max Width + Horizontal Padding
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Content */}
</div>
```

### **간격 (Spacing)**
```css
/* Section Padding */
--section-py: py-24 md:py-32   /* 96px - 128px */

/* Card Padding */
--card-padding: p-6             /* 24px */

/* Element Gaps */
--gap-xs: gap-2                 /* 8px */
--gap-sm: gap-4                 /* 16px */
--gap-md: gap-6                 /* 24px */
--gap-lg: gap-8                 /* 32px */
--gap-xl: gap-12                /* 48px */
```

### **Grid System**
```tsx
// 통계 카드 (4열)
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">

// 카드 리스트 (3열)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 2열 폼
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

---

## 🧱 컴포넌트 (Components)

### **1. Card (카드)**
```tsx
// Basic Card
<Card className="hover:shadow-lg transition-all">
  {/* Content */}
</Card>

// Colored Card (Info)
<Card className="bg-blue-50 border-blue-200">
  {/* Content */}
</Card>

// Colored Card (Success)
<Card className="bg-green-50 border-green-200">
  {/* Content */}
</Card>
```

**속성:**
- `bg-white` - 기본 배경
- `rounded-xl` - 12px 둥근 모서리
- `shadow-md` - 중간 그림자
- `p-6` - 24px 패딩
- `border border-slate-100` - 얇은 테두리

---

### **2. Button (버튼)**

#### **Primary Button**
```tsx
<button className="btn-primary flex items-center gap-2">
  <Icon className="w-5 h-5" />
  <span>버튼 텍스트</span>
</button>
```
- **용도**: 주요 액션 (저장, 확인, 제출)
- **스타일**: `bg-primary-600 text-white rounded-xl`

#### **Secondary Button**
```tsx
<button className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300">
  취소
</button>
```
- **용도**: 보조 액션 (취소, 닫기)

#### **Danger Button**
```tsx
<button className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">
  삭제
</button>
```
- **용도**: 위험한 액션 (삭제, 거절)

#### **Success Button**
```tsx
<button className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
  승인
</button>
```
- **용도**: 긍정적 액션 (승인, 완료)

#### **Icon Button**
```tsx
<button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
  <Edit className="w-5 h-5" />
</button>
```
- **용도**: 아이콘만 표시 (수정, 삭제, 상세보기)

---

### **3. Badge (배지)**
```tsx
// Success
<Badge variant="success">승인완료</Badge>

// Warning
<Badge variant="warning">승인대기</Badge>

// Danger
<Badge variant="danger">거절됨</Badge>

// Info
<Badge variant="info">운영진</Badge>

// Primary
<Badge variant="primary">일반회원</Badge>
```

---

### **4. Input Field (입력 필드)**
```tsx
<div>
  <label className="block text-slate-700 font-medium mb-2">
    라벨 <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    className="input-field"
    placeholder="입력하세요..."
  />
</div>
```

**스타일:**
- `border border-slate-300`
- `rounded-xl`
- `px-4 py-3`
- `focus:ring-2 focus:ring-primary-500`

---

### **5. Search Bar (검색 바)**
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
  <input
    type="text"
    placeholder="검색..."
    className="input-field pl-10"
  />
</div>
```

---

### **6. Filter Buttons (필터 버튼)**
```tsx
<div className="flex gap-2">
  <button
    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
      active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
    }`}
  >
    전체
  </button>
</div>
```

---

### **7. Stats Card (통계 카드)**
```tsx
<Card className="text-center">
  <div className="flex items-center justify-center mb-2">
    <Icon className="w-6 h-6 text-slate-600" />
  </div>
  <p className="text-slate-600 text-sm mb-1">라벨</p>
  <p className="text-3xl font-bold text-slate-900">123명</p>
</Card>
```

---

### **8. Info Notice (안내 박스)**
```tsx
<Card className="bg-blue-50 border-blue-200">
  <div className="flex items-start gap-3">
    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">제목</h3>
      <ul className="text-sm text-slate-700 space-y-1">
        <li>• 안내 항목 1</li>
        <li>• 안내 항목 2</li>
      </ul>
    </div>
  </div>
</Card>
```

---

## 🖼️ 다크 섹션 스타일 (Dark Sections)

### **다크 배경 사용 예시**
```tsx
<section className="py-24 md:py-32 bg-slate-950 text-white">
  <div className="max-w-7xl mx-auto px-6">
    {/* Dark themed content */}
  </div>
</section>
```

### **다크 카드 스타일**
```tsx
<div className="border border-slate-800 bg-slate-900/50 p-6 rounded-xl">
  {/* Dark card content */}
</div>
```

---

## 🎭 애니메이션 (Animation)

### **FadeIn 애니메이션**
```tsx
import { FadeIn } from '../../components/ui/FadeIn';

<FadeIn delay={200}>
  {/* Animated content */}
</FadeIn>
```

### **Hover 효과**
```css
/* Button Hover */
hover:bg-slate-700 transition-all

/* Card Hover */
hover:shadow-lg transition-all

/* Scale on Click */
active:scale-[0.98] transition-all
```

---

## 📱 반응형 디자인 (Responsive)

### **Breakpoints**
```css
sm:   640px   /* Small devices */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large screens */
```

### **반응형 패턴**
```tsx
// Typography
<h1 className="text-4xl md:text-6xl lg:text-7xl">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Spacing
<div className="py-24 md:py-32">

// Flex Direction
<div className="flex flex-col lg:flex-row">
```

---

## 🔍 사용 예시 (Usage Examples)

### **페이지 구조 템플릿**
```tsx
function PageName() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">페이지 제목</h1>
        <p className="text-xl text-slate-600">페이지 설명</p>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          {/* Stats content */}
        </Card>
      </div>

      {/* 3. Filters */}
      <Card className="mb-6">
        {/* Filter buttons */}
      </Card>

      {/* 4. Main Content */}
      <div className="space-y-4">
        {/* Content cards */}
      </div>

      {/* 5. Info Notice */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        {/* Notice content */}
      </Card>
    </div>
  );
}
```

---

## ✅ 체크리스트 (Checklist)

새 페이지나 컴포넌트 작성 시 확인 사항:

- [ ] `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` 컨테이너 사용
- [ ] 일관된 간격 (`gap-4`, `gap-6`, `gap-8`)
- [ ] 정의된 색상 팔레트만 사용
- [ ] Card 컴포넌트 활용
- [ ] Badge 컴포넌트로 상태 표시
- [ ] 아이콘 + 텍스트 조합 버튼
- [ ] 반응형 그리드 (`md:grid-cols-*`)
- [ ] hover 효과 추가
- [ ] 충분한 텍스트 대비
- [ ] 모바일 우선 디자인

---

## 🚫 하지 말아야 할 것들 (Don'ts)

1. **임의의 색상 사용 금지**
   - ❌ `bg-pink-500`
   - ✅ 정의된 색상 팔레트 사용

2. **불규칙한 간격**
   - ❌ `mt-7`, `px-5`
   - ✅ Tailwind 표준 간격 (`mt-6`, `px-4`)

3. **다양한 border-radius**
   - ❌ `rounded-sm`, `rounded-2xl`, `rounded-3xl` 혼용
   - ✅ `rounded-xl` 통일

4. **불필요한 애니메이션**
   - ❌ 과도한 bounce, spin 효과
   - ✅ 부드러운 transition

5. **텍스트 가독성 무시**
   - ❌ 흰 배경에 연한 회색 텍스트
   - ✅ 충분한 대비 확보

---

## 📚 참고 자료

- Tailwind CSS Documentation: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- React Router: https://reactrouter.com

---

**Last Updated**: 2026-01-12  
**Maintained by**: 시애라 산악회 개발팀
