$(document).ready(function() {


$(document).on('click' , '#assignments' , function(e) {

	e.stopImmediatePropagation();
  $('#assignment').addClass('active');
  $('#task').removeClass('active');
  $('#project').removeClass('active');
  $('#time').removeClass('active');
	list();
	

});


$(document).on('click', '#create_assignment_btn', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('section').html('');
    $('section').load('./pages/addAssignments.html', function() {
      $("#project_name").focus();
    });
  });


$(document).on('submit', '#assignment', function(e) {

	e.preventDefault();
    e.stopImmediatePropagation();
    list();
    
  });


function list() {

	$('section').html('');
    $('section').load('./pages/listAssignments.html');
}


});