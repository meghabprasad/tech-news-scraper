//Click to scrape news
$('#new').on('click', () => {
  scrapeArticle();
});

//Click to save article
$('.save').on('click', function () {
  saveArticle($(this).attr('data-id'));
});

//Click to unsave article
$('.unsave').on('click', function () {
  unsaveArticle($(this).attr('data-id'));
});

//Click to add note
$('.plus').on('click', function () {
  const id = $(this).attr('id').slice(4);
  const $in = $(`#${id}`);
  if ($in.val().trim() === '') {
    $in.focus();
    $in.val('');
  } else {
    addNote(id, $in.val());
  }  
});

//Click to delete note
$('.minus').on('click', function () {
  const idArt = $(this).attr('id').slice(4);
  const idNote = $(`#sub-${idArt}`).attr('data-id');
  const $in = $(`#${idArt}`);

    delNote(idArt, idNote);
  
});

// Determine what to do if keys are pressed in input
$('input').on('keyup', function (e) {
  const idArt = $(this).attr('id');
  const idNote = $(`#sub-${idArt}`).attr('data-id');
  if (e.keyCode === 13) {
    if ($(`#add-${idArt}`).length !== 0) {
      if ($(this).val().trim() === '') {
        $(this).focus();
        $(this).val('');
      } else {
        addNote(idArt, $(this).val());
      }      
    }
  } 
});


/***** Separate ajax calls for future multiple use *****/
//Scrape Article
const scrapeArticle = () => {
  $.ajax({
    method: 'GET',
    url: '/scrape'
  }).then( () => location.reload() );  
};

//Save Article
const saveArticle = (id) => {
  $.ajax({
    method: 'POST',
    url: `/save/${id}`,
  }).then( () => location.reload() );
};

//Unsave Article
const unsaveArticle = (id) => {
  $.ajax({
    method: 'POST',
    url: `/unsave/${id}`,
  }).then( () => location.reload() );
};

//Add Note
const addNote = (id, text) => {
  $.ajax({
    method: 'POST',
    url: `/add/${id}`,
    data: {
      text: text
    }
  }).then( () => location.reload() );
};

//Delete Note
const delNote = (idArt, idNote) => {
  $.ajax({
    method: 'POST',
    url: `/sub/${idArt}/${idNote}`
  }).then( () => location.reload() );
};


