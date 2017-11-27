$(document).ready(function() {

    $.ajaxSetup({cache: false});

    var base_url = "http://localhost:8888/api/timeSheet/time_sheet";
    var base_employee_url = "http://localhost:8888/api/seedData/employee";
    var base_task_url = "http://localhost:8888/api/filterData/employee_project_tasks_list";
    var timesheets;
    var timesheet_id;
    var employee_id;
    var project_id;
    var task_id;


    function render(calback = function() {}) {
        $.ajax({
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
            if ($.cookie("isEdit") == "true") {
                getProjects(employee_id);
                getTasks(employee_id, project_id);
            }
            calback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
    }


    $('#employee_name').change(function(e) {


        $('#list_projects').html('');
        $('#list_tasks').html('');


        e.stopImmediatePropagation();
        e.preventDefault();
        employee_id = ($("#list_employees option[value='" + $('#employee_name').val() + "']").attr('id'));
        getProjects(employee_id);

    })


    $('#project_name').change(function(e) {

        $('#list_tasks').html('');

        e.stopImmediatePropagation();
        e.preventDefault();
        employee_id = ($("#list_employees option[value='" + $('#employee_name').val() + "']").attr('id'));
        project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
        getTasks(employee_id, project_id);

    })


    function getProjects(employee_id) {
        let data = {
            "where": {
                "employee_id": employee_id
            }
        }

        console.log("empid", employee_id);
        console.log("dATA", data);

        $.ajax({
            url: base_task_url,
            method: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).done(function(response) {
            let data = response;
            var pro_id=0;
            for (var i in data) {

                if(pro_id !== data[i].project_id) {
                    var $opt = $('<option id=' + data[i].project_id + '>');
                    $opt.val(data[i].name).text();
                    $opt.appendTo('#list_projects');
                    pro_id = data[i].project_id;
                }
                
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });


    }


    function getTasks(employee_id, project_id) {

        let data = {
            "where": {
                "employee_id": employee_id,
                "project_id": project_id
            }
        }

        console.log("empid", employee_id);
        console.log("proid", project_id);
        console.log("dATA", data);

        $.ajax({
            url: base_task_url,
            method: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json"
        }).done(function(response) {
            let data = response;
            console.log(data);
            for (var i in data) {
                if (data[i].status_id == 1) {
                    var $opt = $('<option id=' + data[i].task_id + '>');
                    $opt.val(data[i].task).text();
                    $opt.appendTo('#list_tasks');
                }
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
    }


    $(document).on('click', '#timesheets', function(e) {

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
            $.cookie("isEdit", false);
            $("#employee_name").focus();
            render();
        });
    });


    $(document).on('submit', '#timesheet', function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        if ($.cookie("isEdit") == "true")
            put();
        else
            post();

    });



    $(document).on('click', '.btn_edittimesheet', function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        console.log("Edit");
        $.cookie("isEdit", true);
        timesheet_id = $(this).closest('tr').attr('id');
        console.log("id", timesheet_id);

        $.ajax({
            type: "GET",
            url: base_url + "/" + timesheet_id,
            dataType: "json",
            success: function(response, status) {
                $('section').html('');
                $('section').load('./pages/TimesheetEntry.html', function() {
                    let data = response;
                    employee_id = data.employee.employee_id;
                    project_id = data.project.project_id;
                    task_id = data.task.task_id;
                    let callback = function() {
                        $("#employee_name").val(data.employee.name).focus();
                        $("#project_name").val(data.project.name).focus();
                        $("#task_name").val(data.task.task).focus();
                        $("#activity").val(data.activity).focus();
                        $("#effort").val(data.actual_effort).focus();
                        $("#end_date").val(data.date).focus();
                    };
                    $("label").addClass('active');
                    render(callback);
                });
            }
        });
    });


    function post() {

        employee_id = ($("#list_employees option[value='" + $('#employee_name').val() + "']").attr('id'));
        project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
        task_id = ($("#list_tasks option[value='" + $('#task_name').val() + "']").attr('id'));
        console.log("emp", employee_id);
        console.log("proj", project_id);
        console.log("task", task_id);
        var data = {
            employee_id: employee_id,
            project_id: project_id,
            task_id: task_id,
            date: $("#end_date").val().trim(),
            actual_effort: $("#effort").val().trim(),
            activity: $("#activity").val().trim()
        };

        $.ajax({
            method: "POST",
            url: base_url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),
        }).done(function(data, status) {
            list();
        }).fail(function(jqXHR, textStatus, errorThrown) {});
    };


    function put() {

        employee_id = ($("#list_employees option[value='" + $('#employee_name').val() + "']").attr('id'));
        project_id = ($("#list_projects option[value='" + $('#project_name').val() + "']").attr('id'));
        task_id = ($("#list_tasks option[value='" + $('#task_name').val() + "']").attr('id'));
        var data = {
            employee_id: employee_id,
            project_id: project_id,
            task_id: task_id,
            date: $("#end_date").val().trim(),
            actual_effort: $("#effort").val().trim(),
            activity: $("#activity").val().trim()

        };

        $.ajax({
            type: "PUT",
            url: base_url + "/" + timesheet_id,
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(data, status) {
                list();
            },
            error: function(jqXHR, textStatus, errorThrown) {}
        });
    };



    function list() {

        $.cookie("isEdit", false);
        $('section').html('');
        $('section').load('./pages/timesheet.html', function() {

            $.ajax({
                type: "GET",
                url: base_url,
                dataType: "json",
                success: function(response, status) {
                    let data = response;
                    timesheets = data;
                    if (data.length > 0) {
                        $("#tblsheetList tbody").html("");
                        for (var i in data) {
                            var no = parseInt(i) + 1;
                            $("#tblsheetList tbody").append("<tr id=" + data[i].time_sheet_id + ">" +
                                "<td style='text-align:center;'>" + no + " </td><td>" + data[i].employee.name + "</td>" +
                                "<td> " + data[i].task.task + "</td>" +
                                "<td> " + data[i].date + "</td>" +
                                "<td> " + data[i].task.plan_effort + ' Hrs' + "</td>" +
                                "<td> " + data[i].actual_effort + ' Hrs' + "</td>" +
                                "<td> " + data[i].activity + "</td>" +
                                "<td  name='" + data[i].employee.name + "' id='" + data[i].time_sheet_id + "' style='text-align:center;' class=''><i  class='material-icons btn_edittimesheet' style='padding-right:.5rem;'>edit</i></td>" +
                                "</tr>");
                        }
                    } else {}
                }
            });
        });
    }


});