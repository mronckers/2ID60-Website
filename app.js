$(document).on('ready', function() {

  var toDoLists = [];

  var ToDo = function(todo, list) {
    this.todo = todo;
    this.list = list;
  };

  var addToDo = function(todo, list) {
    if (todo) {
      todo = new ToDo(todo, list);

      toDoLists.push(todo);
      save();

      $('#newList').append('<li class="list-group-item">' + this.todo + '<a href=""><span class="float-right fas fa-check"></span></a></li>')

    }
  }

  $('#closeBody').hide();

  $('#openBody').on('click', function() {
    $('#openBody').hide();
    $('#closeBody').show();
  })
  
  //handles mouse click for adding items to the new list
  $('#addItem').on('click', function (e) {
      e.preventDefault();
      let todo = $('#newItemInput').val().trim();
      addTask(todo, 'Household');
      $('#addToDo').hide();
  });

  //handles pressing enter for adding items to the new list
  $('#addItem').on('keypress', function(e) {
      if (e.which === 13) {
        let todo = $('#newItemInput').val().trim();
        addTask(todo, 'Household');
        $('#addToDo').hide();
    }
  });

  $('#cancelAddItem').on('click', function() {
    $('#addToDo').hide();
  });




});
