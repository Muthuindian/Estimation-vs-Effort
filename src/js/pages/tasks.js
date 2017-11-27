$(document).ready(function() {

  var base_url = "http://localhost:8888/api/timeSheet/task";
  var base_project_url = "http://localhost:8888/api/timeSheet/project" ;
  var tasks;
  var task_id;
  var project_id;



  function project() {
      $.ajax({
        url: base_project_url,
        method: "GET",
        dataType: "json"
      }).done(function(response) {
        let data = response;
        for (var i in data) {
            var $opt = $('<option id=' + data[i].project_id + '>');
            $opt.val(data[i].name).text();
            $opt.appendTo('#list_projects');
        }
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
    };


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
      project();
    });
  });


$(document).on('submit', '#task', function(e) {

	e.preventDefault();
  e.stopImmediatePropagation();
  if($.cookie("isEdit") == "true")
    put();
  else
    post();
  });

$(document).on('click', '.btn_deletetask', function(e) {

console.log("Delete");
  task_id = $(this).closest('tr').attr('id');
  e.preventDefault();
  e.stopImmediatePropagation();
  deleteTask(task_id);    
  });

$(document).on('click', '.btn_edittask', function(e) {

  e.preventDefault();
  e.stopImmediatePropagation();
  console.log("Edit");
  $.cookie("isEdit" , true);
  task_id = $(this).closest('tr').attr('id');

  $.ajax({
        type: "GET",
        url: base_url + "/" + task_id,
        dataType: "json",
        success: function(response, status) {
          $('section').html('');
          $('section').load('./pages/addTasks.html', function() {
            let data = response;
            $("#project_name").val(data.project.name).focus();
            $("#task_name").val(data.task).focus();
            $("#start_date").val(data.start_date).focus();
            $("#end_date").val(data.end_date).focus();
            $("#effort").val(data.plan_effort).focus();
            $("label").addClass('active');
            project();
          });
        }
      });
  });


function deleteTask(task_id) {
  console.log("Delete");
  
    $.ajax({
      method: "DELETE",
      url: base_url + "/" + task_id,
      contentType: "application/json",
      dataType: "json",
    }).done(function(data, status) {
      list();
    }).fail(function(jqXHR, textStatus, errorThrown) {
      $('#devision #error_message').html('');
      $('#devision #error_message').append('<span>' + jqXHR.responseJSON.message + '</span>');
    });
  };


function post() {

  project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
    var data = {
      project_id: project_id,
      task: $("#task_name").val().trim(),
      start_date: $("#start_date").val().trim(),
      end_date: $("#end_date").val().trim(),
      plan_effort: $("#effort").val().trim()
    };
    $.ajax({
      method: "POST",
      url: base_url,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
    }).done(function(data, status) {
      list();
    }).fail(function(jqXHR, textStatus, errorThrown) {
      $('#devision #error_message').html('');
      $('#devision #error_message').append('<span>' + jqXHR.responseJSON.message + '</span>');
    });
  };


  function put() {
   
    project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
    var data = {
      project_id: project_id,
      task: $("#task_name").val().trim(),
      start_date: $("#start_date").val().trim(),
      end_date: $("#end_date").val().trim(),
      plan_effort: $("#effort").val().trim()
    };

    $.ajax({
      type: "PUT",
      url: base_url + "/" + task_id,
      dataType: "json",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function(data, status) {
        list();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#devision #error_message').html('');
        $('#devision #error_message').append('<span>' + jqXHR.responseJSON.message + '</span>');
      }
    });
  };





function list() {

  $.cookie("isEdit", false);
  $('section').html('');
    $('section').load('./pages/listTasks.html' , function(){

      $.ajax({
        type: "GET",
        url: base_url,
        dataType: "json",
        success: function(response, status) {
          let data = response;
          tasks = data;
          if (data.length > 0) {
            $("#tbltasksList tbody").html("");
            for (var i in data) {
              var no = parseInt(i) + 1;
              $("#tbltasksList tbody").append("<tr id=" + data[i].task_id + ">" +
                "<td>" + no + " </td><td style='text-align:center;'> " + data[i].project.name + "</td>" +
                "<td style='text-align:center;'> " + data[i].task + "</td>" +
                "<td  name='" + data[i].task + "' id='" + data[i].task_id + "' style='text-align:left;' class=''><i  class='material-icons btn_edittask' style='padding-right:.5rem;'>edit</i>&nbsp;<i href='#modal1' class='material-icons btn_deletetask' style='padding-right:1rem;'>delete</i></td>" +
                "</tr>");
            }
          } else {
            $("#search_devision_list empty").html('')
            $("#search_devision_list empty").append('<div style="padding:4rem;">Please <a id="create_devision_btn">Click Here </a> to create a new Divisions.</div>');
          }
        }
      });
    });
}


});