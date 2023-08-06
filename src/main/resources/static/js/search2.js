// localStorage User정보
const currUser = JSON.parse(localStorage.getItem('login'));
// Doms
const $searchForm = document.querySelector('.search-form');
const $searchBar = document.querySelector('.search-bar');
const $resultMovies = document.querySelector('.result__movies');
const $logoutBtn = document.querySelector('.logout-btn');
// States
let pageCount = 1;
let inputValue = '';
//event handler
// 검색 API로 화면에 렌더하기 함수
const movieRender = async () => {
  // 검색창 입력 시 영화 API로 검색 정보 가져오기
  let html = '';
  inputValue = $searchBar.value;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ko&query=${$searchBar.value}&page=${pageCount}&include_adult=false`,
    );
    const movies = await res.json();
    if ($searchBar.value)
      movies.results.forEach(movie => {
        html += `<li class='${movie.id}'>
      <a href="#">
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"></img>
      ${movie.title}
      </a>
      </li>`;
      });
    $resultMovies.insertAdjacentHTML('beforeend', `${html}`);
    if (!movies.results.length || movies.results.length < 20)
      $moreBtn.style.display = 'none';
    else $moreBtn.style.display = 'inline-block';
    pageCount++;
  } catch (err) {
    console.log(err);
  }
};
// top버튼 디스플레이 함수
const displayTopbtn = _.throttle(() => {
  if (window.scrollY) $topBtn.style.display = 'block';
  else $topBtn.style.display = 'none';
}, 300);

window.onload = e => {
  if (!currUser) {
    // 미 로그인 시 로그인 페이지로 이동
    window.location.assign('/');
  }
  // localstorage에 있는 이름을 화면에 렌더링
  document.querySelector('.main__name').textContent = currUser.name;
  displayTopbtn();
};
$searchForm.onsubmit = e => {
  e.preventDefault();
  pageCount = 1;
  $resultMovies.innerHTML = '';
  movieRender();
};
// 더보기 버튼 클릭시 다음 페이지 렌더링
$moreBtn.onclick = e => {
  movieRender();
};
// (아래는 안해도 상관X)
// 로그아웃 버튼
$logoutBtn.onclick = e => {
  localStorage.removeItem('login');
};
// 스크롤 top 버튼
$topBtn.onclick = e => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
};
// 스크롤 최상단 시 top 버튼 안보이기
window.onscroll = e => {
  displayTopbtn();
};
