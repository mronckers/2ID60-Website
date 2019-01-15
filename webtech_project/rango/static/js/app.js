$(document).on('ready', function() {

  let toDoArray = [];
  let listArray = [];

  let ToDo = function(todo, list) {
    this.todoAttr = todo;
    this.listAttr = list;
  };


  /* --------------------------------------------------------------------------
  Functions for adding lists to the main container
  ---------------------------------------------------------------------------*/
  //adds the lists to the arrays for storage later on
  let addList = function(list) {
    if (list) {
      let listGood = list.replace("'","").replace(";","").replace(/\s+/g,"");
      listArray.push(listGood);
      save();
      drawList(listGood);

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

      newTodo = new ToDo(todoGood, listGood);
      toDoArray.push(newTodo);
      save();

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

    //hide explanation if first list is added
    if ($('.row').is(':empty') && listName) {
        $('#explanation').hide();
    };

    addList(listName);
    $('#inputFormList').slideToggle('fast');
    $('#inputListName').val('');
  });

  //handles the key "enter" after typing the list-name
  $(document).on('keypress','#inputListName', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      let listName = $('#inputListName').val().trim();

      //hide explanation if first list is added
      if ($('.row').is(':empty') && listName) {
          $('#explanation').hide();
      };

      addList(listName);
      $('#inputFormList').slideToggle('fast');
      $(this).val('');
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
    for (let i=0; i < listArray.length; i++) {
      if (listArray[i] === $(card).parents('.card').attr('id')) {
        listArray.splice(i,1);
        save();
      };
    };
  }

  //handles the plus button to open the body of the card
  $(document).on('click', '.openBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.closeBody').toggle();
    $(this).parents('.card').children('.card-body').slideToggle('fast');
  });

  //handles the minus button to close the body of the card
  $(document).on('click', '.closeBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.openBody').toggle();
    $(this).parents('.card').children('.card-body').slideToggle('fast');
  });

  //handles the check-mark to delete the particular todo
  $(document).on('click', '.check-mark', function(e) {
    e.preventDefault();
    $(this).parents('.list-group-item').remove();
    for (let i=0; i < toDoArray.length; i++) {
      if (toDoArray[i].todoAttr === $(this).parents('.list-group-item').attr('id')) {
        toDoArray.splice(i,1);
        save();
      };
    };
  });

  //handles mouse click on plus button for adding items to the current list
  $(document).on('click', '.addItem', function (e) {
      e.preventDefault();
      let todo = $(this).siblings('.form-control').val().trim();
      let list = $(this).parents('.card').attr('id');
      addToDo(todo, list);
      $(this).parents('.form-group').toggle();
      $(this).parents('.form-group').siblings('.addToDo').toggle();
  });

  //handles pressing enter for adding items to the current list
  $(document).on('keypress','.form-control', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      let todo = $(this).val().trim();
      let list = $(this).parents('.card').attr('id');
      addToDo(todo, list);
      $(this).parents('.form-group').toggle();
      $(this).parents('.form-group').siblings('.addToDo').toggle();
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
    for (let i=0; i < storedLists.length; i++) {
      drawList(storedLists[i]);
    };
  };

  //draws the todos that are in the local storage of the browser
  let showToDos = function() {
    let storedToDos = JSON.parse(localStorage.getItem("TODOS"));
    for (let i=0; i < storedToDos.length; i++) {
      drawToDo(storedToDos[i].todoAttr, storedToDos[i].listAttr);
    };
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

  $('#explanation').hide();
  
  //show explanation only if there are no lists shown
  if ($('.row').is(':empty')) {
    $('#explanation').show();
  } else {
    $('#explanation').hide();
  };

  $('.openBody').hide();
  $('.form-group').hide();
  $('#inputFormList').hide();
  $('#userFunctionality').hide();

});
