$(document).on('ready', function() {
  let searchArray = [];

  /* --------------------------------------------------------------------------
  Functions for adding lists to the main container
  ---------------------------------------------------------------------------*/
  //draws the list in the current html file
  let addList = function(list) {
    if (list) {

      let cardHTML = (
        '<div class="col-xs-12 col-sm-4">'+
            '<div class="card" id="'+ list + '">' +
                '<div class="card-header" id="header'+list+'">'+
                   list +
                  '<a href="" class="removeCard"><span class="float-left fas fa-trash-alt"></span></a>'+
                  '<a href="" class="openBody"><span class="float-right fas fa-plus"></span></a>'+
                  '<a href="" class="closeBody"><span class="float-right fas fa-minus" ></span></a>'+
                '</div>'+
                '<div class="card-body text-left" id="card-body">'+
                  '<ul class="list-group list-group-flush" id="newList">'+
                  '</ul>'+
                '</div>'+
                '<div class="card-add-more">'+
                  '<form class="form-group">'+
                      '<div class="input-group">'+
                          '<input class="form-control" type="text" id="newItemInput" placeholder="To do...">'+
                          '<a href="" class="addItem"><span class="float-right fas fa-plus"></span></a>'+
                          '<a href="" class="cancelAddItem"><span class="float-right fas fa-trash-alt"></span></a>'+
                      '</div>'+
                  '</form>'+
                    '<button class="btn btn-block addToDo">'+
                        'Add to-do'+
                    '</button>'+
                '</div>'+
            '</div>'+
        '</div>'
        );

      $('.row').append(cardHTML);

      $('#'+list).children('.card-header').children('.openBody').hide();
      $('.form-group').hide();
    }
  };


  /* --------------------------------------------------------------------------
  Functions for adding todo's to the specific list
  ---------------------------------------------------------------------------*/
  //adds todos to the current html file
  let addToDo = function(todo, list) {
    if (todo) {
      let todoGood = todo.replace("'","").replace(";","");
      let todoWithoutSpace = todoGood.replace(/\s+/g, "")

      let addition = (
        '<li class="list-group-item" id="'+ todoWithoutSpace +'">'
          + todo +
          '<a href="" class="check-mark">'+
            '<span class="float-right fas fa-check"></span>'+
          '</a></li>'
        );

      $('#'+list).children('.card-body').children('.list-group').append(addition);

      $('#'+list).children('.card-add-more').children('.form-group').children('.input-group').children('.form-control').val('');
    }
  };



/*------------------------------------------------------*/
/*-------------- Functions for the AJAX posts ----------*/
/*------------------------------------------------------*/

  /* Function to get csrf token */
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  };

   /* Short function for managing default success behaviour after $.ajax() */
   function onSuccessAJAX(data, textStatus, jqXHR) {
          /*TODO This should be notified to the user via pop up I guess*/
          if(jqXHR.status != 200){
            console.log('Error on db access ', jqXHR.status);
          }
  };

  /* Sends POST request to url with data.
   * In the case of List, data is the name of the list and the colour,
   * I the case of Task, the content (named 'name')and the parent list name
   */
  function modifyAJAX(data, url, on_success = onSuccessAJAX){
    var csrf_token = getCookie('csrftoken');
    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        dataType : 'text',
        headers: {'X-CSRFToken': csrf_token },
        success: on_success,
        error : function (jqXHR, textStatus){
          console.log('Error on AJAX post:', textStatus);
        }
    });
  }

  /*Sends post to request modification of list*/
  function modifyListAJAX(listName, colour, url){
    modifyAJAX({'name': listName, 'colour': colour}, url);
  }

  /*Sends post to request modification of task*/
  function modifyTaskAJAX(content, parent_list, url){
    modifyAJAX({'name': content, 'parent_list': parent_list}, url);
  }

  /*Sends post to request open_status toggling for lists*/
  function toggleOpenStatusAJAX(listName){
    modifyAJAX({'name': listName}, '/toggle_open_status/')
  }

  /*Sends post to request search of list*/
  function searchListAJAX(string){
    return modifyAJAX({'string' : string}, '/search_list/', searchOnSuccess)
  }

  /* If the search result is successfull, the function creates
  * an array of searchresults of all lists that should be hidden
  * and hides those lists */
  function searchOnSuccess(data, textStatus, jqXHR){
    let jsonResult = JSON.parse(data);
    searchArray = jsonResult.lists;

    for (var i = 0; i < searchArray.length; i++) {
      let name = searchArray[i].name;
      let newId = '#'+name;
      $(newId).fadeOut();
    }
  }


  /*----------------------------------------------------------------------------
  All functions that handle user interaction
  ----------------------------------------------------------------------------*/



  /********************************* navbar **********************************/
  //handles clicking the user button by opening the "userfunctionality"
  $(document).on('click', '#openUserFunctionality', function(e) {
    e.preventDefault();
    $('#userFunctionality').slideToggle('fast');
  });


  //handles submitting the search query
  $('#searchFunction').submit(function(e) {
    e.preventDefault();

    //if there has been a search before, show all lists again, before hiding other lists
    if(searchArray) {
      for (var i = 0; i < searchArray.length; i++) {
        let name = searchArray[i].name;
        let newId = '#'+name;
        $(newId).fadeIn();
      }
    }

    //perform the searchOnSuccess with the given query and reset the input
    let searchInput = $('#searchInput').val().trim();
    $('#searchInput').val('');
    searchListAJAX(searchInput);
  });

  //undo the search, by showing all the hidden lists again
  $(document).on('click', '#undoSearch', function(e) {
    if(searchArray) {
      for (var i = 0; i < searchArray.length; i++) {
        let name = searchArray[i].name;
        let newId = '#'+name;
        $(newId).fadeIn();
      }
      //reset to "no previous search"
      searchArray = []
    }
  });

  //handles clicking the button "Add list" to open the form for lists
  $(document).on('click', '#openFormList', function(e) {
    e.preventDefault();
    $('#inputFormList').slideToggle('fast');
  });

  //handles the "plus button" after typing the list-name
  $(document).on('click', '#addList', function(e) {
    e.preventDefault();
    let listName = $('#inputListName').val().trim();
    let listGood = listName.replace("'","_").replace(";","_").replace(/\s+/g,"_");

    //hides the explanation that is only shown for novice users
    $('#explanation').hide();

    addList(listGood);
    $('#inputFormList').slideToggle('fast');
    $('#inputListName').val('');

    //set the color of the list in the html
    let color = $('input[name=color]:checked').val();
    let colorstyling = 'background-color: '+color + " !important";
    let listId = 'header'+listGood;
    document.getElementById(listId).setAttribute('style', colorstyling);

    /*Store at db*/
    modifyListAJAX(listGood, color,'/add_list/');

  });

  //handles the key "enter" after typing the list-name
  $(document).on('keypress','#inputListName', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      let listName = $('#inputListName').val().trim();
      let listGood = listName.replace("'","_").replace(";","_").replace(/\s+/g,"_");

      //hides the explanation that is only shown for novice users
      $('#explanation').hide();

      addList(listGood);
      $('#inputFormList').slideToggle('fast');
      $(this).val('');

      //set the color of the list in the html
      let color = $('input[name=color]:checked').val();
      let colorstyling = 'background-color: '+color + " !important";
      let listId = 'header'+listGood;
      document.getElementById(listId).setAttribute('style', colorstyling);

      /*Store at db*/
      modifyListAJAX(listGood, color, '/add_list/');

    }
  });

  //handles the trash button to cancel adding a list
  $(document).on('click', '#cancelAddList', function(e) {
    e.preventDefault();
    $('#inputFormList').slideToggle('fast');
    $('#inputListName').val('');
  });



  /**********************************cards*************************************/

  /****************************card header *********************************/
  //handles the trash can to remove the particular card
  $(document).on('click', '.removeCard', function(e) {
    e.preventDefault();
    $('#myModal').show(); //show pop up to be sure before deleting
    card = this;

    let ok = document.getElementById("OK");
    let cancel = document.getElementById("Cancel");
    let closePopUp = document.getElementById("closePopUp");

    //handle the buttons in the popup
    ok.onclick = function() {
      //delete from html
      $(card).parents('.col-xs-12').remove();
      $('#myModal').hide();

      /*Delete at db*/
      let listName = $(card).parents('.card-header').text().trim()
      modifyListAJAX(listName, "", '/delete_list/');
    };

    cancel.onclick = function() {
      $('#myModal').hide();
    };

    closePopUp.onclick = function() {
      $('#myModal').hide();
    };
  });

  //handles the plus button to open the body of the card
  $(document).on('click', '.openBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.closeBody').toggle();
    $(this).parents('.card').children('.card-body').slideToggle('fast');

    /* Change open_status of list at the db*/
    let listName = $(this).parents('.card').attr('id')
    toggleOpenStatusAJAX(listName);
  });

  //handles the minus button to close the body of the card
  $(document).on('click', '.closeBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.openBody').toggle();
    $(this).parents('.card').children('.card-body').slideToggle('fast');

    /* Change open_status of list at the db*/
    let listName = $(this).parents('.card').attr('id');
    toggleOpenStatusAJAX(listName);
  });



  /******************************card body***********************************/
  //handles the check-mark to delete the particular todo
  $(document).on('click', '.check-mark', function(e) {
    e.preventDefault();
    let parent_list = $(this).parents('.card').children('.card-header').text().replace(/\n/, '').trim();
    let content = $(this).parents('.list-group-item').text().trim();

    //delete in html
    $(this).parents('.list-group-item').remove();

    /* update db */
    modifyTaskAJAX(content, parent_list, '/delete_task/')

  });

  //handles mouse click on plus button for adding items to the current list
  $(document).on('click', '.addItem', function (e) {
      e.preventDefault();
      let todo = $(this).siblings('.form-control').val();
      let list = $(this).parents('.card').attr('id');
      let listName = $(this).parents('.card').children('.card-header').text().replace(/\n/, '').trim();

      //add in html
      addToDo(todo, list);
      $(this).parents('.form-group').toggle();
      $(this).parents('.form-group').siblings('.addToDo').toggle();

      /* Save task to the db*/
      modifyTaskAJAX(todo, listName, '/add_task/');

  });

  //handles pressing enter for adding items to the current list
  $(document).on('keypress','.form-control', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      let todo = $(this).val().trim();
      let list = $(this).parents('.card').attr('id');
      let listName = $(this).parents('.card').children('.card-header').text().replace(/\n/, '').trim();

      //add in html
      addToDo(todo, list);
      $(this).parents('.form-group').toggle();
      $(this).parents('.form-group').siblings('.addToDo').toggle();

      /* Save task to the db*/
      modifyTaskAJAX(todo, listName, '/add_task/');
    }
  });

  //handles pressing the cancel (trash-can) button for cancelling the addition of a todo
  $(document).on('click', '.cancelAddItem', function(e) {
    e.preventDefault();
    $(this).parents('.form-group').toggle();
    $(this).parents('.form-group').siblings('.addToDo').toggle();
  });

  //handles pressing the add-to-do button for opening the form to enter todo
  $(document).on('click', '.addToDo', function(e) {
    e.preventDefault();
    $(this).siblings('.form-control').val('');
    $(this).siblings('.form-group').toggle();
    $(this).toggle();
  });


  /* ---------------------------------------------------------------------------
  Set the window to standard values
  ----------------------------------------------------------------------------*/
  //show explanation for novice users
  $('#explanation').show();

  $('.form-group').hide();
  $('#inputFormList').hide();
  $('#userFunctionality').hide();

});
