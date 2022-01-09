const MISSING_IMAGE_URL = 'http://tinyurl.com/missing-tv';

/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
async function searchShows(query) {
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

  let shows = res.data.map(result => {
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
          <a href="${show.url}" target="_blank"><h5 class="card-header fw-bold">${show.name}</h5></a>
           <div class="card-body bg-light">
           <a href="${show.url}" target="_blank"><img class="card-img-top" src="${show.image}"></img></a>
            <p class="card-text fs-5 fw-bold">${show.genre}</p>
            <p class="card-text">${show.summary}</p>
            <button class="btn btn-primary d-grid" id="get-episodes">View Episodes</button>
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
$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();

  let query = $('#search-query').val();
  if (!query) return;

  $('#episodes-area').hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
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
      `<li>
         ${episode.name}
         (Season ${episode.season}, Ep. ${episode.number})
       </li>
      `
    );

    $episodesList.append($item);
  }

  $('#episodes-area').show();
}

/** Handle click on show name. */

$('#shows-list').on(
  'click',
  '#get-episodes',
  async function handleEpisodeClick(evt) {
    let showId = $(evt.target).closest('.Show').data('show-id');
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);
