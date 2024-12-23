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

    // 근무 기록 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete';
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener('click',function(){
        deleteBtn.parentNode.remove();
    })

    // DOM에 추가 (각 필드를 한 줄씩 출력)
    recordDiv.appendChild(dateWrapper);
    recordDiv.appendChild(startWrapper);
    recordDiv.appendChild(endWrapper);
    recordDiv.appendChild(deleteBtn);

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

    // 2024.12.21 계산시 결과 보여주기 추가 - 이순
    // 결과 출력
    document.getElementById('result').textContent =
        `${employeeName}님의 총 근무 시간은 ${totalMinutesWorked}분이며, 총 급여는 ${totalSalary.toLocaleString()}원입니다.`;
        result.style.display = 'block'; // 결과 보여줌
});



// 2024.12.21 테이블 정보 추가 - 이순
// 새로운 탭 생성 이벤트
document.getElementById('tabAddButton').addEventListener('click', function () {
    const tabButtons = document.getElementById('tabButtons'); // 추가된 탭
    const tabContents = document.getElementById('tabContents'); // 추가된 탭 클릭시 내용 들어올 곳
    const employeeName = document.getElementById('employeeName'); // 직원 이름
    const wagePerMinute = document.getElementById('wagePerMinute'); // 분당 급여
    const workRecords = document.querySelectorAll('#workRecordsContainer .input-group'); // 근무 정보
    const withholdingTaxChecked = document.getElementById('withholdingTax'); // 원천징수 체크 여부
    const result = document.getElementById('result'); // 계산 결과
    const count = document.getElementById('count');
    let totalMinutesWorked = 0;
    


        // 예외처리(이름, 분당급여)
        if (!employeeName.value) {
            alert("직원 이름을 입력하세요.");
            return;
        }

        if (isNaN(wagePerMinute.value) || wagePerMinute.value <= 0) {
            alert("유효한 분당 급여를 입력하세요.");
            return;
        }
    

        // 계산한 근로자 탭 라벨 생성
        const tabLabel = document.createElement('button');
        tabLabel.className = 'btn tabLabel';
        tabLabel.textContent = `${employeeName.value}`;

        // 부모자식 설정
        tabButtons.appendChild(tabLabel);


        // 근무 정보 추출
        workRecords.forEach(record => {
            const dateInput = record.querySelector('input[type=date]').value;
            const startTimeInput = record.querySelector('input[type=time]').value;
            const endTimeInput = record.querySelectorAll('input[type=time]')[1].value;

            // 예외처리(날짜 시간)
            if (!dateInput || !startTimeInput || !endTimeInput) {
                alert("모든 날짜와 시간을 입력하세요.");
                return;
            }
    
            // 시작 시간과 종료 시간을 Date 객체로 변환
            const startDateTime = new Date(`${dateInput}T${startTimeInput}`);
            const endDateTime = new Date(`${dateInput}T${endTimeInput}`);
    
            // 시간 차이를 분 단위로 계산
            const minutesWorked = (endDateTime - startDateTime) / (1000 * 60); // 밀리초 -> 분 변환

            // 예외처리(종료시간)
            if (minutesWorked <= 0) {
                alert("종료 시간이 시작 시간보다 빨라서는 안 됩니다.");
                return;
            }

            // 총 근무 시간(분) 계산
            totalMinutesWorked += minutesWorked; 
            
            // 총 급여 계산
            let totalSalary = totalMinutesWorked * wagePerMinute.value;

            // 원천징수 적용 여부 확인
            if (withholdingTaxChecked) {
            totalSalary = totalMinutesWorked * wagePerMinute.value * (1 - 0.033); // 원천징수 적용
            }
            
            
            // 테이블에 데이터 저장 이벤트
            const table = document.getElementById('table');
            const tableRow = document.createElement('tr');
            const num = document.createElement('td'); // 카운트
            num.className = 'table'; // 테이블 border 위해서 필요
            const name = document.createElement('td'); // 근로자명
            name.className = 'table';
            const date = document.createElement('td'); // 근무일자
            date.className = 'table';
            const startTime = document.createElement('td'); // 시작시간
            startTime.className = 'table';
            const endTime = document.createElement('td'); // 종료시간
            endTime.className = 'table';
            const totalTime = document.createElement('td'); // 총 근무시간(분)
            totalTime.className = 'table';
            const minuteSalary = document.createElement('td'); // 분당급여
            minuteSalary.className = 'table';
            const tax = document.createElement('td'); // 원천징수
            tax.className = 'table';
            const allSalary = document.createElement('td'); // 총 급여
            allSalary.className = 'table';
    
            // 부모자식 설정
            table.appendChild(tableRow);
            tableRow.appendChild(num)
            tableRow.appendChild(name);
            tableRow.appendChild(date);
            tableRow.appendChild(startTime);
            tableRow.appendChild(endTime);
            tableRow.appendChild(totalTime)
            tableRow.appendChild(minuteSalary);
            tableRow.appendChild(tax);
            tableRow.appendChild(allSalary);
    
    
            // 2024.12.21 오류 수정 - 이순
            //데이터 넣기
            count.textContent = Number(count.textContent) + 1;
            num.textContent = count.textContent; //1씩 증가 안됨
            name.textContent = employeeName.value; // 이름
            date.textContent = dateInput; // 근무일자
            startTime.textContent = startTimeInput; // 시작시간
            endTime.textContent = endTimeInput; // 종료시간
            totalTime.textContent = minutesWorked;// 총 근무시간(분)
            minuteSalary.textContent = wagePerMinute.value; // 분당급여
            tax.textContent = 'X'; // 원천징수 안했을경우
            allSalary.textContent = totalMinutesWorked * wagePerMinute.value;
            // 원천징수 했을경우
            if(withholdingTaxChecked.checked === true){
                tax.textContent = 'O';
                allSalary.textContent = totalMinutesWorked * wagePerMinute.value *(1 - 0.033);
            } 
            
        });

        // 기존 탭 정보 리셋
        employeeName.value = ''; // 직원 이름
        wagePerMinute.value = ''; // 분당 급여
        withholdingTaxChecked.checked = false; // 원천징수
        result.style.display = 'none'; // 결과 안보이게 처리
       
        //////근무기록 input창 삭제(초기화)
        const parent = document.getElementById('workRecordsContainer');
        while(parent.firstChild)  {
            parent.removeChild(parent.firstChild);
        }



});


