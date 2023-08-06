const $signUp = document.querySelector('.signUp');
const $signUpBt = document.querySelector('.signUp-bt');
const $signUpForm = document.querySelector('.signUp-form');
const $signupName = document.querySelector('.signup-name');
const $signupId = document.querySelector('.signup-id');
const $signupPw = document.querySelector('.signup-pw');
const $signupRepw = document.querySelector('.signup-repw');
const $signUpInput = document.querySelectorAll('.signUp-input');
const $preference = document.querySelector('.preference');
const $guideMessage = document.querySelector('.guideMessage');

let errorCount = 0;
let checkblankCount = 0;

const showErrorInput = input => {
  if (input.classList.contains('correctColor')) {
    input.classList.remove('correctColor');
  }
  input.classList.add('errorColor');
};

const showCorrectInput = input => {
  if (input.classList.contains('errorColor')) {
    input.classList.remove('errorColor');
    input.nextElementSibling.textContent = '';
  }
  input.classList.add('correctColor');
};

// input 빈칸 확인
// 만약 빈칸이면 errorColor class를 추가하고
// 빈칸이 아니면 correctColor class를 추가한다.
const checkblank = input => {
  const reg = /^[A-Za-z0-9가-힣+]*$/g;
  if (!input.value.trim() || !reg.test(input.value)) {
    showErrorInput(input);
    input.nextElementSibling.textContent =
      input.id === 'id'
        ? '아이디를 입력해 주세요.'
        : input.id === 'name'
        ? '이름을 입력해 주세요.'
        : input.id === 'pw'
        ? '비밀번호를 입력해 주세요.'
        : '비밀번호 확인을 입력해 주세요.';
  } else {
    showCorrectInput(input);
  }
};

// 아이디 조건확인 및 중복확인
const checkValidId = async input => {
  try {
    // 조건확인
    // 정규표현식 조건 : 4자이상 영어와 숫자
    const regId = /^[A-Za-z0-9+]{4,15}$/g;
    if (!regId.test(input.value)) {
      showErrorInput(input);
      input.nextElementSibling.textContent =
        '아이디는 4~12자, 영어와 숫자로 입력해 주세요.';
      return;
    } else {
      showCorrectInput(input);
    }

    // id중복확인 : DB에서 id 가져와 중복이면 경고문
    const res = await fetch('/users');
    const users = await res.json();
    const userIds = users.map(user => user.id);
    if (userIds.find(userId => userId === input.value)) {
      if (input.classList.contains('correctColor')) {
        input.classList.remove('correctColor');
      }
      input.classList.add('errorColor');
      input.nextElementSibling.textContent = '아이디가 이미 존재합니다.';
    }
  } catch (err) {
    console.log('[ERROR]', err);
  }
};

// 비밀번호 조건 확인
const checkValidPw = input => {
  const regPw = /^[A-Za-z0-9+]{4,15}$/g;
  if (!regPw.test(input.value)) {
    showErrorInput(input);
    input.nextElementSibling.textContent =
      '비밀번호는 4~12자, 영어와 숫자로 입력해 주세요.';
  } else {
    showCorrectInput(input);
  }
};

// 비밀번호 중복 확인
const checkValidRepw = input => {
  if (
    input.value !== input.previousElementSibling.previousElementSibling.value
  ) {
    showErrorInput(input);
    input.nextElementSibling.textContent = '비밀번호가 서로 다릅니다.';
  } else {
    showCorrectInput(input);
  }
};

// Event Handler
$signUp.onkeyup = e => {
  if (!e.target.matches('input')) return false;
  checkblank(e.target);
  if (e.target.id === 'id') checkValidId(e.target);
  if (e.target.id === 'pw') checkValidPw(e.target);
  if (e.target.id === 'repw') checkValidRepw(e.target);
};

$signUp.onkeydown = e => {
  if (e.keyCode === 32) return false;
};

$signUpForm.onsubmit = e => {
  e.preventDefault();

  // 인풋창에 값이 없는경우 errorCount값을 늘려준다
  $signUpInput.forEach(v => {
    if (v.value === '') errorCount++;
  });

  // 만약 errorCount값이 양수이거나, errorColor를 가진 클래스가 있다면 이벤트를 중단한다.
  if (document.querySelector('.errorColor') || errorCount > 0) {
    errorCount = 0;
    $guideMessage.classList.add('guideMessageActive');
    return;
  }
  if ($preference.options[$preference.selectedIndex].value === 'none') {
    $preference.nextElementSibling.textContent = '선호 장르를 선택해 주세요';
    return;
  }

  const formData = new FormData($signUpForm);
  const signUp = {};

  for (const pair of formData) {
    signUp[pair[0]] = pair[1];
  }

  fetch('/users', {
    method: 'POST',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify(signUp),
  });

  location.assign('/');
};
