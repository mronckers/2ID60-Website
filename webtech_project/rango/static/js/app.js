$(document).on('ready', function() {

  let toDoArray = [];
  let listArray = [];

  let ToDo = function(todo, list) {
    this.todoAttr = todo;
    this.listAttr = list;
  };

  // Get the modal
  var modal1 = document.getElementById('id01');

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
      }
  }

  var modal2 = document.getElementById('id02');

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  }

  /* --------------------------------------------------------------------------
  Functions for adding lists to the main container
  ---------------------------------------------------------------------------*/
  //adds the lists to the arrays for storage later on
  let addList = function(list) {
    if (list) {

      /*CHECK*/
      /*listArray.push(listGood);
      save();*/
      drawList(list);

      $('.openBody').hide();
      $('.form-group').hide();
    }
  };

  //draws the lists
  var drawList = function(listGood) {
    let cardHTML = (
      '<div class="col-xs-12 col-sm-4">'+
          '<div class="card" id="'+ listGood + '">' +
              '<div class="card-header">'+
                 listGood +
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
  };


  /* --------------------------------------------------------------------------
  Functions for adding todo's to the specific list
  ---------------------------------------------------------------------------*/
  //adds todos to the array for storage later on
  let addToDo = function(todo, list) {
    if (todo) {
      let listGood = list.replace("'","").replace(";","").replace(/\s+/g, "");
      let todoGood = todo.replace("'","").replace(";","");

      /*CHECK*/
      /*newTodo = new ToDo(todoGood, listGood);
      toDoArray.push(newTodo);
      save();*/

      drawToDo(todoGood, listGood);

      $('#'+listGood).children('.card-add-more').children('.form-group').children('.input-group').children('.form-control').val('');
    }
  };

  //draws todo
  let drawToDo = function(todo, list) {
    let addition = (
      '<li class="list-group-item" id="'+ todo +'">'
        + todo +
        '<a href="" class="check-mark">'+
          '<span class="float-right fas fa-check"></span>'+
        '</a></li>'
      );

    $('#'+list).children('.card-body').children('.list-group').append(addition);
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
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  /* Short function for managing default success behaviour after $.ajax() */
  function onSuccessAJAX(data, textStatus, jqXHR) {
          /*TODO This should be notified to the user via pop up I guess*/
          if(jqXHR.status != 200){
            console.log('Error on db access ', jqXHR.status);
          }
  }

  /* Sends POST request to url with data.
   * In the case of List, data is the name of the list,
   * I the case of Task, the content (named 'name' and not 'content', sorry for that)
   * and the parent list name
   */
  function modifyAJAX(data, url, on_success = onSuccess){
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
  /*Sends post to reques modification of list*/
  function modifyListAJAX(listName, url){
    modifyAJAX({'name': listName}, url);
  }

  /*Sends post to request modification of task*/
  function modifyTaskAJAX(content, parent_list, url){
    modifyAJAX({'name': content, 'parent_list': parent_list}, url);
  }

  /*Sends post to request open_status toggling for lists*/
  function toggleOpenStatusAJAX(listName){
    modifyAJAX({}, '/toggle_open_status/')
  }

  /*Sends post to request search of list*/
  function searchListAJAX(string){
    return modifyAJAX({'string' : string}, '/search_list/', searchOnSuccess)
  }

  /* TODO a function here should be created to determine what
   * modifyAJAX does on success.
   * In this case, it would be fetching the returned json
   * and changing the html as needed*/
  function searchOnSuccess(data, textStatus, jqXHR){
    let do_something;
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
    //hide explanation if first list is added
    if ($('.row').is(':empty') && listGood) {
        //$('#explanation').hide();
    };

    addList(listGood);
    $('#inputFormList').slideToggle('fast');
    $('#inputListName').val('');

    /*Store at db*/
    modifyListAJAX(listGood,'/add_list/');

  });

  //handles the key "enter" after typing the list-name
  $(document).on('keypress','#inputListName', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      let listName = $('#inputListName').val().trim();
      let listGood = listName.replace("'","_").replace(";","_").replace(/\s+/g,"_");

      //hide explanation if first list is added
      if ($('.row').is(':empty') && listGood) {
          //$('#explanation').hide();
      };

      addList(listGood);
      $('#inputFormList').slideToggle('fast');
      $(this).val('');

      /*Store at db*/
      modifyListAJAX(listGood, '/add_list/');

    }
  });

  //handles the trash button to cancel adding a list
  $(document).on('click', '#cancelAddList', function(e) {
    e.preventDefault();
    $('#inputFormList').slideToggle('fast');
    $('#inputListName').val('');
  });




  /**********************************cards*************************************/

  //handles the trash button to remove the particular card
  $(document).on('click', '.removeCard', function(e) {
    e.preventDefault();
    $('#myModal').show();
    card = this;

    let ok = document.getElementById("OK");
    let cancel = document.getElementById("Cancel");
    let closePopUp = document.getElementById("closePopUp");

    ok.onclick = function() {
      deleteList(card);
      $('#myModal').hide();
      /*Delete at db*/
      let listName = $(card).parents('.card-header').text().trim()
      modifyListAJAX(listName, '/delete_list/');
    };

    cancel.onclick = function() {
      $('#myModal').hide();
    };

    closePopUp.onclick = function() {
      $('#myModal').hide();
    };

  });

  //deletes the list from the html and storage
  let deleteList = function(card) {
    $(card).parents('.col-xs-12').remove();
    /* CHECK*/
    /*for (let i=0; i < listArray.length; i++) {
      if (listArray[i] === $(card).parents('.card').attr('id')) {
        listArray.splice(i,1);
        save();
      };
    };*/
  }

  //handles the plus button to open the body of the card
  $(document).on('click', '.openBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.closeBody').toggle();
    $(this).parents('.card').children('.card-body').slideToggle('fast');
    /* Change open_status of list at the db*/
    let listName; /*TODO */
    toggleOpenStatusAJAX(listName);
  });

  //handles the minus button to close the body of the card
  $(document).on('click', '.closeBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.openBody').toggle();
    $(this).parents('.card').children('.card-body').slideToggle('fast');
    /* Change open_status of list at the db*/
    let listName; /*TODO */
    toggleOpenStatusAJAX(listName);
  });

  //handles the check-mark to delete the particular todo
  $(document).on('click', '.check-mark', function(e) {
    e.preventDefault();
    let parent_list = $(this).parents('.card').children('.card-header').text().replace(/\n/, '').trim();
    let content = $(this).parents('.list-group-item').attr('id');

    $(this).parents('.list-group-item').remove();


    /* CHECK */
    /*for (let i=0; i < toDoArray.length; i++) {
      if (toDoArray[i].todoAttr === $(this).parents('.list-group-item').attr('id')) {
        toDoArray.splice(i,1);
        save();
      };
    };*/

    /* update db */
    modifyTaskAJAX(content, parent_list, '/delete_task/')

  });

  //handles mouse click on plus button for adding items to the current list
  $(document).on('click', '.addItem', function (e) {
      e.preventDefault();
      let todo = $(this).siblings('.form-control').val();
      let list = $(this).parents('.card').attr('id');
      let listName = $(this).parents('.card').children('.card-header').text().replace(/\n/, '').trim();
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
      console.log(list)
      let listName = $(this).parents('.card').children('.card-header').text().replace(/\n/, '').trim();
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


  /* --------------------------------------------------------------------------
  Storage functions
  ---------------------------------------------------------------------------*/
  //draws the lists that are in the local storage of the browser
  let showLists = function() {
    let storedLists = JSON.parse(localStorage.getItem("toDoLists"));
    /*for (let i=0; i < storedLists.length; i++) {
      drawList(storedLists[i]);
    };*/
  };

  //draws the todos that are in the local storage of the browser
  let showToDos = function() {
    let storedToDos = JSON.parse(localStorage.getItem("TODOS"));
    /*for (let i=0; i < storedToDos.length; i++) {
      drawToDo(storedToDos[i].todoAttr, storedToDos[i].listAttr);
    };*/
  };

  //save the updated arrays to local storage
  let save = function() {
    localStorage["toDoLists"] = JSON.stringify(listArray);
    localStorage["TODOS"] = JSON.stringify(toDoArray);
  };


  /* ---------------------------------------------------------------------------
  Set the window to standard values
  ----------------------------------------------------------------------------*/
  //find out if there are already lists/todos in the local storage and draw them
  if (localStorage.getItem("toDoLists")) {
    listArray = JSON.parse(localStorage["toDoLists"]);
    showLists();
    if (localStorage.getItem("TODOS")) {
      toDoArray = JSON.parse(localStorage["TODOS"]);
      showToDos();
    };
  };

  $('#explanation').show();

  //show explanation only if there are no lists shown
  if ($('.row').is(':empty')) {
    //$('#explanation').show();
  } else {
    //$('#explanation').hide();
  };

  $('.openBody').hide();
  $('.form-group').hide();
  $('#inputFormList').hide();
  $('#userFunctionality').hide();

});
