const MISSING_IMAGE_URL = 'https://tinyurl.com/missing-tv';

/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
async function searchShows(query) {
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);

  const shows = res.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      genre: show.genres[0] ? show.genres[0] : '',
      summary: show.summary,
      url: show.url,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL
    };
  });

  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card my-3" data-show-id="${show.id}">
          <a href="${show.url}" target="_blank" class="text-decoration-none"><h5 class="card-header fw-bold">${show.name}</h5></a>
           <div class="card-body bg-light">
           <a href="${show.url}" target="_blank"><img class="card-img-top" src="${show.image}"></img></a>
            <p class="card-text fs-5 fw-bold">${show.genre}</p>
            <p class="card-text">${show.summary}</p>
            <!-- trigger modal button -->
            <button type="button" class="btn btn-primary col-12" id="get-episodes" data-bs-toggle="modal" data-bs-target="#episodeModal">View Episodes</button>
           </div>
         </div>
       </div>
      `
    );
    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$('#search-form').on('submit', async function handleSearch(e) {
  e.preventDefault();

  const query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  const shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const response = await axios.get(
    `https://api.tvmaze.com/shows/${id}/episodes`
  );

  const episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
    summary: episode.summary,
    url: episode.url,
    image: episode.image ? episode.image.medium : MISSING_IMAGE_URL
  }));

  return episodes;
}

/** Populate episodes list:
 *     - given list of episodes, add espiodes to DOM
 */

function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li class="mb-3">
         <a href="${episode.url}" target="blank" class="list-group-item list-group-item-action">
         <span class="m-0 fs-5 fw-bold text-primary">Season ${episode.season}, Ep. ${episode.number} - ${episode.name}</span>
         <p class="m-0">${episode.summary}</p>
         <img src="${episode.image}" alt="episode preview image" class="m-0">
         </a>
       </li>
      `
    );
    $('episodeModalLabel').html(`<b>${episode} - Episodes</b>`);
    $episodesList.append($item);
  }

  $('#episodes-area').show();
}

/** SHOW EPISODES IN POP UP MODAL */
$('#shows-list').on(
  'click',
  '#get-episodes',
  async function handleEpisodeClick(e) {
    const showId = $(e.target).closest('.Show').data('show-id');
    const episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);

/** BOOTSTRAP POP UP MODAL REQ CODE*/
const myModal = document.getElementById('episodeModal');
const myInput = document.getElementById('myInput');

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus();
});
