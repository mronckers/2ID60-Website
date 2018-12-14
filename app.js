$(document).on('ready', function() {

  var toDoLists = [];

  let ToDo = function(todo, list) {
    this.todo = todo;
    this.list = list;
  };

  let addToDo = function(todo, list) {
    if (todo) {
      newtodo = new ToDo(todo, list);

      let newID = newtodo.list.replace(/\s+/g, '') + newtodo.todo.replace(/\s+/g, '');
      toDoLists.push(newtodo);
      let addition = '<li class="list-group-item" id="item'+ newID +'">' + newtodo.todo + '<a href="" class="check-mark" id="'+ newID +'"><span class="float-right fas fa-check"></span></a></li>';
      console.log(addition);
      $('#newList').append(addition);
    }

    $('#newItemInput').val('');
  }

  let deleteToDo = function(todo) {

  }

  $('#closeBody').hide();
  $('#card-body').hide();
  $('#addToDoForm').hide();

  $(document).on('click', '.removeCard', function(e) {
    e.preventDefault();
    let id = $(this).attr('id');
    let newid = '#card'+id;
    $(newid).remove();
  });


  $('#openBody').on('click', function(e) {
    e.preventDefault();
    $('#openBody').toggle();
    $('#closeBody').toggle();
    $('#card-body').toggle();
  });

  $('#closeBody').on('click', function(e) {
    e.preventDefault();
    $('#openBody').toggle();
    $('#closeBody').toggle();
    $('#card-body').toggle();
  });

  $(document).on('click', '.check-mark', function(e) {
    e.preventDefault();
    console.log('here');
    let id = $(this).attr('id');
    console.log(id);
    let newid = '#item'+id;
    console.log(newid);
    $(newid).remove();
  });

  //handles mouse click for adding items to the new list
  $('#addItem').on('click', function (e) {
      e.preventDefault();
      let todo = $('#newItemInput').val().trim();
      addToDo(todo, 'Household');
      console.log('Add');
      $('#addToDoForm').toggle();
      $('#addToDo').toggle();
  });

  //handles pressing enter for adding items to the new list
  $('#addToDoForm').on('keypress', function(e) {
    if (e.which === 13) {
        let todo = $('#newItemInput').val().trim();
        addToDo(todo, 'Household');
        $('#addToDoForm').toggle();
        $('#addToDo').toggle();
        e.preventDefault();
    }

  });

  $('#cancelAddItem').on('click', function(e) {
    e.preventDefault();
    $('#addToDoForm').toggle();
    $('#addToDo').toggle();
  });

  $('#addToDo').on('click', function(e) {
    e.preventDefault();
    $('#newItemInput').val('');
    $('#addToDoForm').toggle();
    $('#addToDo').toggle();

  });




});
