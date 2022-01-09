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
      summary: show.summary,
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
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
            <img class="card-img-top" src="${show.image}"></img>
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">${show.summary}</p>
            <a href="#" class="btn btn-primary d-grid">View Episodes</a>
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
  // TODO: get episodes from tvmaze
  const res = await axios.get(
    'http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes'
  );
  console.log(res);
  // TODO: return array-of-episode-info, as described in docstring above
}
