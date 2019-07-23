//Click to scrape articles
$('#new').on('click', function () {
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
    if ($(this).hasClass('edit')) {
        if ($in.val().trim() === '') {
            $in.focus();
            $in.val('');
        } else {
            editNote(idNote, $in.val());
        }
    } else {
        delNote(idArt, idNote);
    }
});

//Click to edit note
$('.noted').on('click', function () {
    const idArt = $(this).attr('id');
    const idNote = $(`#sub-${idArt}`).attr('data-id');
    addEdit(idArt, idNote);
});

const scrapeArticle = function() {
    $.ajax({
        method: 'GET',
        url: '/scrape'
    }).then(function(){
        location.reload()
    });
};

//Save Article
const saveArticle = function(id) {
    $.ajax({
        method: 'POST',
        url: `/save/${id}`,
    }).then(function(){
        location.reload()
    });
};

//Unsave Article
const unsaveArticle = function(id) {
    $.ajax({
        method: 'POST',
        url: `/unsave/${id}`,
    }).then(function(){
        location.reload()
    });
};

//Add Note
const addNote = function(id, text) {
    $.ajax({
        method: 'POST',
        url: `/add/${id}`,
        data: {
            text: text
        }
    }).then(function(){
        location.reload()
    });
};

//Delete Note
const delNote = function(idArt, idNote) {
    $.ajax({
        method: 'POST',
        url: `/sub/${idArt}/${idNote}`
    }).then(function(){
        location.reload()
    });
};

const editNote = function(idNote, text) {
    $.ajax({
        method: 'POST',
        url: `/edit/${idNote}`,
        data: {
            text: text
        }
    }).then(function(){
        location.reload()
    });
};