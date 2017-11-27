$(document).ready(function() {


$(document).on('click' , '#timesheets' , function(e) {

	e.stopImmediatePropagation();
  $('#time').addClass('active');
  $('#task').removeClass('active');
  $('#assignment').removeClass('active');
  $('#project').removeClass('active');
	list();
	

});


$(document).on('click', '#create_timesheet_btn', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('section').html('');
    $('section').load('./pages/TimesheetEntry.html', function() {
      $("#project_name").focus();
    });
  });


$(document).on('submit', '#timesheet', function(e) {

	e.preventDefault();
    e.stopImmediatePropagation();
    list();
    
  });


function list() {

	$('section').html('');
    $('section').load('./pages/timesheet.html');
}


});