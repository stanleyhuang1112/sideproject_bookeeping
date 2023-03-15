function setAllTypeList(){
    if( JSON.parse(localStorage.getItem('allTypeList')) ){ return };
    
    let costTypeList = [
        {
          mainType: '食',
          secondaryType: ['早餐', '午餐', '晚餐', '食材', '水果'],
        },
        {
          mainType: '衣',
          secondaryType: ['衣服', '褲子', '理髮'],
        },
        {
          mainType: '行',
          secondaryType: ['公車', '捷運', '計程車', '油錢', '停車費'],
        },
        {
          mainType: '閱',
          secondaryType: ['理財', '程式', '心理', '科普', '繪畫', '手作'],
        },
        {
          mainType: '樂',
          secondaryType: ['聚餐', '宵夜', '出遊', '禮物', '寵物'],
        },
        {
          mainType: '生活',
          secondaryType: ['房租', '保險', '手機', '水費', '電費'],
        },
    ];
    
    let revenueTypeList = [
        {
          mainType: '薪資',
          secondaryType: ['公司']
        },
        {
          mainType: '兼職',
          secondaryType: ['網拍']
        },
        {
          mainType: '股息',
          secondaryType: ['大立光']
        },
        {
          mainType: '其他',
          secondaryType: ['發票']
        },
    ];
    
    let allTypeList = [
        costTypeList, 
        revenueTypeList
    ]

    setLocalStorage('allTypeList', allTypeList);    
}

function setPaymentMethod(){
    if( JSON.parse(localStorage.getItem('paymentMethod')) ){ return };

    let paymentMethod = [
        {
            method: '現金',
            initialValue: 0, 
            nowValue: 0
        },    
    ]

    setLocalStorage('paymentMethod', paymentMethod);    
}

function setNewData( thisYear ){
    let recordData = [];

    let yearData = {
        year: thisYear,
        record: []
    }

    let firstDay = new Date(thisYear, 0, 1).getDay();

    let dayData = {
        dayNum: 0,
        weekDay: firstDay,
        record: []
    }

    for( let i = 0; i < 365; i++){
        dayData = {
            dayNum: i,
            weekDay: ( i + firstDay ) % 7,
            record: []
        };

        yearData.record.push(dayData);        
    }

    if( thisYear % 4 === 0 ){
        yearData.record.push(dayData);
    }

    recordData.push(yearData)

    setLocalStorage('newData', recordData);
}

function getRangeNum(specificDate){
    let rangeNum;
    let amendNum;
    let year = specificDate.year;
    let month = specificDate.month;
    let date = specificDate.date;

    switch(month){
        case 1:
        case 4:
        case 5:
            amendNum = 0;
            break;
        case 2:
        case 6:
        case 7:
            amendNum = 1;
            break;
        case 3:
            amendNum = -1;
            break;
        case 8:
            amendNum = 2;
            break;
        case 9:
        case 10:
            amendNum = 3;
            break;
        case 11:
        case 12:
            amendNum = 4;
            break;
    }

    rangeNum = (month - 1) * 30 + date + amendNum - 1;

    if( (year % 4 === 0) && (month > 2) ){
        rangeNum += 1;
    }

    return rangeNum;
}


function getSpecificRange(start, end){
    let newData = [];
    let startNum = getRangeNum( start );
    let endNum = getRangeNum( end );

    for( let i = startNum; i < (endNum + 1); i++ ){
        newData.push( newRecordData[0].record[i] );
    }

    return newData;
}

function setRecordData(){
    if( JSON.parse(localStorage.getItem('recordData')) ){ return };
    let recordData = [];
    
    let data = {
        year: date.getFullYear(),
        months: [],
        totalCostYear: 0,
        totalRevenueYear: 0
    };
  
    function dayAmount(month, day){
        for(let i = 0; i < day; i++){
            data.months[month - 1].day.push({
                date: i+1,
                cost: {
                    record: [],
                    totalDay: 0 
                },
                revenue: {
                    record: [],
                    totalDay: 0 
                },
                transfer: {
                    record: []
                }
            });               
        };
    };   

    for(let i = 0; i < 12; i++){
        data.months.push({
            month: i + 1,
            day: [],
            totalCostMonth: 0,
            totalRevenueMonth: 0
        });    
    };

    for(let i = 0; i < data.months.length ; i++){
        switch ( data.months[i].month ){
            case 2:
            dayAmount(2, 28);
            break;
            case 4:
            dayAmount(4, 30);      
            break;
            case 6:
            dayAmount(6, 30);
            break;
            case 9:
            dayAmount(9, 30);
            break;
            case 11:
            dayAmount(11,30);
            break;
            default:
            dayAmount(i+1, 31);
            break;
        }

        let dayCostTotal = 0;   
        let dayRevenueTotal = 0;    

        for(let k = 0; k < data.months[i].day.length; k++){
            dayCostTotal += data.months[i].day[k].cost.totalDay;  
            dayRevenueTotal += data.months[i].day[k].revenue.totalDay;    
        }

        data.months[i].totalCostMonth = dayCostTotal;
        data.months[i].totalRevenueMonth = dayRevenueTotal;
    };

    let totalCostYearValue = 0;
    let totalRevenueYearValue = 0;

    for(let i = 0; i < data.months.length; i++){ 
        totalCostYearValue += data.months[i].totalCostMonth;
        totalRevenueYearValue += data.months[i].totalRevenueMonth;
    }

    data.totalCostYear = totalCostYearValue;
    data.totalRevenueYear = totalRevenueYearValue;

    recordData.push(data);
    setLocalStorage('recordData', data);
};



const date = new Date();


let recordData = JSON.parse(localStorage.getItem('recordData')) || [];;

