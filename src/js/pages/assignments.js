$(document).ready(function() {

    $.ajaxSetup({cache: false});

    var base_url = "http://localhost:8888/api/timeSheet/task_assignment";
    var base_project_url = "http://localhost:8888/api/timeSheet/project";
    var base_employee_url = "http://localhost:8888/api/seedData/employee";
    var base_task_url = "http://localhost:8888/api/filterData/project_tasks_list";
    var assignments;
    var assignment_id;
    var task_id;
    var project_id;
    var employee_id;


    async function render(calback = function() {}) {
        await $.ajax({
            url: base_employee_url,
            method: "GET",
            dataType: "json"
        }).done(function(response) {
            let data = response;
            for (var i in data) {
                var $opt = $('<option id=' + data[i].employee_id + '>');
                $opt.val(data[i].name).text();
                $opt.appendTo('#list_employees');
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
        await $.ajax({
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
            if($.cookie("isEdit") == "true") {
                getTasks(project_id);
        }
        calback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
    }

    $('#project_text').change(function(e) {

        $('#list_tasks').html('');
        $('#task_text').val("");

    e.stopImmediatePropagation();
    e.preventDefault();
    project_id = ($("#list_projects option[value='" + $('#project_text').val() + "']").attr('id'));
    getTasks(project_id)

})


    function getTasks(project_id) {

        let data = {
            "where": {
                "project_id": parseInt(project_id)
            }
        }

        console.log("id" , project_id);
        console.log("dATA" , data);

        $.ajax({
            url: base_task_url,
            method: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).done(function(response) {
            let data = response;
            for (var i in data) {
                if(data[i].status_id == 1) {
                    var $opt = $('<option id=' + data[i].task_id + '>');
                    $opt.val(data[i].task).text();
                    $opt.appendTo('#list_tasks');
                }
                
            }
            calback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });


    }


    $(document).on('click', '#assignments', function(e) {

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
        $.cookie("isEdit", false);
        $('section').html('');
        $('section').load('./pages/addAssignments.html', function() {
            $("#employee").focus();
            render();
        });
    });


    $(document).on('submit', '#assignment', function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        if ($.cookie("isEdit") == "true")
            put();
        else
            post();
    });


    $(document).on('click', '.btn_deleteassignment', function(e) {

        console.log("Delete");
        assignment_id = $(this).closest('tr').attr('id');
        e.preventDefault();
        e.stopImmediatePropagation();
        deleteAssignment(assignment_id);
    });

    $(document).on('click', '.btn_editassignment', function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        console.log("Edit");
        $.cookie("isEdit", true);
        assignment_id = $(this).closest('tr').attr('id');
        console.log("id", assignment_id);

        $.ajax({
            type: "GET",
            url: base_url + "/" + assignment_id,
            dataType: "json",
            success: function(response, status) {
                $('section').html('');
                $('section').load('./pages/addAssignments.html', function() {
                    let data = response;
                    project_id = data.project_id;
                    let callback = function() {
                        $("#employee").val(data.employee.name).focus();
                        $("#project_text").val(data.project.name).focus();
                        $("#task_text").val(data.task.task).focus();
                    };
                    $("label").addClass('active');
                    render(callback);
                });
            }
        });
    });


    function deleteAssignment(assignment_id) {
        console.log("Delete");

        $.ajax({
            method: "DELETE",
            url: base_url + "/" + assignment_id,
            contentType: "application/json",
            dataType: "json",
        }).done(function(data, status) {
            list();
        }).fail(function(jqXHR, textStatus, errorThrown) {
        });
    };


    function post() {

        employee_id = ($("#list_employees option[value='" + $('#employee').val() + "']").attr('id'));
        project_id = ($("#list_projects option[value='" + $('#project_text').val() + "']").attr('id'));
        task_id = ($("#list_tasks option[value='" + $('#task_text').val() + "']").attr('id'));
        console.log("emp", employee_id);
        console.log("proj", project_id);
        console.log("task", task_id);
        var data = {
            employee_id: employee_id,
            project_id: project_id,
            task_id: task_id
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

        employee_id = ($("#list_employees option[value='" + $('#employee').val() + "']").attr('id'));
        project_id = ($("#list_projects option[value='" + $('#project_text').val() + "']").attr('id'));
        task_id = ($("#list_tasks option[value='" + $('#task_text').val() + "']").attr('id'));
        var data = {

            employee_id: employee_id,
            project_id: project_id,
            task_id: task_id
        };

        $.ajax({
            type: "PUT",
            url: base_url + "/" + assignment_id,
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
        $('section').load('./pages/listAssignments.html', function() {

            $.ajax({
                type: "GET",
                url: base_url,
                dataType: "json",
                success: function(response, status) {
                    let data = response;
                    assignments = data;
                    if (data.length > 0) {
                        $("#tblassignList tbody").html("");
                        for (var i in data) {
                            var no = parseInt(i) + 1;
                            $("#tblassignList tbody").append("<tr id=" + data[i].task_assignment_id + ">" +
                                "<td style='text-align:center;'>" + no + " </td><td> " + data[i].employee.name + "</td>" +
                                "<td> " + data[i].project.name + "</td>" +
                                "<td> " + data[i].task.task + "</td>" +
                                "<td  name='" + data[i].employee.name + "' id='" + data[i].task_assignment_id + "' style='margin-right:3rem;' class='right'><i  class='material-icons btn_editassignment'>edit</i></td>" +
                                "</tr>");
                        }
                    } else {
                        
                    }
                }
            });
        });
    }

});