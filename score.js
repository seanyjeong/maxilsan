// jQuery와 Papa.parse 라이브러리가 필요합니다.
// HTML 파일에 다음 두 줄을 추가하세요.
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>

let silgiallData;
let silgiData;

Promise.all([
    fetch('https://raw.githubusercontent.com/seanyjeong/maxilsan/main/silgiall.csv')
        .then(response => response.text())
        .then(data => {
            // silgiall.csv 데이터를 파싱하고 silgiallData 변수에 저장
            silgiallData = Papa.parse(data, { header: true }).data;
        }),
    fetch('https://raw.githubusercontent.com/seanyjeong/maxilsan/main/silgi.csv')
        .then(response => response.text())
        .then(data => {
            // silgi.csv 데이터를 파싱하고 silgiData 변수에 저장
            silgiData = Papa.parse(data, { header: true }).data;
        })
]).then(() => {
    // 모든 데이터가 로드되었을 때 실행할 코드
    $('input').on('input', function() {
        // 입력 칸의 값(기록)을 가져옴
        let record = $(this).val();

        // 기록에 따른 점수를 계산
        let score;
        let groups = ['가군', '나군', '다군'];

        for (let g = 0; g < groups.length; g++) {
            let 대학명 = $('#' + groups[g] + '-대학명').text();
            let 학과명 = $('#' + groups[g] + '-학과명').text();

            // silgiall.csv에서 해당 대학의 코드 번호를 찾음
            let 코드번호;
            for (let i = 0; i < silgiallData.length; i++) {
                if (silgiallData[i]['대학명'] === 대학명 && silgiallData[i]['학과명'] === 학과명) {
                    코드번호 = silgiallData[i]['코드번호'];
                    break;
                }
            }

            // silgi.csv에서 해당하는 모든 데이터를 가져옴
            for (let i = 0; i < silgiData.length; i++) {
                if (silgiData[i]['코드번호'] === 코드번호) {
                    let 남학생기록 = parseFloat(silgiData[i]['남학생기록']);
                    let 여학생기록 = parseFloat(silgiData[i]['여학생기록']);
                    let 점수 = parseFloat(silgiData[i]['점수']);

                    if (!isNaN(남학생기록) && !isNaN(여학생기록) && !isNaN(점수)) {
                        if (record >= 남학생기록 && record <= 여학생기록) {
                            score = 점수;
                            break;
                        }
                    }
                }
            }

            // 계산된 점수를 입력 칸 옆에 표시
            $(this).next().text(score);
        }
    });
});
