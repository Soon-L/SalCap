// 근무 기록 추가 버튼 이벤트
document.getElementById('addWorkRecordButton').addEventListener('click', function () {
    const workRecordsContainer = document.getElementById('workRecordsContainer');

    // 새로운 근무 기록 필드 생성
    const recordDiv = document.createElement('div');
    recordDiv.className = 'input-group';

    // 날짜 입력 필드
    const dateWrapper = document.createElement('div');
    dateWrapper.className = 'field-wrapper';
    const dateLabel = document.createElement('label');
    dateLabel.textContent = '근무 날짜';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateWrapper.appendChild(dateLabel);
    dateWrapper.appendChild(dateInput);

    // 시작 시간 입력 필드
    const startWrapper = document.createElement('div');
    startWrapper.className = 'field-wrapper';
    const startLabel = document.createElement('label');
    startLabel.textContent = '시작 시간';
    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'time';
    startWrapper.appendChild(startLabel);
    startWrapper.appendChild(startTimeInput);

    // 종료 시간 입력 필드
    const endWrapper = document.createElement('div');
    endWrapper.className = 'field-wrapper';
    const endLabel = document.createElement('label');
    endLabel.textContent = '종료 시간';
    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'time';
    endWrapper.appendChild(endLabel);
    endWrapper.appendChild(endTimeInput);

    // DOM에 추가 (각 필드를 한 줄씩 출력)
    recordDiv.appendChild(dateWrapper);
    recordDiv.appendChild(startWrapper);
    recordDiv.appendChild(endWrapper);

    workRecordsContainer.appendChild(recordDiv);
});

// 계산 버튼 이벤트
document.getElementById('calculateButton').addEventListener('click', function () {
    const employeeName = document.getElementById('employeeName').value; // 직원 이름
    const wagePerMinute = parseInt(document.getElementById('wagePerMinute').value); // 분당 급여
    const withholdingTaxChecked = document.getElementById('withholdingTax').checked; // 원천징수 체크 여부

    if (!employeeName) {
        alert("직원 이름을 입력하세요.");
        return;
    }

    if (isNaN(wagePerMinute) || wagePerMinute <= 0) {
        alert("유효한 분당 급여를 입력하세요.");
        return;
    }

    let totalMinutesWorked = 0;

    // 모든 근무 기록 가져오기
    const workRecords = document.querySelectorAll('#workRecordsContainer .input-group');

    workRecords.forEach(record => {
        const dateInput = record.querySelector('input[type=date]').value;
        const startTimeInput = record.querySelector('input[type=time]').value;
        const endTimeInput = record.querySelectorAll('input[type=time]')[1].value;

        if (!dateInput || !startTimeInput || !endTimeInput) {
            alert("모든 날짜와 시간을 입력하세요.");
            return;
        }

        // 시작 시간과 종료 시간을 Date 객체로 변환
        const startDateTime = new Date(`${dateInput}T${startTimeInput}`);
        const endDateTime = new Date(`${dateInput}T${endTimeInput}`);

        // 시간 차이를 분 단위로 계산
        const minutesWorked = (endDateTime - startDateTime) / (1000 * 60); // 밀리초 -> 분 변환

        if (minutesWorked <= 0) {
            alert("종료 시간이 시작 시간보다 빨라서는 안 됩니다.");
            return;
        }

        totalMinutesWorked += minutesWorked; // 총 근무 시간(분) 계산
    });

    // 총 급여 계산
    let totalSalary = totalMinutesWorked * wagePerMinute;

    // 원천징수 적용 여부 확인
    if (withholdingTaxChecked) {
        totalSalary *= (1 - 0.033); // 원천징수 적용
    }

    // 결과 출력
    document.getElementById('result').textContent =
        `${employeeName}님의 총 근무 시간은 ${totalMinutesWorked}분이며, 총 급여는 ${totalSalary.toLocaleString()}원입니다.`;
});
