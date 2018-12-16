$(document).on('ready', function() {

  var toDoLists = [];

  let ToDo = function(todo, list) {
    this.todo = todo;
    this.list = list;
  };

  let addToDo = function(todo, list) {
    if (todo) {
      newtodo = new ToDo(todo, list);

      toDoLists.push(newtodo);

      let listGood = newtodo.list.replace(/\s+/g, '').replace("'","");
      let todoGood = newtodo.todo.replace(/\s+/g, '').replace("'", "");
      let newID = listGood+todoGood;

      let addition = (
        '<li class="list-group-item">'
          + todo +
          '<a href="" class="check-mark">'+
            '<span class="float-right fas fa-check"></span>'+
          '</a></li>'
        );

      $('#'+list).children('.card-body').children('.list-group').append(addition);
      $('#'+list).children('.card-add-more').children('.form-group').children('.input-group').children('.form-control').val('');
    }
  };

  let addList = function(list) {
    if (list) {
      let cardHTML = (
        '<div class="col-xs-12 col-sm-4">'+
            '<div class="card" id="'+ list + '">' +
                '<div class="card-header">'+
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
      $('.closeBody').hide();
      $('.card-body').hide();
      $('.form-group').hide();
    }
  }

  if ($('.row').is(':empty')) {
    console.log("Empty");
    $('.row').append("Empty");
  };


  $('.closeBody').hide();
  $('.card-body').hide();
  $('.form-group').hide();
  $('#inputFormList').hide();

  $(document).on('click', '#openFormList', function(e) {
    e.preventDefault();
    $('#inputFormList').slideToggle('fast');
  });

  $(document).on('click', '#addList', function(e) {
    e.preventDefault();
    let listName = $('#inputListName').val().trim();
    addList(listName);
    $('#inputFormList').slideToggle('fast');
    $(this).val('');
  });

  $(document).on('keypress','#inputListName', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      let listName = $('#inputListName').val().trim();
      addList(listName);
      $('#inputFormList').slideToggle('fast');
      $(this).val('');
    }
  });

  $(document).on('click', '#cancelAddList', function(e) {
    e.preventDefault();
    $('#inputFormList').slideToggle('fast');
    $('#inputListName').val('');
  })

  $(document).on('click', '.removeCard', function(e) {
    e.preventDefault();
    $(this).parents('.col-xs-12').remove();
  });


  $(document).on('click', '.openBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.closeBody').toggle();
    $(this).parents('.card').children('.card-body').toggle();
  });

  $(document).on('click', '.closeBody', function(e) {
    e.preventDefault();
    $(this).toggle();
    $(this).siblings('.openBody').toggle();
    $(this).parents('.card').children('.card-body').toggle();
  });

  $(document).on('click', '.check-mark', function(e) {
    e.preventDefault();
    $(this).parents('.list-group-item').remove();
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

});
