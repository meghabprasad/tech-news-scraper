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
  
  //Click editing note
  $('.noted').on('click', function () {
    const idArt = $(this).attr('id');
    const idNote = $(`#sub-${idArt}`).attr('data-id');
    addEdit(idArt, idNote);
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
      } else if ($(`#edit-${idArt}`).length !== 0) {
        if ($(this).val().trim() === ''
            || $(this).val().trim() === $(this).attr('value')) {
          $(this).val($(this).attr('value'));
          $(this).blur();
          $(`#edit-${idArt}`).remove();
        } else {
          editNote(idNote, $(this).val());
        }
      }
    } else {
      if ($(`#edit-${idArt}`).length === 0) {
        addEdit(idArt, idNote);
      }    
    }
  });
  
  //Add Edit Button
  const addEdit = (idArt, idNote) => {
    const $in = $(`#${idArt}`);
    if ($(`#edit-${idArt}`).length === 0) {
      const $edit = $('<div>').addClass('edit').attr({
        id: `edit-${idArt}`,
        'data-id': idNote
      }).html('✎').css('border', 'none');
  
      $edit.insertAfter($(`#sub-${idArt}`)).on('click', function () {
        if ($in.val().trim() === ''
            || $in.val().trim() === $in.attr('value')) {
          $in.val($in.attr('value'));
          $(this).remove();
        } else {
          editNote(idNote, $in.val());
        }     
      })
    }
  };
  
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
  
  //Edit Note
  const editNote = (idNote, text) => {
    $.ajax({
      method: 'POST',
      url: `/edit/${idNote}`,
      data: {
        text: text
      }
    }).then( () => location.reload() );
  };
  