$(document).ready(function() {


$(document).on('click' , '#tasks' , function(e) {

	e.stopImmediatePropagation();
  $('#task').addClass('active');
  $('#project').removeClass('active');
  $('#assignment').removeClass('active');
  $('#time').removeClass('active');
	list();
	

});


$(document).on('click', '#create_task_btn', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('section').html('');
    $('section').load('./pages/addTasks.html', function() {
      $("#project_name").focus();
    });
  });


$(document).on('submit', '#task', function(e) {

	e.preventDefault();
    e.stopImmediatePropagation();
    list();
    
  });


function list() {

	$('section').html('');
    $('section').load('./pages/listTasks.html');
}


});