setAllTypeList();
let costTypeListData = JSON.parse(localStorage.getItem('allTypeList'))[0];
let revenueTypeListData = JSON.parse(localStorage.getItem('allTypeList'))[1];

setPaymentMethod();
let paymentMethodData = JSON.parse(localStorage.getItem('paymentMethod')); 


let monthRecord = document.querySelector('.monthRecord') || 0;
let dayRecord = document.querySelector('.dayRecord') || 0;
let monthMenu = document.querySelector('.monthMenu') || 0;
let propertyOptionBox = document.querySelector('.propertyOptionBox') || 0;
let commonOptionBox = document.querySelector('.commonOptionBox') || 0;
let typeConfigBox = document.querySelector('.typeConfigBox') || 0;

let delBtn = `<div class="btn deleteBtn recordBtn btn_style">刪除</div>`;
let addBtn = `<div class="addBtn btn recordBtn btn_style">新增</div>`;
let commonlyBtn = `<div class="commonlyBtn btn recordBtn btn_style">常用</div>`;


function setLocalStorage(itemName, data){
    let itemNameString = String(itemName);
    let dataJSON = JSON.stringify(data);

    localStorage.setItem(itemNameString, dataJSON);  
}

function checkClassType(TypeClass){
    let type = '';

    switch( TypeClass ){        
        case '支出':
            type = 'cost';
            break;
        case '收入':
            type = 'revenue';
            break;
        case '轉帳':
            type = 'transfer';
            break;
    }

    return type;
}

function createCostOrRevenueListContent(formType, listContentData){
    let typeListData = {};
    
    let mainTypeOption = '';
    let mainTypeNum = 0; 

    let secondaryTypeOption = '';

    let paymentMethodOption = '';  

    let amountPlaceholder = '金額';
    let notePlaceholder = '註記';

    let amountClass = 'amount';
    let noteClass = 'note ifAmountNotFin';

    switch( formType ){        
        case 'cost':
            typeListData = costTypeListData;
            break;
        case 'revenue':
            typeListData = revenueTypeListData;
            break;
    }

    for(let i = 0; i< typeListData.length; i++){
        mainTypeOption += `<li class="btn">${typeListData[i].mainType}</li>`; 

        if(typeListData[i].mainType === listContentData.mainType){
            mainTypeNum = i
        }
    }    

    for(let i = 0; i< typeListData[mainTypeNum].secondaryType.length; i++){
        secondaryTypeOption += `<li class="btn">${typeListData[mainTypeNum].secondaryType[i]}</li>`
    }    
    
    for(let i = 0; i< paymentMethodData.length; i++){
        paymentMethodOption += `<li class="btn">${paymentMethodData[i].method}</li>`
    }

    if(listContentData.amount !== ''){
        amountClass = 'amount input_fin'
        noteClass = 'note'
    }

    if(listContentData.note !== ''){
        noteClass = 'note input_fin'
    }

    let listContent = `
        <div  class="maxWidth800Component">${delBtn}</div>
        <div class="typeAndAmountBox">
            <div class="mainType selectBox">
                <div class="select">${listContentData.mainType}</div>
                <ul class="option">
                    ${mainTypeOption}
                </ul>
            </div>
            <div class="secondaryType selectBox">
                <div class="select">${listContentData.secondaryType}</div>
                <ul class="option">
                    ${secondaryTypeOption}
                </ul>
            </div>
            <div class="paymentMethod selectBox">
                <div class="select">${listContentData.paymentMethod}</div>
                <ul class="option">
                    ${paymentMethodOption}
                </ul>
            </div>           
        </div>
        <div class="inputBox">
            <p class="maxWidth800Component">金額：</p>                       
            <input type="text" class="${amountClass} input_style" value="${listContentData.amount}" placeholder="${amountPlaceholder}">             
        </div> 
        <div class="inputBox">
            <p class="maxWidth800Component">註記：</p>
            <input type="text" class="${noteClass} input_style" value="${listContentData.note}" placeholder="${notePlaceholder}">
        </div>
        <div  class="minWidth800Component">${delBtn}</div>
    `;

    return listContent;
}

function createTransferListContent(listContentData){
    let paymentMethodOption = '';  

    let amountPlaceholder = '金額';
    let notePlaceholder = '註記';

    let amountClass = 'amount';
    let noteClass = 'note ifAmountNotFin';  
    
    for(let i = 0; i< paymentMethodData.length; i++){
        paymentMethodOption += `<li class="btn">${paymentMethodData[i].method}</li>`
    }

    if(listContentData.amount !== ''){
        amountClass = 'amount input_fin'
        noteClass = 'note'
    }

    if(listContentData.note !== ''){
        noteClass = 'note input_fin'
    }

    let listContent = `
        <div  class="maxWidth800Component">${delBtn}</div>
        <div class="typeAndAmountBox">
            <div class="paymentMethod selectBox transferFrom">
                <div class="select">${listContentData.transferFrom || paymentMethodData[0].method}</div>
                <ul class="option">
                    ${paymentMethodOption}
                </ul>
            </div> 
            <p>轉至</p>
            <div class="paymentMethod selectBox transferTo">
                <div class="select">${listContentData.transferTo || paymentMethodData[0].method}</div>
                <ul class="option">
                    ${paymentMethodOption}
                </ul>
            </div> 
        </div>
        <div class="inputBox">
            <p class="maxWidth800Component">金額：</p>                       
            <input type="text" class="${amountClass} input_style" value="${listContentData.amount}" placeholder="${amountPlaceholder}">             
        </div> 
        <div class="inputBox">
            <p class="maxWidth800Component">註記：</p>
            <input type="text" class="${noteClass} input_style" value="${listContentData.note}" placeholder="${notePlaceholder}">
        </div>        
        <div  class="minWidth800Component">${delBtn}</div>
    `;

    return listContent;
}


