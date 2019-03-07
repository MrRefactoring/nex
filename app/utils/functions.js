export {clipText,dayValue,getDay, getMonth, getMonthName, getToday, getTodaysMonth, getTodaySortable, getYear, properCase,
  readOnly,sendEmail,sendRecruitingEmail,setDlgComment,setDlgEdit,setDlgEditLarge,setDlgDropdown,truncLink,truncNum,truncText};

function clipText(text, count) {
  let str = text.toString();
  str=str.replace('  ',' ');

  //let len = str.length;
  let truncLen = parseInt(count);
  return str.slice(0,truncLen);
}

function dayValue(date){
  // Date format: mm/dd/yyyy

  //return zero if invalid date
  if (date==='' || date===null || date===undefined) {return 0;}

  let numbers = date.match(/\d+/g);
  let yyyy=parseInt(numbers[2]);
  let mm=parseInt(numbers[0]);
  let dd=parseInt(numbers[1]);

  if (yyyy>15 && yyyy<21) {yyyy=yyyy+2000;}
  else if (yyyy>2020 || yyyy<2000){yyyy=2000;}

  //range checking
  if (mm<1 || mm>12) {mm=0;}
  if (dd<1 || dd>31) {dd=0;}
  return (yyyy-2000)*365+mm*30+dd;
}

function sendEmail(to, subject, body){
  let email={to: to,subject:subject,body:body};
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: 'https://hooks.zapier.com/hooks/catch/2085985/5ay4va/',
      //contentType: 'application/json',
      //contentType: 'multipart/form-data',
      //dataType: 'text',
      data: JSON.stringify(email),
      processData: false,
      statusCode: {
        200: () => Em.run(null, resolve),
        500: () => Em.run(null, reject)
      }
    });
  });
}

function readOnly(context) {
  if (context.get('user.readOnly')===true) {return true;}
  else {return false;}
}

function sendRecruitingEmail(to, subject, body) {
  let email = {to: to, subject: subject, body: body};
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: 'https://hooks.zapier.com/hooks/catch/2085985/5pcv4w/',
      data: JSON.stringify(email),
      processData: false,
      statusCode: {
        200: () => Em.run(null, resolve),
        500: () => Em.run(null, reject)
      }
    });
  });
}

function getDay(date){
  //return zero if invalid date
  if (date==='' || date===null || date===undefined) {return 0;}
  let numbers = date.match(/\d+/g);
  return parseInt(numbers[1]);
}

function getMonth(date){
  //return zero if invalid date
  if (date==='' || date===null || date===undefined) {return 0;}
  let numbers = date.match(/\d+/g);
  return parseInt(numbers[0]);
}

function getMonthName(mth){
  let month=parseInt(mth);
  let lookup=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return lookup[month-1];
}

function getYear(date){
  //return zero if invalid date
  if (date==='' || date===null || date===undefined) {return 0;}
  let numbers = date.match(/\d+/g);
  return parseInt(numbers[2]);
}


function getToday(zeroPadDate=false) {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (zeroPadDate) {
    if (dd < 10) {dd = '0' + dd;}
    if (mm < 10) {mm = '0' + mm;}
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function getTodaysMonth(zeroPadDate=false) {
  let today = new Date();
  return today.getMonth() + 1; //January is 0!
}

function getTodaySortable() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {dd = '0' + dd;}
  if (mm < 10) {mm = '0' + mm;}

  today = yyyy + '_' + mm +'_' + dd;
  return today;
}

function properCase(str){
  // 1. lower case the whole string
  str = str.toLowerCase();

  // 2.Split the string into an array of strings
  str = str.split(' ');

  // 3. Upper Case the pieces
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }

  // 4. Join and Return
  return str.join(' ');
}

function setDlgEdit(self,title){
  self.set('title', title);
  self.set('showDlg', 'EDIT');
}

function setDlgEditLarge(self,title){
  self.set('title', title);
  self.set('showDlg', 'EDIT_LARGE');
}

function setDlgComment(self,title){
  self.set('title', title);
  self.set('showDlg', 'COMMENT');
}

function setDlgDropdown(self,title,list){
  self.set('title', title);
  self.set('dlgDropdown', self.get(list));
  self.set('showDlg', 'DROPDOWN');
}

function truncText(text, count) {
  let str = '';
  try{
    str = text.toString();
  }
  catch(err){str='';}
  str=str.replace('  ',' ');

  let len = str.length;
  let truncLen = parseInt(count);
  let result='';

  if (truncLen<=len) {
    result = str.slice(0,truncLen);
  }
  else {
    result = str+String.fromCharCode(160).repeat(truncLen-len);
  }
  return result;
}

function truncNum(text, count) {
  let str = '';
  try{
    str = text.toString();
  }
  catch(err){str='';}
  str=str.replace('  ',' ');

  let len = str.length;
  let truncLen = parseInt(count);
  let result='';

  if (truncLen<=len) {
    result = str.slice(0,truncLen);
  }
  else {
    result = String.fromCharCode(160).repeat(truncLen-len)+str;
  }
  return result;
}

function truncLink(text, url, count) {
  let str = text.toString();
  str=str.replace('  ',' ');
  let space='';

  let len = str.length;
  let truncLen = parseInt(count);

  if (truncLen<=len) {
    str = str.slice(0,truncLen);
  }
  else {
    space=String.fromCharCode(160).repeat(truncLen-len);
  }

  let result = '<a target="_blank" href="'+url+'">'+str+'</a>'+space;
  return result;
}
