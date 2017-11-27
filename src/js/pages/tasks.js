$(document).ready(function() {

  var base_url = "http://localhost:8888/api/timeSheet/task";
  var base_project_url = "http://localhost:8888/api/timeSheet/project" ;
  var base_status_url = "http://localhost:8888/api/seedData/status";
  var tasks;
  var task_id;
  var project_id;
  var status_id;



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
          status();
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
    };

    function status() {
      $.ajax({
        url: base_status_url,
        method: "GET",
        dataType: "json"
      }).done(function(response) {
        let data = response;
        for (var i in data) {
            var $opt = $('<option id=' + data[i].status_id + '>');
            $opt.val(data[i].name).text();
            $opt.appendTo('#list_status');
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
    $.cookie("isEdit" , false);
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
            $("#status").val(data.status.name).focus();

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
    });
  };


function post() {

  project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
  status_id = ($("#list_status option[value='" + $('#status').val() + "']").attr('id'));
    var data = {
      project_id: project_id,
      task: $("#task_name").val().trim(),
      start_date: $("#start_date").val().trim(),
      end_date: $("#end_date").val().trim(),
      plan_effort: $("#effort").val().trim(),
      status_id: status_id
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
    });
  };


  function put() {
   
    project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
    status_id = ($("#list_status option[value='" + $('#status').val() + "']").attr('id'));
    var data = {
      project_id: project_id,
      task: $("#task_name").val().trim(),
      start_date: $("#start_date").val().trim(),
      end_date: $("#end_date").val().trim(),
      plan_effort: $("#effort").val().trim(),
      status_id: status_id
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
                "<td style='text-align:center;'>" + no + " </td><td> " + data[i].project.name + "</td>" +
                "<td> " + data[i].task + "</td>" +
                "<td> " + data[i].plan_effort + ' Hrs' + "</td>" +
                "<td  name='" + data[i].task + "' id='" + data[i].task_id + "' style='text-align:right;margin-right:3rem;' class=''><i  class='material-icons btn_edittask' style='padding-right:.5rem;'>edit</i>&nbsp;<i href='#modal1' class='material-icons btn_deletetask' style='padding-right:1rem;'>delete</i></td>" +
                "</tr>");
            }
          } else {
          }
        }
      });
    });
}


});