function createListContent(formType, listContentData){
    let listContent = '';

    switch( formType ){        
        case 'cost':
            listContent = createCostOrRevenueListContent(formType, listContentData);
            break;
        case 'revenue':
            listContent = createCostOrRevenueListContent(formType, listContentData);
            break;
        case 'transfer':
            listContent = createTransferListContent(listContentData);
            break;
    }

    return listContent;
}

function addRecordList(){
    const recordList = document.querySelector('.record_edit .recordList');

    let newList = document.createElement('li');
    let listContentData = {};
    let formType = checkClassType(document.querySelector('.record_edit .now_type').textContent);

    switch( formType ){        
        case 'cost':
            listContentData = {
                'mainType': costTypeListData[0].mainType,
                'secondaryType': costTypeListData[0].secondaryType[0],
                'paymentMethod': paymentMethodData[0].method,
                'amount': '',
                'note': ''
            };
            break;
        case 'revenue':
            listContentData = {
                'mainType': revenueTypeListData[0].mainType,
                'secondaryType': revenueTypeListData[0].secondaryType[0],
                'paymentMethod': paymentMethodData[0].method,
                'amount': '',
                'note': ''
            };
            break;
        case 'transfer':
            listContentData = {
                'paymentMethod': paymentMethodData[0].method,
                'amount': '',
                'note': ''
            };
            break;
    }

    newList.innerHTML = createListContent(formType, listContentData);
    newList.setAttribute('class', 'dayRecordList');

    recordList.appendChild(newList);
}

function recordEdit(){
    let year = parseInt(document.querySelector('.record_edit .year').textContent);
    let month = parseInt(document.querySelector('.record_edit .month').textContent);
    let date = parseInt(document.querySelector('.record_edit .date').textContent);
    let formType = checkClassType(document.querySelector('.record_edit .now_type').textContent);

    let recordData = JSON.parse(localStorage.getItem('recordData')) || [];;

    let sameDateData = recordData.filter(function(item, index, array){
        return  `${item.year}${'0' + item.month}${'0' + item.date}` === `${year}${'0' + month}${'0' + date}`;
      });

    let sameDateAndDifferentTypeData = sameDateData.filter(function(item, index, array){
        return item.type !== formType;
      });

    let otherDateData = recordData.filter(function(item, index, array){
        return  `${item.year}${'0' + item.month}${'0' + item.date}` !== `${year}${'0' + month}${'0' + date}`;
      });

    let recordListData = otherDateData.concat( sameDateAndDifferentTypeData ); 

    function createCostOrRevenueListData(){
        let mainType = document.querySelectorAll('.record_edit .mainType .select');
        let secondaryType = document.querySelectorAll('.record_edit .secondaryType .select');
        let paymentMethod = document.querySelectorAll('.record_edit .paymentMethod .select');
        let amount = document.querySelectorAll('.record_edit .amount');
        let note = document.querySelectorAll('.record_edit .note');
     
        for(let i = 0; i < mainType.length; i++ ){
            recordListData.push({
                'fullDate': `${year}${'0' + month}${'0' + date}`,
                'year': year,
                'month': month,
                'date': date,
                'type': formType,
                'mainType': mainType[i].textContent,
                'secondaryType': secondaryType[i].textContent,
                'paymentMethod': paymentMethod[i].textContent,
                'amount': parseInt(amount[i].value) || 0,
                'note': note[i].value 
            });        
        }
    }

    function createTransferListData(){
        let transferFrom = document.querySelectorAll('.record_edit .transferFrom .select');
        let transferTo = document.querySelectorAll('.record_edit .transferTo .select');
        let amount = document.querySelectorAll('.record_edit .amount');
        let note = document.querySelectorAll('.record_edit .note');
     
        for(let i = 0; i < transferFrom.length; i++ ){
            recordListData.push({
                'fullDate': `${year}${'0' + month}${'0' + date}`,
                'year': year,
                'month': month,
                'date': date,
                'type': formType,
                'transferFrom': transferFrom[i].textContent,
                'transferTo': transferTo[i].textContent,
                'amount': parseInt(amount[i].value) || 0,
                'note': note[i].value 
            });        
        }
    }

    switch( formType ){
        case 'cost':
        case 'revenue':
            createCostOrRevenueListData();
            break;
        case 'transfer':
            createTransferListData();         
            break;
    }
    
    recordListData.sort(function(a, b){
        return parseInt(a.fullDate) - parseInt(b.fullDate);
    });

    setLocalStorage('recordData', recordListData);
    
    changeAllPropertyNowValue();
    totalDayValueChange();
}

function createRecordListContent(year, month, date, formType){
    let recordData = JSON.parse(localStorage.getItem('recordData')) || [];

    let dayRecord = recordData.filter(function(item, index, array){
        return item.year === year && item.month === month && item.date === date;
      });
    let dayRecordData;
    let recordListAndTotalDay;
    let recordList;

    let str = '';

    function costAndRevenueRecordList(){
        let totalDay = 0;

        for(let i = 0; i < dayRecordData.length; i++){
    
            let mainType = dayRecordData[i].mainType;
            let secondaryType = dayRecordData[i].secondaryType;
            let paymentMethod = dayRecordData[i].paymentMethod;
            let amount = dayRecordData[i].amount;
            let note = dayRecordData[i].note;  
    
            let listContentData = {
                'mainType': mainType,
                'secondaryType': secondaryType,
                'paymentMethod': paymentMethod,
                'amount': amount,
                'note': note
            }

            totalDay += amount;
    
            str += `<li class="dayRecordList">${createListContent(formType, listContentData)}</li>`;
        }
    
        recordListAndTotalDay = {
            'str': str,
            'totalDay': totalDay
        };
    }

    function transferRecordList(){
        for(let i = 0; i < dayRecordData.length; i++){
    
            let transferFrom = dayRecordData[i].transferFrom;
            let transferTo = dayRecordData[i].transferTo;
            let amount = dayRecordData[i].amount;
            let note = dayRecordData[i].note;  
    
            let listContentData = {
                'transferFrom': transferFrom,
                'transferTo': transferTo,
                'amount': amount,
                'note': note
            }
    
            str += `<li class="dayRecordList">${createListContent(formType, listContentData)}</li>`;
        }
    
        recordList =  str;
    }


    switch( formType ){
        case 'cost':
            dayRecordData = dayRecord.filter(function(item, index, array){
                return item.type === 'cost';
            });
            costAndRevenueRecordList();  
            return recordListAndTotalDay;
        case 'revenue':
            dayRecordData = dayRecord.filter(function(item, index, array){
                return item.type === 'revenue';
            });
            costAndRevenueRecordList();
            return recordListAndTotalDay;
        case 'transfer':
            dayRecordData = dayRecord.filter(function(item, index, array){
                return item.type === 'transfer';
            });
            transferRecordList();
            return recordList;
    }
}

