const user = JSON.parse(localStorage.getItem('login'));

const $genreList = document.querySelector('.genre-list');
const $fragment = document.createDocumentFragment();
const $pagenation = document.querySelector('.pagenation');
const $pagenationContainer = document.querySelector('.pagenation-container');
const $previousBt = document.querySelector('.previousBt');
const $nextBt = document.querySelector('.nextBt');
const $pagenationFragment = document.createDocumentFragment();

const parsedUrl = new URL(window.location.href);
const urlId = parsedUrl.searchParams.get('id');

let genres = {};
let selectedGenre = {};
// 현재 페이지네이션의 선택되어진 요소
let currentPageElement;

// 페이지카운트
let pageCount = 1;

// main에서 가져온 id값을 discover API에 넣어준다.
(async () => {
  const resGenres = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=ko`,
  );
  const results = await resGenres.json();
  genres = results.genres;

  const resDiscover = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${urlId}`,
  );
  const { results: movies } = await resDiscover.json();
  const genreName = genres.find(genre => genre.id === +urlId);
  $main__name.textContent = genreName.name;
  movies.forEach(movie => render(movie));
  $result__movies.appendChild($fragment);

  genres.forEach(genre => {
    if (genre.id === +urlId) {
      selectedGenre = genre.name;
    }
  });
})();

const pagenationBt = async direction => {
  // 이전버튼 숨기기
  if (pageCount === 1) {
    $previousBt.classList.remove('previousBtActive');
  } else {
    $previousBt.classList.add('previousBtActive');
  }

  // 현재 pagenationActive를 가진 클래스(a태그)의 textContent +1를 API의 Page값으로 넣어준다.
  $result__movies.textContent = '';
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageCount}&with_genres=${urlId}`,
  );
  const { results: movies } = await res.json();
  $main__name.textContent = selectedGenre.name;
  movies.forEach(movie => render(movie));
  $result__movies.appendChild($fragment);
  console.log(currentPageElement);

  // pagenationActive를 초기화 한후 이전페이지에다가 넣어준다.
  document
    .querySelector('.pagenationActive')
    .classList.remove('pagenationActive');
  direction === 'pre'
    ? currentPageElement.parentElement.previousElementSibling.firstElementChild.classList.add(
        'pagenationActive',
      )
    : currentPageElement.parentElement.nextElementSibling.firstElementChild.classList.add(
        'pagenationActive',
      );
  currentPageElement = document.querySelector('.pagenationActive');
};

// 미 로그인 시 로그인 페이지로 이동
if (!user.curlog) {
  window.location.href = '/';
}

// render함수로 DOM생성
const render = movie => {
  const $li = document.createElement(`li`);
  $li.id = movie.id;
  const $a = document.createElement('a');
  $a.href = '#';
  const $img = document.createElement('img');
  if (movie.poster_path === null) {
    $img.src = '../image/준비중.png';
  } else {
    $img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  }
  const textnode = document.createTextNode(movie.title);
  $a.appendChild($img);
  $a.appendChild(textnode);
  $li.appendChild($a);
  $fragment.appendChild($li);
};

// nav 클릭 시 장르에 맞는 영화들 렌더링
$genreList.onclick = async e => {
  if (!e.target.matches('.genre-list > li > a')) return;
  $result__movies.innerHTML = '';
  let selectedGenre = genres.find(genre => genre.name === e.target.textContent);

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${urlId}`,
  );
  const { results: movies } = await res.json();
  $main__name.textContent = selectedGenre.name;
  movies.forEach(movie => render(movie));
  $result__movies.appendChild($fragment);
};

// 스크롤 top
$topBtn.onclick = e => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

// 스크롤이 최상단이면 topBtn 보이지 않기
window.onscroll = () => {
  let yOffset = window.pageYOffset;
  if (yOffset === 0) {
    $topBtn.style.display = 'none';
  } else {
    $topBtn.style.display = 'block';
  }
};

