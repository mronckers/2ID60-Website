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

      let addition = '<li class="list-group-item" id="item'+ newID +'">' + newtodo.todo + '<a href="" class="check-mark" id="'+ newID +'"><span class="float-right fas fa-check"></span></a></li>';
      $('#newList').append(addition);
    }

    $('#newItemInput').val('');
  }

  $('.closeBody').hide();
  $('.card-body').hide();
  $('.form-group').hide();

  $(document).on('click', '.removeCard', function(e) {
    e.preventDefault();
    $(this).parents('.card').remove();
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

  //handles mouse click for adding items to the new list
  $(document).on('click', '.addItem', function (e) {
      e.preventDefault();
      let todo = $(this).siblings('.form-control').val().trim();
      let list = $(this).parents('.card').attr('id');
      addToDo(todo, list);
      $(this).parents('.form-group').toggle();
      $(this).parents('.form-group').siblings('.addToDo').toggle();
  });

  //handles pressing enter for adding items to the new list
  $(document).on('keypress','.form-group', function(e) {
    if (e.which === 13) {
      console.log($(this).children('#newItemInput'));
        let todo = $('#newItemInput').val().trim();
        console.log(todo);
        addToDo(todo, 'Household');
        $(this).toggle();
        $(this).siblings('.addToDo').toggle();
        e.preventDefault();
    }

  });

  $(document).on('click', '.cancelAddItem', function(e) {
    e.preventDefault();
    $(this).parents('.form-group').toggle();
    $(this).parents('.form-group').siblings('.addToDo').toggle();
  });

  $(document).on('click', '.addToDo', function(e) {
    e.preventDefault();
    $('#newItemInput').val('');
    $(this).siblings('.form-group').toggle();
    $(this).toggle();

  });




});