function updateDayRecord(year, month, day, formType){

    let recordFormContent = '';
    let recordListAndTotalDay;

    let str = '';
    let totalDay; 


    switch( formType ){
        case 'cost':
        case 'revenue':
            recordListAndTotalDay = createRecordListContent(year, month, day, formType);            
            str = recordListAndTotalDay.str;
            totalDay = recordListAndTotalDay.totalDay;

            recordFormContent = `
                <div class="formHeader">
                    <p class="fullDate"><span class="year">${year}</span> . <span class="month">${month}</span> . <span class="date">${day}</span></p>
                    <div class="typeBtnBox btnBox">
                        <div class="costBtn btn btn_style recordBtn typeBtn now_type">支出</div>
                        <div class="revenueBtn btn btn_style recordBtn typeBtn">收入</div>
                        <div class="transferBtn btn btn_style recordBtn typeBtn">轉帳</div>
                    </div>
                </div>        
                <div class="recordField">
                    <ul class="recordList">
                        ${str}
                    </ul>
                    <div class="btnAndTotalBox">
                        <div class="btnBox">
                            ${addBtn}
                            ${commonlyBtn}
                        </div>                
                        <p class="total">總計：<span class="totalValue">${totalDay}</span></p>
                    </div>
                </div>
            `;
            break;
        case 'transfer':
            str = createRecordListContent(year, month, day, formType);

            recordFormContent = `
                <div class="formHeader">
                    <p class="fullDate"><span class="year">${year}</span> . <span class="month">${month}</span> . <span class="date">${day}</span></p>
                    <div class="typeBtnBox btnBox">
                        <div class="costBtn btn btn_style recordBtn typeBtn now_type">支出</div>
                        <div class="revenueBtn btn btn_style recordBtn typeBtn">收入</div>
                        <div class="transferBtn btn btn_style recordBtn typeBtn">轉帳</div>
                    </div>
                </div>        
                <div class="recordField">
                    <ul class="recordList">
                        ${str}
                    </ul>
                    <div class="btnAndTotalBox">
                        <div class="btnBox">
                            ${addBtn}                            
                            ${commonlyBtn}
                        </div>                
                    </div>
                </div>
            `;
            break;
    }   

    return recordFormContent;
}

function getDayAmount(year, month){
    let dateStart = new Date(year, month -1, 1);
    let dateEnd = new Date(year, month, 1);
    
    let dayAmount = (dateEnd.getTime() - dateStart.getTime())/3600000/24;

    return dayAmount;
}

function updateRecord(year, month){
    let nowYear = document.querySelector('.year_month .year') || 0; 
    let nowMonth = document.querySelector('.year_month .month') || 0;
    let dayAmount = getDayAmount(year, month); 

    let str = '';

    if( nowYear ){
        nowYear.textContent = year;
        nowMonth.textContent = month;       
    }

    if(monthRecord){
        for(let i = 0; i < dayAmount; i++){
            str += `<li class="recordForm" data-dayrecordform="${i}">${updateDayRecord(year, month, i + 1, 'cost')}</li>`;
    
            monthRecord.innerHTML = str;
        }
    }else if(dayRecord){        
        str += `<div class="recordForm" data-dayrecordform="${0}">${updateDayRecord(year, month, date.getDate(), 'cost')}</div>`;
    
        dayRecord.innerHTML = str;
    }else{
        return;
    }
}

function changeTypeText(e){
    let targetSelect = e.target.parentElement.parentElement.children[0];
    let optionTextContent = e.target.textContent;

    targetSelect.textContent = optionTextContent;     
}

function secondaryTypeChange(e){
    let formType = checkClassType( document.querySelector('.record_edit .now_type').textContent);
    let typeListData;
    let mainTypeName = e.target.textContent;
    let secondaryTypeList;
    let str = '';
    let secondaryTypeValue = e.target.parentElement.parentElement.parentElement.children[1].children[0];
    let secondaryTypeOption = e.target.parentElement.parentElement.parentElement.children[1].children[1]; 
    
    switch(formType){
        case 'cost':
            typeListData = costTypeListData;
            break;
        case 'revenue':
            typeListData = revenueTypeListData;
            break;
    }

    for(let i = 0; i < typeListData.length; i++){
        if(typeListData[i].mainType === mainTypeName){
            secondaryTypeList = typeListData[i].secondaryType;
        }
    }

    for(let i = 0; i < secondaryTypeList.length; i++){
        str += `<li class="btn">${secondaryTypeList[i]}</li>`;
    }

    secondaryTypeValue.textContent = secondaryTypeList[0];
    secondaryTypeOption.innerHTML = str;
}