// 2024.12.22 탭 클릭시 정보 띄우기(반복 불가) - 이순
// 탭 클릭시 정보 불러오기 이벤트
let tabContents = document.getElementById('tabButtons');
tabContents.addEventListener('click', function(){
    let table = document.getElementById('table'); // 데이터 저장 테이블
    let rowList = table.rows;
    let tabLabelLength = tabContents.childElementCount;
    let tabLabelList = tabContents.children;

    for(let i = 1; i<rowList.length; i++){
        for(let j = 0; j<tabLabelLength; j++){
        let row = rowList[i];
        let cell = row.cells[1];
        let tabName = tabLabelList[j]

        // 2024.12.22 수정중(한번만 클릭 가능) - 이순
            if(cell.textContent == tabName.textContent){
                let name = row.cells[1].textContent;
                let totalMinutesWorked = row.cells[5].textContent;
                let totalSalary = row.cells[8].textContent;
                document.getElementById('tabContents').textContent = `${name}님의 총 근무 시간은 ${totalMinutesWorked}분이며, 총 급여는 ${totalSalary}원입니다.`;
                tabContents.style.display = 'block'; // 결과 보여줌 
            }
        }
    }
})


// 2024.12.22 엑샐 내보내기 기능 - 승래
document.getElementById('toExcel').addEventListener('click',function(){
    // let fileNm = '근무기록' + '.xlsx';
    // let sheetNm = 'sheet1';
    // let wb = XLSX.utils.table_to_book(document.getElementById('table'), {sheet:sheetNm,raw:true});
    // XLSX.writeFile(wb, (fileNm));
    console.log("zzzzz");
    exportExcel();
});


function exportExcel(){
    let wb = XLSX.utils.book_new();

    // step 2. 시트 만들기 
    let ws = excelHandler.getWorksheet();
    
    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
    XLSX.utils.book_append_sheet(wb, ws, excelHandler.getSheetName());

    // step 4. 엑셀 파일 만들기 
    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    // step 5. 엑셀 파일 내보내기 
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());

}

let excelHandler = {
    getExcelFileName : function(){
        console.log("1")
        return 'workrecord.xlsx';
    },
    getSheetName : function(){
        console.log("2")
        return 'sheet1';
    },
    getExcelData : function(){
        console.log("3")
        return document.getElementById('table');
    },
    getWorksheet : function(){
        console.log("4")
        return XLSX.utils.table_to_sheet(this.getExcelData());
    }
}

function s2ab(s) { 
    console.log("s2ab");
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}



// 2024.12.23 PDF 변환 기능 - 이순
function downloadPDF() {
    const element = document.body; // PDF로 변환하고자 하는 HTML 요소를 선택합니다. 예: document.getElementById('your-element-id')

    html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("download.pdf");
    });
}

document.getElementById('toPdf').addEventListener('click', function(){
    downloadPDF();
})
