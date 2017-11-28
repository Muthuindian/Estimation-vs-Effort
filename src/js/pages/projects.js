$(document).ready(function() {

	var base_url = host + "/api/timeSheet/project";
  var project_id;
  var project_name;
  var projects;


$(document).on('click' , '#projects' , function(e) {

	e.stopImmediatePropagation();
  $('#project').addClass('active');
  $('#task').removeClass('active');
  $('#assignment').removeClass('active');
  $('#time').removeClass('active');
	list();
});


$(document).on('click', '#create_project_btn', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('section').html('');
    $('section').load('./pages/addProjects.html', function() {
      $("#project_name").focus();

    });
  });


$(document).on('submit', '#project', function(e) {

	e.preventDefault();
  e.stopImmediatePropagation();
  if($.cookie("isEdit") == "true")
    put();
  else
    post();
  });

$(document).on('click', '.btn_deleteproject', function(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  project_id = $(this).closest('tr').attr('id');
  deleteProject(project_id);    
  });

$(document).on('click', '.btn_editproject', function(e) {

  e.preventDefault();
  e.stopImmediatePropagation();
  console.log("Edit");
  $.cookie("isEdit" , true);
  project_id = $(this).closest('tr').attr('id');
  $.grep(projects , function(project) {
    if(project.project_id == project_id)
      project_name = project.name;
  })
  console.log("id" , project_id);
  console.log("name" ,project_name);

  $('section').html('');
    $('section').load('./pages/addProjects.html', function() {
      $("#project_name").val(project_name).focus();
    });
     
  });


function deleteProject(project_id) {
  console.log("Delete");
  
    $.ajax({
      method: "DELETE",
      url: base_url + "/" + project_id,
      contentType: "application/json",
      dataType: "json",
    }).done(function(data, status) {
      list();
    }).fail(function(jqXHR, textStatus, errorThrown) {
    });
  };


function post() {
    var data = {
      name: $("#project_name").val().trim(),
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
   
      var data = {
        name: $("#project_name").val().trim(),
      };

    $.ajax({
      type: "PUT",
      url: base_url + "/" + project_id,
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
    $('section').load('./pages/listProjects.html' , function(){

    	$.ajax({
        type: "GET",
        url: base_url,
        dataType: "json",
        success: function(response, status) {
          let data = response;
          projects = data;
          if (data.length > 0) {
            $("#tblList tbody").html("");
            for (var i in data) {
              var no = parseInt(i) + 1;
              $("#tblList tbody").append("<tr id=" + data[i].project_id + ">" +
                "<td style='text-align:center;'>" + no + " </td><td> " + data[i].name + "</td>" +
                "<td  name='" + data[i].name + "' id='" + data[i].project_id + "' style='text-align:right;margin-right:3rem;' class=''><i  class='material-icons btn_editproject' style='padding-right:.5rem;'>edit</i>&nbsp;<i href='#modal1' class='material-icons btn_deleteproject' style='padding-right:1rem;'>delete</i></td>" +
                "</tr>");
            }
          } else {
          }
        }
      });
    });
}


});