function addRecordEditClass(e){
    console.log(e.composedPath())
    for(let i = 0; i < e.composedPath().length; i++){
        if(e.composedPath()[i].nodeName === 'BODY'){return}        

        let targetClassList = e.composedPath()[i].classList;

        if(targetClassList[0] === 'recordForm'){
            for(let k = 0; k < e.composedPath()[i].parentElement.children.length; k++){
                e.composedPath()[i].parentElement.children[k].classList.remove('record_edit');
            }
            e.composedPath()[i].classList.add('record_edit');
        }
    } 
}

function totalDayValueChange(){
    let dayRecordAmountList = document.querySelectorAll('.record_edit .amount');
    let formType = checkClassType(document.querySelector('.record_edit .now_type').textContent)
    let table = document.querySelector('.typeTotal .now_type');
    let tableType = '';

    let dayTotalAmount = 0;
    let year = parseInt(document.querySelector('.record_edit .year').textContent);
    let month = parseInt(document.querySelector('.record_edit .month').textContent);
    let date = parseInt(document.querySelector('.record_edit .date').textContent);

    let fullDate = {
        year: year,
        month: month,
        date: date
    }

    for(let i = 0; i < dayRecordAmountList.length; i++){
        if(dayRecordAmountList[i].value === ''){
            dayTotalAmount += 0;
        }else{
            dayTotalAmount += parseInt(dayRecordAmountList[i].value);
        }        
    } 

    showPropertyNowValue();
    
    if( !document.querySelector('.record_edit .totalValue') ){return}

    document.querySelector('.record_edit .totalValue').textContent = dayTotalAmount;

    showMonthTotal(fullDate.year, fullDate.month, formType);

    if( table ){
        tableType = checkClassType(table.textContent)
        showAllTypeValue(year, month, tableType);
    };
}

function showMonthTotal(year, month, formType){    
    let monthCostTotal = document.querySelector('.monthCostTotal .value') || 0;
    let monthRevenueTotal = document.querySelector('.monthRevenueTotal .value') || 0;

    let recordData = JSON.parse(localStorage.getItem('recordData')) || [];;

    let theMonthRecord = recordData.filter(function(item, index, array){
        return item.year === year && item.month === month && item.type === formType;
    });

    let totalAmount = theMonthRecord.reduce(function(accumulator, currentValue, currentIndex, array){
        return accumulator + currentValue.amount
    }, 0);

    switch(formType){
        case 'cost':
            monthCostTotal.textContent = totalAmount;
            break;
        case 'revenue':
            monthRevenueTotal.textContent = totalAmount;
            break;
    }   
}

function showPropertyNowValue(){
    let propertyList = document.querySelector('.propertyList') || 0;
    let str = '';

    for(let i = 0; i < paymentMethodData.length; i++){
        let method = paymentMethodData[i].method;
        let nowValue = paymentMethodData[i].nowValue;

        str += `<li class="property"><p class="name">${method}：</p><p class="value">${nowValue}</p></li>`;
    }

    propertyList.innerHTML = str;
}

function changeMonthRecord(e){
    let monthBtnNum = parseInt(e.target.dataset.month);
    let year = parseInt(document.querySelector('.year_month .year').textContent);

    updateRecord( year, monthBtnNum + 1);
    showMonthTotal( year, monthBtnNum + 1, 'cost' );
    showMonthTotal( year, monthBtnNum + 1, 'revenue' );
    showAllTypeValue( year, monthBtnNum + 1, 'cost');

    document.querySelector('.typeTotal .costBtn').setAttribute('class', 'costBtn btn btn_style recordBtn typeBtn now_type');    
    document.querySelector('.typeTotal .revenueBtn').setAttribute('class', 'revenueBtn btn btn_style recordBtn typeBtn');
}

function paymentMethodStorage(){
    if( !propertyOptionBox ){ return }

    let methodList = document.querySelectorAll('.propertyOptionBox .method');
    let initialValueList = document.querySelectorAll('.propertyOptionBox .initialValue');

    let paymentMethod = [];    

    for(let i = 0; i < methodList.length; i++){
        let nowValue = 0;
        
        nowValue = parseInt(initialValueList[i].value);

        for(let k = 0; k < paymentMethodData.length; k++){
            if(methodList[i].value === paymentMethodData[k].method){
                nowValue = parseInt(initialValueList[i].value) - paymentMethodData[k].initialValue + paymentMethodData[k].nowValue;
            }
        }

        paymentMethod.push({
            'method': methodList[i].value || '',
            'initialValue': parseInt(initialValueList[i].value) || 0,
            'nowValue': nowValue || 0
        });
    }

    setLocalStorage('paymentMethod', paymentMethod);
}

function createPaymentMethodListContent(method, initialValue){
    let str = `    
        <input type="text" class="method input_style" value="${method}" placeholder="資產名稱">
        <input type="text" class="initialValue input_style" value="${initialValue}" placeholder="初始金額">
        ${delBtn}
    `;

    return str;
}

function showPaymentMethod(){
    if( !propertyOptionBox ){ return }


    let str = '';

    for(let i = 0; i < paymentMethodData.length; i++){
        str += `<li>
        ${createPaymentMethodListContent(paymentMethodData[i].method, paymentMethodData[i].initialValue)}
        </li>`;
    }

    propertyOptionBox.innerHTML = str;    
}

function addPaymentMethodInput(){
    if( !propertyOptionBox ){ return }

    let newList = document.createElement('li');

    newList.innerHTML = createPaymentMethodListContent('', '');

    propertyOptionBox.appendChild(newList);
}

