양정 아틀리에933 INSIGHTS 404 일괄수정

1. 이 ZIP을 압축 해제합니다.
2. fix-insights-link.ps1 파일을 양정 아틀리에933 로컬 저장소 최상위 폴더
   (index.html, style.css 등이 있는 폴더)에 넣습니다.
3. fix-insights-link.ps1 우클릭 → PowerShell에서 실행
4. 완료 후 fix-insights-link.ps1 파일은 삭제합니다.
5. GitHub Desktop에서 변경된 HTML 파일들을 확인합니다.
6. Summary 예: Fix insights links
7. Commit to main → Push origin

수정하는 내용은 딱 하나입니다.
href="insights.html"
→
href="index.html#insights"

페이지 본문, 제목, 디자인, CSS, 상담팝업 코드는 건드리지 않습니다.
