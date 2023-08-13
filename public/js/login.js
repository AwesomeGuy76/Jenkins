const $loginBox = document.querySelector('.login-box');
const $loginId = document.querySelector('.login-id');
const $loginPw = document.querySelector('.login-pw');
const $errorMsgEmptyId = document.querySelector('.error-message-empty-id');
const $errorMsgEmptyPw = document.querySelector('.error-message-empty-pw');
const $loginButton = document.querySelector('.login-button');
const $loginRememberCheck = document.getElementById('idRememberCB');
const $signUpGo = document.querySelector('.sign-up-go');
const $errorMessage = document.querySelectorAll('.error-message');
const $inputBox = document.querySelectorAll('.inputBox');

let saveLogin;
let localUser;

// 스페이스 바 입력 방지 이벤트
[...$inputBox].forEach(
  input =>
    (input.onkeydown = e => {
      const kcode = e.keyCode;
      if (kcode === 32) return false;
    }),
);

//로그인 버튼 클릭때 Id, pw 빈문자열로 초기화해주기.
$loginButton.onclick = async () => {
  $errorMsgEmptyId.textContent = '';
  $errorMsgEmptyPw.textContent = '';
  
  const isUser = { id : $loginId.value, pw : $loginPw.value };

  console.log("trylogin");
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUser)
    });

    if (response.status === 400) {
      $errorMsgEmptyId.textContent = '아이디 또는 비밀번호를 확인해 주세요.';
      $errorMsgEmptyId.classList.add('active');
      $errorMsgEmptyId.previousElementSibling.classList.add('errorColor');
      return;
    }

    const responseData = await response.json();
    
    saveLogin = $loginRememberCheck.checked;
    console.log(response);
    localStorage.setItem(
      'login',
      JSON.stringify({
        id: responseData.id,
        name: responseData.name,
        genre: responseData.genre,
        savelog: saveLogin,
        curlog: true,
      }),
    );

    localUser = JSON.parse(localStorage.getItem('login'));

    window.location.href = '/html/main.html';
  } catch (err) {
    console.error('[ERROR~!]', err);
  }
};

// 회원가입 버튼 클릭시 signUp으로 이동.
$signUpGo.onclick = () => {
  window.location.href = '/html/signUp.html';
};

window.onload = () => {
  localUser = JSON.parse(localStorage.getItem('login'));
  if (localUser.savelog) {
    $loginId.value = localUser.id;
  }
};