// 페이지네이션
window.onload = async () => {
  let i = 1;

  while (i <= 5) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}with_genres=${urlId}`,
    );
    const { results } = await res.json();

    if (results.length === 0) break;

    const $li = document.createElement('li');
    const $a = document.createElement('a');
    $a.textContent = i;
    $a.setAttribute('href', '#');
    $li.append($a);

    $pagenationFragment.append($li);
    i++;
  }

  $pagenation.append($pagenationFragment);

  // 온로드시 가장 첫번째 페이지네이션 1번 요소가 pagenationActive 클래스가 들어가게 한다.
  $pagenation.firstElementChild.firstElementChild.classList.add(
    'pagenationActive',
  );
  currentPageElement = document.querySelector('.pagenationActive');
};

// 페이지네이션을 클릭한 이벤트
$pagenation.onclick = async e => {
  // a태그를 클릭하지 않으면 이벤트 발생하지 않는다.
  if (!e.target.matches('a')) return;
  pageCount = +e.target.textContent;

  // 이전버튼 숨기기
  if (pageCount === 1) {
    $previousBt.classList.remove('previousBtActive');
  } else {
    $previousBt.classList.add('previousBtActive');
  }

  // 영화를 표시하는 부분을 초기화해준다.
  $result__movies.textContent = '';

  // 영화 이미지, 타이틀 렌더
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${e.target.textContent}&with_genres=${urlId}`,
  );
  const { results: movies } = await res.json();
  $main__name.textContent = selectedGenre.name;
  movies.forEach(movie => render(movie));
  $result__movies.appendChild($fragment);

  // 클릭한 요소에 pagenationActive를 초기화후 넣어준다.
  document
    .querySelector('.pagenationActive')
    .classList.remove('pagenationActive');
  e.target.classList.add('pagenationActive');

  currentPageElement = document.querySelector('.pagenationActive');
};

// 이전버튼을 클릭한경우
$previousBt.onclick = async () => {
  // 페이지카운트를 이전,다음일때 감소,증가 시킨다.
  pageCount = pageCount - 1;

  // 만약 6,11,16번페이지로 넘어갈때 그리고 페이지가 1이아닌경우
  if (pageCount % 5 === 0) {
    // 페이지네이션를 초기화시킨다.
    $pagenation.textContent = '';

    // 5번만 렌더링 시킨다.
    for (let i = pageCount - 4; i < pageCount + 1; i++) {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}with_genres=${urlId}`,
      );
      const { results } = await res.json();

      if (results.length === 0) break;

      const $li = document.createElement('li');
      const $a = document.createElement('a');
      $a.textContent = i;
      $a.setAttribute('href', '#');
      $li.append($a);

      $pagenationFragment.append($li);
    }

    // 영화를 표시하는 부분을 초기화해준다.
    $result__movies.textContent = '';
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageCount}&with_genres=${urlId}`,
    );
    const { results: movies } = await res.json();
    $main__name.textContent = selectedGenre.name;
    movies.forEach(movie => render(movie));
    $result__movies.appendChild($fragment);

    $pagenation.append($pagenationFragment);

    // pagenationActive를 첫번째 요소로 지정한다.
    $pagenation.lastElementChild.firstElementChild.classList.add(
      'pagenationActive',
    );

    // 현재 페이지네이션 요소 초기화
    currentPageElement = document.querySelector('.pagenationActive');
  } else {
    await pagenationBt('pre');
  }
};

$nextBt.onclick = async () => {
  // 다음페이지 넘기기 버튼 숨기기
  if (
    currentPageElement === $pagenation.lastElementChild.firstElementChild &&
    $pagenation.childElementCount !== 5
  ) {
    $nextBt.style.display = 'none';
  }

  // 페이지카운트를 이전,다음일때 감소,증가 시킨다.
  pageCount = pageCount + 1;

  // 만약 6,11,16번페이지로 넘어갈때 그리고 페이지가 1이아닌경우
  if (pageCount % 5 === 1 && pageCount !== 1) {
    // 페이지네이션를 초기화시킨다.
    $pagenation.textContent = '';

    // 5번만 렌더링 시킨다.
    for (let i = pageCount; i < pageCount + 5; i++) {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}with_genres=${urlId}`,
      );
      const { results } = await res.json();

      if (results.length === 0) break;

      const $li = document.createElement('li');
      const $a = document.createElement('a');
      $a.textContent = i;
      $a.setAttribute('href', '#');
      $li.append($a);

      $pagenationFragment.append($li);
    }

    // 영화를 표시하는 부분을 초기화해준다.
    $result__movies.textContent = '';
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=ko&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageCount}&with_genres=${urlId}`,
    );
    const { results: movies } = await res.json();
    $main__name.textContent = selectedGenre.name;
    movies.forEach(movie => render(movie));
    $result__movies.appendChild($fragment);

    $pagenation.append($pagenationFragment);

    // pagenationActive를 첫번째 요소로 지정한다.
    $pagenation.firstElementChild.firstElementChild.classList.add(
      'pagenationActive',
    );

    // 현재 페이지네이션 요소 초기화
    currentPageElement = document.querySelector('.pagenationActive');
  } else {
    await pagenationBt('next');
  }
};
