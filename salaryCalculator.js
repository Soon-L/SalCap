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
// 계산 버튼 이벤트
document.getElementById('calculateButton').addEventListener('click', function () {
    const employeeName = document.getElementById('employeeName').value; // 직원 이름
    const wagePerMinute = parseInt(document.getElementById('wagePerMinute').value); // 분당 급여
    const withholdingTaxChecked = document.getElementById('withholdingTax').checked; // 원천징수 체크 여부
    let calculateFlag = true; //계산 유효성 검사를 위한 boolean 변수

    if (!employeeName) {
        alert("직원 이름을 입력하세요.");
        return;
    }

    if (isNaN(wagePerMinute) || wagePerMinute <= 0) {
        alert("유효한 분당 급여를 입력하세요.");
        return;
    }

    if(document.getElementById('workRecordsContainer').childNodes.length===0){
        alert("근무기록이 입력되지 않았습니다.");
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
            calculateFlag = false;
            return;
        }

        // 시작 시간과 종료 시간을 Date 객체로 변환
        const startDateTime = new Date(`${dateInput}T${startTimeInput}`);
        const endDateTime = new Date(`${dateInput}T${endTimeInput}`);

        // 시간 차이를 분 단위로 계산
        const minutesWorked = (endDateTime - startDateTime) / (1000 * 60); // 밀리초 -> 분 변환

        if (minutesWorked <= 0) {
            alert("종료 시간이 시작 시간보다 빨라서는 안 됩니다.");
            calculateFlag = false;
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
    if(calculateFlag){
        document.getElementById('result').textContent =
        `${employeeName}님의 총 근무 시간은 ${totalMinutesWorked}분이며, 총 급여는 ${totalSalary.toLocaleString()}원입니다.`;
        result.style.display = 'block'; // 결과 보여줌
    }else{
        return;
    }
});

const tableClone = document.querySelector('.table').cloneNode(true);
let tabNumber = 0;




// 2024.12.21 테이블 정보 추가 - 이순
// 새로운 탭 생성 이벤트
document.getElementById('tabAddButton').addEventListener('click', function () {
    const tabButtons = document.getElementById('tabButtons'); // 추가된 탭
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
        // 기존 테이블 숨기기
        const alltable = document.querySelectorAll('.table');
        alltable.forEach((tab) =>{
            tab.classList.add('hidden');
        })
        //새 테이블 생성
        tabNumber++;
        let nowTab = 'tab' + tabNumber;
        document.querySelectorAll('.table').forEach((table)=>{
            table.classList.remove('active');
            count.textContent = Number(count.textContent)-Number(count.textContent); // 테이블 넘버 리셋셋
        })
        const newTable = tableClone.cloneNode(true);
        newTable.classList.add(nowTab);
        newTable.classList.add('active');
        document.querySelector(".dataTable").appendChild(newTable);


        // 계산한 근로자 탭 라벨 생성
        document.querySelectorAll('.tabLabel').forEach((label)=>{
            label.classList.remove('active');
        });
        const tabLabel = document.createElement('button');
        tabLabel.className = 'btn tabLabel active '+nowTab;
        tabLabel.textContent = `${employeeName.value}`;
        // 부모자식 설정
        tabButtons.appendChild(tabLabel);


        // 근무 정보 추출
        workRecords.forEach(record => {
            const dateInput = record.querySelector('input[type=date]').value;
            const startTimeInput = record.querySelector('input[type=time]').value;
            const endTimeInput = record.querySelectorAll('input[type=time]')[1].value;
            let totalMinutesWorked = 0;

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
            const table = document.querySelector('.dataTable').querySelector('.'+nowTab);
            const tableRow = document.createElement('tr');
            const num = document.createElement('td'); // 카운트
            const name = document.createElement('td'); // 근로자명
            const date = document.createElement('td'); // 근무일자
            const startTime = document.createElement('td'); // 시작시간
            const endTime = document.createElement('td'); // 종료시간
            const totalTime = document.createElement('td'); // 총 근무시간(분)
            const minuteSalary = document.createElement('td'); // 분당급여
            const tax = document.createElement('td'); // 원천징수
            const allSalary = document.createElement('td'); // 총 급여
            // const resultData = document.createElement('tr'); // 맨 밑 결과

            // 부모자식 설정
            table.querySelector('tbody').appendChild(tableRow);
            tableRow.appendChild(num)
            tableRow.appendChild(name);
            tableRow.appendChild(date);
            tableRow.appendChild(startTime);
            tableRow.appendChild(endTime);
            tableRow.appendChild(totalTime)
            tableRow.appendChild(minuteSalary);
            tableRow.appendChild(tax);
            tableRow.appendChild(allSalary);
            // table.appendChild(resultData);
    
    
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
            //resultData.textContent += Number(allSalary.textContent);
            // 원천징수 했을경우
            if(withholdingTaxChecked.checked === true){
                tax.textContent = 'O';
                allSalary.textContent = totalMinutesWorked * wagePerMinute.value *(1 - 0.033);
                //resultData.textContent += Number(allSalary.textContent);
            } 
            
        });



        ///////// 2024.12.25 결과 데이터 행 - 이순 /////////////////////////
        const table = document.querySelector('.dataTable');
        const resultDataRow = document.createElement('tr'); // 맨 밑 결과 행
        const resultData = document.createElement('td'); // 맨 밑 결과 셀
        resultData.className = 'resultData ' + 'tab'+tabNumber;

        // 부모자식 설정
        table.appendChild(resultDataRow);
        resultDataRow.appendChild(resultData);

        resultData.textContent = result.textContent; // 결과값 넣기

        // 기존 결과 행 숨기기
        const allResultData = document.querySelectorAll('.resultData');
        allResultData.forEach((tab) =>{
            tab.classList.add('hidden');
        })

        // 현재 결과 행 보이기
        resultData.classList.remove('hidden');
        resultData.classList.add('active');


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

// let tabContents = document.getElementById('tabButtons');
// tabContents.addEventListener('click', function(){
//     let table = document.getElementById('table'); // 데이터 저장 테이블
//     let rowList = table.rows;
//     let tabLabelLength = tabContents.childElementCount;
//     let tabLabelList = tabContents.children;

//     for(let i = 1; i<rowList.length; i++){
//         for(let j = 0; j<tabLabelLength; j++){
//         let row = rowList[i];
//         let cell = row.cells[1];
//         let tabName = tabLabelList[j]

//         // 2024.12.22 수정중(한번만 클릭 가능) - 이순
//             if(cell.textContent == tabName.textContent){
//                 let name = row.cells[1].textContent;
//                 let totalMinutesWorked = row.cells[5].textContent;
//                 let totalSalary = row.cells[8].textContent;
//                 document.getElementById('tabContents').textContent = `${name}님의 총 근무 시간은 ${totalMinutesWorked}분이며, 총 급여는 ${totalSalary}원입니다.`;
//                 tabContents.style.display = 'block'; // 결과 보여줌 
//             }
//         }
//     }
// })




// 2024.12.23 탭 클릭시 테이블 변경 - 승래
document.getElementById('tabButtons').addEventListener('click', function(){
    document.querySelectorAll('.tabLabel').forEach((tab, index)=>{
        tab.addEventListener('click',function(){
            const alltabs = document.querySelectorAll('.tabLabel');
            console.log(tab)
            const tables = document.querySelectorAll('.table');
            tables.forEach((table)=>{
                table.classList.add('hidden');
                table.classList.remove('active');
            });
            alltabs.forEach((viewTab)=>{
                viewTab.classList.remove('active');
            })
            alltabs[index].classList.add('active');
            tables[index].classList.remove('hidden');
            tables[index].classList.add('active');
        });
    });
});




// 2024.12.22 엑샐 내보내기 기능 - 승래
document.getElementById('toExcel').addEventListener('click',function(){
    exportExcel();
});


function exportExcel(){
    let wb = XLSX.utils.book_new();

    let ws = excelHandler.getWorksheet();

    for ( i in ws ) {
        if ( typeof ( ws[ i ] ) != "object" ) continue;
        let cell = XLSX.utils.decode_cell( i );
        // 각 열 너비 설정
        ws["!cols"]=[{wpx: 30},{wpx: 130},{wpx: 130},{wpx: 130},{wpx: 130},{wpx: 130},{wpx: 130},{wpx: 130},{wpx: 130}];
        //모든 셀 스타일
        ws[ i ].s = {
            font : {
                name : "arial"
            } ,
            alignment : {
                vertical : "center" ,
                horizontal : "center" ,
                wrapText : '1' ,
            } ,
            border : {
                right : {
                    style : "thin" ,
                    color : "000000"
                } ,
                left : {
                    style : "thin" ,
                    color : "000000"
                } ,
                top : {
                    style : "thin" ,
                    color : "000000"
                } ,
                bottom : {
                    style : "thin" ,
                    color : "000000"
                } ,
            }
        };
       ////////헤더부분 스타일
        if ( cell.r == 0 ) {
            ws[ i ].s.fill = {
                patternType : "solid" ,
                fgColor : {
                    rgb : "b2b2b2"
                } ,
                bgColor : {
                    rgb : "b2b2b2"
                }
            };
        }
    }
    
    XLSX.utils.book_append_sheet(wb, ws, excelHandler.getSheetName());

    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());

}

let excelHandler = {
    getExcelFileName : function(){
        return 'workrecord.xlsx';
    },
    getSheetName : function(){
        return 'sheet1';
    },
    getExcelData : function(){
        return document.querySelector('.table.active');
    },
    getWorksheet : function(){
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



// 2024.12.23 PDF 변환 기능(페이지 잘림 에러) - 이순
function downloadPDF() {
    let element = document.getElementById('saveTable'); // PDF로 변환하고자 하는 HTML 요소를 선택합니다. 예: document.getElementById('your-element-id')

    html2canvas(element).then((canvas) => {
        let imgData = canvas.toDataURL('image/png');
        let pdf = new jspdf.jsPDF();

        let imgWidth = 190; // 이미지 가로 길이(mm) / A4 기준 210mm
        let pageHeight = imgWidth * 1.414;  // 출력 페이지 세로 길이 계산 A4 기준
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let margin = 10; // 출력 페이지 여백설정
        
        //let position = (0, 10);
        let position = (0, 10);


        // 첫 페이지 출력
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 한 페이지 이상일 경우 루프 돌면서 출력
      while (heightLeft >= 0) {			// 35
        position = heightLeft - imgHeight;
        //position = position - 20 ;		// -25
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }


        pdf.save("download.pdf");

        
    });
}

document.getElementById('toPdf').addEventListener('click', function(){
    downloadPDF();
})