function changePropertyNowValue(paymentMethod){
    let recordData = JSON.parse(localStorage.getItem('recordData')) || [];;

    let assignedPaymentMethod = paymentMethodData.find(function(item, index, array){
        return item.method === paymentMethod;
    });
    
    let assignedPaymentMethodIndex = paymentMethodData.findIndex(function(item, index, array){
        return item.method === paymentMethod;
    });

    let costArray =  recordData.filter(function(item, index, array){
        return item.paymentMethod === paymentMethod && item.type === 'cost';
    });

    let revenueArray =  recordData.filter(function(item, index, array){
        return item.paymentMethod === paymentMethod && item.type === 'revenue';
    });

    let transferFromArray =  recordData.filter(function(item, index, array){
        return item.transferFrom === paymentMethod;
    });

    let transferToArray =  recordData.filter(function(item, index, array){
        return item.transferTo === paymentMethod;
    });

    let cost = costArray.reduce(function(accumulator, currentValue, currentIndex, array){
        return accumulator + currentValue.amount;
    }, 0);

    let revenue = revenueArray.reduce(function(accumulator, currentValue, currentIndex, array){
        return accumulator + currentValue.amount;
    }, 0);

    let transferFrom = transferFromArray.reduce(function(accumulator, currentValue, currentIndex, array){
        return accumulator + currentValue.amount;
    }, 0);

    let transferTo = transferToArray.reduce(function(accumulator, currentValue, currentIndex, array){
        return accumulator + currentValue.amount;
    }, 0);

    let processingFee = 0;

    assignedPaymentMethod.nowValue = assignedPaymentMethod.initialValue - cost + revenue - transferFrom + transferTo;

    paymentMethodData.splice( assignedPaymentMethodIndex, 1, assignedPaymentMethod )

    setLocalStorage('paymentMethod', paymentMethodData);  
}

function changeAllPropertyNowValue(){
    for(let i = 0; i < paymentMethodData.length; i++){
        changePropertyNowValue(paymentMethodData[i].method);
    }
}

function changeFormContent(formType){    
    let recordList = document.querySelector('.record_edit .recordList');
    let btnAndTotalBox = document.querySelector('.record_edit .btnAndTotalBox');
    
    let year = parseInt(document.querySelector('.record_edit .year').textContent);    
    let month = parseInt(document.querySelector('.record_edit .month').textContent);
    let day = parseInt(document.querySelector('.record_edit .date').textContent);

    let editRecordData = createRecordListContent(year,month, day, formType);

    switch( formType ){
        case 'cost':
        case 'revenue':
            let listContentStr = editRecordData.str;   
            let totalDayValue = editRecordData.totalDay;   
        
            recordList.innerHTML = listContentStr;

            btnAndTotalBox.innerHTML = `
                <div class="btnBox">
                    ${addBtn}
                    ${commonlyBtn}
                </div>                
                <p class="total">總計：<span class="totalValue">${totalDayValue}</span></p>
            `;
            break;
        case 'transfer':
            recordList.innerHTML = editRecordData;

            btnAndTotalBox.innerHTML = `
                <div class="btnBox">
                    ${addBtn}
                    ${commonlyBtn}
                </div>  
            `;
            break;
    }
}

function changeFormType(e){
    for(let i = 0; i < e.target.parentElement.children.length; i++){
        e.target.parentElement.children[i].classList.remove('now_type');
    }
    e.target.classList.add('now_type')
}

function createNewMainTypeListContent(boxType){
    let mainTypeListBox = document.querySelector('.mainTypeBox .mainTypeList');
    let newList = document.createElement('li');
    let typeListData;

    switch(boxType){
        case 'cost':
            typeListData = costTypeListData;
            break;
        case 'revenue':
            typeListData = revenueTypeListData;
            break;   
    } 

    newList.innerHTML = `<input value="" placeholder="請輸入主分類" class="input_style">${delBtn}`;

    newList.setAttribute('data-list', `${ typeListData.length }`)

    mainTypeListBox.appendChild(newList);
}

function createNewSecondaryTypeListContent(){
    let secondaryTypeListBox = document.querySelector('.secondaryTypeBox .secondaryTypeList');
    let newList = document.createElement('li');

    newList.innerHTML = `<input value="" placeholder="請輸入次分類" class="input_style">${delBtn}`;

    secondaryTypeListBox.appendChild(newList);
}

function createTypeListContent(boxType){
    let mainTypeListBox = document.querySelector('.mainTypeBox .mainTypeList');
    let secondaryTypeListBox = document.querySelector('.secondaryTypeBox .secondaryTypeList')
    let mainTypeStr = '';
    let secondaryTypeStr = '';
    let typeListData;

    switch(boxType){
        case 'cost':
            typeListData = costTypeListData;
            break;
        case 'revenue':
            typeListData = revenueTypeListData;
            break;   
    }    

    mainTypeStr = `<li class="nowMainType" data-list="0"><input value="${typeListData[0].mainType}" placeholder="請輸入主分類" class="input_style">${delBtn}</li>`;

    for( let i = 1; i < typeListData.length; i++ ){
        mainTypeStr += `<li data-list="${i}"><input value="${typeListData[i].mainType}" placeholder="請輸入主分類" class="input_style">${delBtn}</li>`
    }

    for( let i = 0; i < typeListData[0].secondaryType.length; i++ ){
        secondaryTypeStr += `<li><input value="${typeListData[0].secondaryType[i]}" placeholder="請輸入次分類" class="input_style">${delBtn}</li>`
    }        

    mainTypeListBox.innerHTML = mainTypeStr;
    secondaryTypeListBox.innerHTML = secondaryTypeStr;
}

function showTypeList(){    
    if( !typeConfigBox ){ return }

    let boxType = checkClassType(document.querySelector('.typeConfig .now_type').textContent);

    createTypeListContent(boxType);
}

