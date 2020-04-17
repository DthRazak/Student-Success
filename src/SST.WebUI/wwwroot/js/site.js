﻿$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

var getStudentsByGroup = function (group) {
    $.ajax({
        type: "GET",
        url: "/Account/GetStudentsByGroup",
        data: 'group=' + group,
        success: function (data) {
            var selTag = document.getElementById("fullNameSelect");
            selTag.textContent = '';
            var d = $.parseJSON(data);
            for (let i = 0; i < d.Students.length; ++i) {
                var op = document.createElement('option');
                op.value = d.Students[i]["Id"];
                op.textContent = d.Students[i]["FullName"];
                selTag.appendChild(op)
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
};

var getLectors = function () {
    $.ajax({
        type: "GET",
        url: "/Account/GetLectors",
        success: function (data) {
            var selTag = document.getElementById("fullNameSelect");
            selTag.textContent = '';
            var d = $.parseJSON(data);
            for (let i = 0; i < d.Lectors.length; ++i) {
                var op = document.createElement('option');
                op.value = d.Lectors[i]["Id"];
                op.textContent = d.Lectors[i]["FullName"];
                selTag.appendChild(op)
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
};

$("#GroupSelect").change(function () {
    let group = document.getElementById("GroupSelect").value;
    getStudentsByGroup(group);
});

$('.form-check-input').change(function () {
    var selected_value = $("input[name='inlineRadioOptions']:checked").val();
    if (selected_value == "option1") {
        $("#groupDiv").show();
        $("#nameSelectLabel").text("Select Student");
        $("#fullNameSelect").attr("name", "StudentId");
        $("#signupForm").attr("action", "/Account/SignupAsStudent");
    } else {
        $("#groupDiv").hide();
        $("#nameSelectLabel").text("Select Lector");
        $("#fullNameSelect").attr("name", "LectorId");
        $("#signupForm").attr("action", "/Account/SignupAsLector");
        getLectors();
    }
});

$("input[id^=request-accept-]").click(function() {
    var inputTag = this;
    var id = parseInt(inputTag.id.slice(15));
    $.ajax({
        type: "POST",
        url: "/Admin/ApproveRequest",
        data: `id=${id}`,
        success: function () {
            toastr.success('Request approved successfully.', 'Success', { timeOut: 3000 });
            if (!$.urlParam("DisplayAll")) {
                inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
            } else {
                inputTag.value = "REJECT";
                inputTag.classList.remove("btn-success");
                inputTag.classList.add("btn-danger");
            }
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

$("input[id^=request-reject-]").click(function () {
    var inputTag = this;
    var id = parseInt(inputTag.id.slice(15));
    $.ajax({
        type: "POST",
        url: "/Admin/RejectRequest",
        data: `id=${id}`,
        success: function () {
            toastr.success('Request rejected successfully.', 'Success', { timeOut: 3000 });
            if (!$.urlParam("DisplayAll")) {
                inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
            } else {
                inputTag.value = "ACCEPT";
                inputTag.classList.remove("btn-danger");
                inputTag.classList.add("btn-success");
            }
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

$("#add-student-form").submit(function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/Admin/AddStudent",
        data: $("#add-student-form").serialize(),
        success: function () {
            toastr.success('Student added successfully.', 'Success', { timeOut: 3000 });
            // inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
        },
        error: function (data) {
            if (data.status === 422) {
                toastr.error('All fields requaired', 'Error', { timeOut: 3000 });
            } else {
                toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
            }
        }
    });
});

$("input[id^=admin-remove-student-]").click(function () {
    var inputTag = this;
    var id = parseInt(inputTag.id.slice(21));
    $.ajax({
        type: "POST",
        url: "/Admin/DeleteStudent",
        data: `id=${id}`,
        success: function () {
            toastr.success('Student removed successfully.', 'Success', { timeOut: 3000 });
            inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

$("#add-lector-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/Admin/AddLector",
        data: $("#add-lector-form").serialize(),
        success: function () {
            toastr.success('Lector added successfully.', 'Success', { timeOut: 3000 });
            // inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
        },
        error: function (data) {
            if (data.status === 422) {
                toastr.error('All fields requaired', 'Error', { timeOut: 3000 });
            } else {
                toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
            }
        }
    });
});

$("input[id^=admin-remove-lector-]").click(function () {
    var inputTag = this;
    var id = parseInt(inputTag.id.slice(20));
    $.ajax({
        type: "POST",
        url: "/Admin/DeleteLector",
        data: `id=${id}`,
        success: function () {
            toastr.success('Lector removed successfully.', 'Success', { timeOut: 3000 });
            inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

$("button[id=st-show-grades]").click(function () {
    var subjectId = $("#StudentSubjectSelect :selected").val();
    $.ajax({
        type: "POST",
        url: "/Student/DisplayGrages",
        data: `subjectId=${subjectId}`,
        success: function (data) {
            $("#st-grade-table").replaceWith(data);
            $("input[id=GradesCheck]").removeAttr("checked")
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

$("input[id=GradesCheck]").click(function () {
    $("#classmates-grades").toggle(!this.checked);
});