function changeSecondaryTypeList(mainType, boxType){
    let secondaryTypeListBox = document.querySelector('.secondaryTypeBox .secondaryTypeList')
    let str = '';
    let typeListData;

    switch(boxType){
        case 'cost':
            typeListData = costTypeListData;
            break;
        case 'revenue':
            typeListData = revenueTypeListData;
            break;   
    } 

    for( let i = 0; i < typeListData.length; i++ ){
        if( mainType === typeListData[i].mainType ){
            for( let k = 0; k < typeListData[i].secondaryType.length; k++ ){
                str += `<li><input value="${typeListData[i].secondaryType[k]}" placeholder="請輸入次分類" class="input_style">${delBtn}</li>`
            }
        }
    }
    
    secondaryTypeListBox.innerHTML = str;
}

$('body').on('change', '.propertyOption input', function(e){ 
    paymentMethodStorage();
});


document.querySelector('body').addEventListener('click', function(e){  
    addRecordEditClass(e);
}, true)

$('body').on('click', '.addBtn', function(e){   

    if( dayRecord || monthRecord ){

        addRecordList();

    }else if( e.target.previousElementSibling.className === 'propertyOptionBox' ){

        addPaymentMethodInput();

    }else if( e.target.parentElement.classList[0] === 'mainTypeBox' ){

        let boxType = checkClassType(document.querySelector('.typeConfig .now_type').textContent);
        createNewMainTypeListContent(boxType);

    }else if( e.target.parentElement.classList[0] === 'secondaryTypeBox' ){

        createNewSecondaryTypeListContent()
    }
})

$('body').on('click', '.recordForm .btnBox .typeBtn', function(e){    
    let formType = checkClassType(e.target.textContent);
    let editRecord = document.querySelector('.record_edit') || 0;

    if( editRecord ){
        recordEdit();
    
        changeFormContent(formType);
    }
});

$('body').on('click', '.recordForm .deleteBtn', function(e){    
    $(this).parent().parent().remove();

    recordEdit();
});

$('body').on('click', '.propertyOptionBox .deleteBtn', function(e){    
    $(this).parent().remove();
    
    paymentMethodStorage();
});

$('body').on('click', '.mainTypeBox .deleteBtn', function(e){        
    let boxType = checkClassType(document.querySelector('.typeConfig .now_type').textContent);
    let typeList;
    let newData;
    let dataNum = e.target.parentElement.dataset.list;

    $(this).parent().remove();
    
    switch( boxType ){
        case 'cost':
            newData = costTypeListData;

            newData.splice(dataNum, 1);
    
            changeSecondaryTypeList( newData[0].mainType, boxType)

            typeList = [
                newData,
                revenueTypeListData
            ];

            setLocalStorage('allTypeList', typeList);
            break;

        case 'revenue':
            newData = revenueTypeListData;

            newData.splice(dataNum, 1);

            changeSecondaryTypeList( newData[0].mainType, boxType)

            typeList = [
                costTypeListData,
                newData
            ];

            setLocalStorage('allTypeList', typeList);
            break;
    }
});

$('body').on('click', '.secondaryTypeBox .deleteBtn', function(e){        
    let boxType = checkClassType(document.querySelector('.typeConfig .now_type').textContent);
    let nowMainType = document.querySelector('.typeConfigBox .nowMainType');
    let typeList;
    let newData;
    let dataNum = nowMainType.dataset.list;

    $(this).parent().remove();

    let secondaryTypeList = document.querySelectorAll('.secondaryTypeBox input');
    let newList = [];

    for( let i = 0; i < secondaryTypeList.length; i++){                
        newList.push(secondaryTypeList[i].value)
    }
    
    switch( boxType ){
        case 'cost':
            newData = costTypeListData;

            newData[ dataNum ].secondaryType = newList;

            typeList = [
                newData,
                revenueTypeListData
            ];

            setLocalStorage('allTypeList', typeList);
            break;

        case 'revenue':
            newData = revenueTypeListData;

            newData[ dataNum ].secondaryType = newList;

            typeList = [
                costTypeListData,
                newData
            ];

            setLocalStorage('allTypeList', typeList);
            break;
    }
});

$('body').on('click', '.select', function(e){
    $(this).parent().siblings().find('.option').slideUp();
    $(this).parents('.dayRecordList').siblings().find('.option').slideUp();
    $(this).parents('.recordForm').siblings().find('.option').slideUp();
    $(this).next('.option').slideToggle(200);
});

$('body').on('click', '.option li', function(e){
    changeTypeText(e);
    recordEdit();    
});


$('body').on('click', '.mainType .option li', function(e){
    secondaryTypeChange(e);  
    recordEdit();     
});

$('body').on('change', '.dayRecordList input', function(e){ 
    
    if($(this)[0].value !== ''){
        $(this).addClass('input_fin');   
    }else{
        $(this).removeClass('input_fin')
    } 

    if( e.target.classList[0] === 'amount' && e.target.value !== ''){
        e.target.parentElement.nextElementSibling.children[1].classList.remove('ifAmountNotFin')
    }else if( e.target.classList[0] === 'amount' && e.target.value === ''){
        e.target.parentElement.nextElementSibling.children[1].classList.add('ifAmountNotFin')
    }

    recordEdit();
});


$('html').on('click', 'body', function(e){
    if(e.target.classList[0] === 'select'){ return };
    $('.option').slideUp(0);
});

$('body').on('click', '.typeBtn', function(e){
    changeFormType(e);
})

$('body').on('click', '.typeConfig .btnBox .btn', function(e){
    typeConfigBox.setAttribute('class', 'typeConfigBox');

    switch( e.target.classList[0] ){
        case 'costBtn':
            typeConfigBox.classList.add('costBox');
            break;
        case 'revenueBtn':
            typeConfigBox.classList.add('revenueBox')
            break;
    }

    showTypeList();
})

$('body').on('focus', '.typeConfig .mainTypeList input', function(e){
    $(this).parent().parent().find('.nowMainType').removeClass('nowMainType');
    e.target.parentElement.classList.add('nowMainType');
    changeSecondaryTypeList(e.target.value, checkClassType(document.querySelector('.typeConfig .now_type').textContent));
})

$('body').on('change', '.typeConfig .mainTypeList input', function(e){ 
    let boxType = checkClassType(document.querySelector('.typeConfig .now_type').textContent);
    let typeList;
    let newData;
    let dataNum = e.target.parentElement.dataset.list;
    
    switch( boxType ){
        case 'cost':
            newData = costTypeListData;

            if( newData[ dataNum ] ){
                newData[ dataNum ].mainType = e.target.value;
            }else{
                newData.push({
                    'mainType': e.target.value,
                    'secondaryType': ''
                })
            }

            typeList = [
                newData,
                revenueTypeListData
            ];

            setLocalStorage('allTypeList', typeList);
            break;

        case 'revenue':
            newData = revenueTypeListData;

            if( newData[ dataNum ] ){
                newData[ dataNum ].mainType = e.target.value;
            }else{
                newData.push({
                    'mainType': e.target.value,
                    'secondaryType': ''
                })
            }

            typeList = [
                costTypeListData,
                newData
            ];
            
            setLocalStorage('allTypeList', typeList);
            break;
    }
});

$('body').on('change', '.typeConfig .secondaryTypeList input', function(e){         
    let boxType = checkClassType(document.querySelector('.typeConfig .now_type').textContent);
    let nowMainType = document.querySelector('.typeConfigBox .nowMainType');
    let typeList;
    let newData;
    let dataNum = nowMainType.dataset.list;

    let secondaryTypeList = document.querySelectorAll('.secondaryTypeBox input');
    let newList = [];

    for( let i = 0; i < secondaryTypeList.length; i++){                
        newList.push(secondaryTypeList[i].value);
    }
    
    switch( boxType ){
        case 'cost':
            newData = costTypeListData;

            newData[ dataNum ].secondaryType = newList;

            typeList = [
                newData,
                revenueTypeListData
            ];

            setLocalStorage('allTypeList', typeList);
            break;

        case 'revenue':
            newData = revenueTypeListData;

            newData[ dataNum ].secondaryType = newList;

            typeList = [
                costTypeListData,
                newData
            ];

            setLocalStorage('allTypeList', typeList);
            break;
    }
});


if( monthMenu ){
    monthMenu.addEventListener('click', function(e){
        e.preventDefault();

        if( e.target.nodeName !== 'A' ){ return }

        changeMonthRecord(e);
        
        monthRecord.scrollTop = 0;
    });
}

$('body').on('click', '.typeTotal .btnBox .typeBtn', function(e){         
    let year = parseInt(document.querySelector('.year_month .year').textContent); 
    let month = parseInt(document.querySelector('.year_month .month').textContent);
    let type = checkClassType(document.querySelector('.typeTotal .now_type').textContent);

    showAllTypeValue(year, month, type);
});

function showAllTypeValue(year, month, type){
    let recordData = JSON.parse(localStorage.getItem('recordData')) || [];
    let table = document.querySelector('.infoBox .typeTotalBox');

    if(!table){return};

    let assignedMonthData = recordData.filter(function(item, index, array){
        return item.year === year && item.month === month;
    });
    let typeListData = [];

    switch(type){
        case 'cost':
            typeListData = costTypeListData;
            break;
        case 'revenue':
            typeListData = revenueTypeListData;
            break;
    }

    let str = '';

    for(let i = 0; i < typeListData.length; i++){
        let typeBox = '';
        let mainTypeTotal = 0;

        for(let k = 0; k< typeListData[i].secondaryType.length; k++){
            let sameSecondaryType = assignedMonthData.filter(function(item, index, array){
                return item.secondaryType === typeListData[i].secondaryType[k];
            });

            let total = sameSecondaryType.reduce(function(accumulator, currentValue, currentIndex, array){
                return accumulator + currentValue.amount;
            }, 0);

            typeBox += `
                <div class="secondaryTypeBox">
                    <p>${typeListData[i].secondaryType[k]}</p>
                    <p>${total}</p>
                </div>
            `;
            mainTypeTotal += total;
        }
        
        str += `
            <div class="typeBox">
                <div class="mainTypeBox">
                    <p class="mainType">${typeListData[i].mainType}</p>
                    <p>總計：${mainTypeTotal}</p>
                </div>
                <div class="allSecondaryTypeBox">${typeBox}</div>
            </div> 
        `;
    }
    
    table.innerHTML = str;
}



$('body').on('click', '.commonOptionBox .period.btn', function(e){
    $(this).parent().parent().next().toggleClass('hide');
});

$('body').on('click', '.commonOptionBox .periodConfigForm p', function(e){
    $(this).parent().parent().toggleClass('hide');
});

$('body').on('click', '.periodConfig', function(e){
    if( e.target.classList[0] !== 'periodConfig' ){return}
    $(this).toggleClass('hide');
});

$('body').on('click', '.menuBtn', function(e){
    e.preventDefault();

    $(this).prev().toggleClass('menuDrop');
})

document.querySelector('body').addEventListener('click', function(e){
    if( e.target.classList[0] === 'menuBtn' ){return}

    if(document.querySelector('.menuDrop')){
        document.querySelector('.menuDrop').setAttribute('class', 'menu')
    }    
}, false)

$('body').on('click', '.titleBox', function(e){
    $(this).toggleClass('hideBox')
    $(this).next('.canHide').slideToggle(200);
})

updateRecord(date.getFullYear(), date.getMonth() + 1);

showMonthTotal(date.getFullYear(), date.getMonth() + 1, 'cost');
showMonthTotal(date.getFullYear(), date.getMonth() + 1, 'revenue');
showAllTypeValue(date.getFullYear(), date.getMonth() + 1, 'cost');
showPropertyNowValue();
showPaymentMethod();
showTypeList();