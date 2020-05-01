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
    $(".classmates-grades").toggle(!this.checked);
});

$("input[id^=admin-remove-group-]").click(function () {
    var inputTag = this;
    var id = parseInt(inputTag.id.slice(19));
    $.ajax({
        type: "POST",
        url: "/Admin/DeleteGroup",
        data: `id=${id}`,
        success: function () {
            toastr.success('Group removed successfully.', 'Success', { timeOut: 3000 });
            inputTag.parentNode.parentNode.parentNode.removeChild(inputTag.parentNode.parentNode);
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

$("#add-group-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/Admin/AddGroup",
        data: $("#add-group-form").serialize(),
        success: function () {
            toastr.success('Group added successfully.', 'Success', { timeOut: 3000 });
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

var getSubjectsByLector = function (lectorId) {
    $.ajax({
        type: "GET",
        url: "/Admin/GetSubjectsByLector",
        data: 'lectorId=' + lectorId,
        success: function (data) {
            $("#admin-lector-subjects-table").replaceWith(data[0]);
            $("#link-subject-form").replaceWith(data[1]);
        },
        error: function (data) {
            console.log(data);
        }
    });
};

$("#AdminLectorSelect").change(function () {
    let lectorId = $("#AdminLectorSelect :selected").val();
    $("#add-subj-lector-id").val(lectorId);
    getSubjectsByLector(lectorId);
});

$("#add-subject-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/Admin/AddSubject",
        data: $("#add-subject-form").serialize(),
        success: function () {
            toastr.success('Subject added successfully.', 'Success', { timeOut: 3000 });
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

$("#link-subject-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/Admin/LinkSubject",
        data: $("#link-subject-form").serialize(),
        success: function () {
            toastr.success('Subject linked successfully.', 'Success', { timeOut: 3000 });
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

$("#lector-add-column").click(function () {
    //TODO: update without refresh
    $("tr").find("#total-td").before('<td id="new-cell">—</td>');
    $("tr").find("#note-th").before('<th id="new-note-cell"></th>');
    $("tr").find("#total-th").before('<th><input type="date" id="new-jornal-col" onchange="dateChange();"></th>');
    $('#lector-add-column').prop('disabled', true);
});

$("#LectorSubjectSelect").change(function () {
    let subjectId = $("#LectorSubjectSelect :selected").val();
    let oldSelect = $(".active-select");
    let newSelect = $(`#LectorGroupSelect-${subjectId}`);

    oldSelect.addClass("hidden-select");
    newSelect.addClass("active-select");
    newSelect.addClass("hidden-select");
    oldSelect.removeClass("active-select");
});

$("button[id=lector-show-grades]").click(function () {
    let subjectId = $("#LectorSubjectSelect :selected").val();
    let groupId = $(".active-select :selected").val();

    $.ajax({
        type: "POST",
        url: "/Lector/DisplayGrages",
        data: {
            'subjectId': subjectId,
            'groupId': groupId
        },
        success: function (data) {
            $("table[id^=lector-grade-table-]").replaceWith(data);
            $('#lector-add-column').prop('disabled', false);
            $('.changeable').blur(function () {
                updateColumn(this);
            });
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
});

var dateChange = function () {
    let col = $("#new-jornal-col");
    let dt = col.val();
    let date = `${dt.slice(8, 10)}.${dt.slice(5, 7)}.${dt.slice(0, 4)}`;
    let journalId = parseInt($("table[id^=lector-grade-table-]").get(0).id.slice(19));

    $.ajax({
        type: "POST",
        url: "/Lector/AddJournalColumn",
        data: {
            'journalId': journalId,
            'date': date
        },
        success: function (data) {
            $(col).parent().html(date);
            $('#lector-add-column').prop('disabled', false);
            $('.changeable').blur(function () {
                updateColumn(this);
            });
            //TODO: update without refresh
        },
        error: function () {
            toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
        }
    });
};

var updateColumn = function (node) {
    if (node.id.startsWith("note-col-")) {
        let colId = parseInt(node.id.slice(9));
        let note = node.textContent;
        $.ajax({
            type: "POST",
            url: "/Lector/UpdateJournalColumn",
            data: {
                'colId': colId,
                'note': note
            },
            success: function () {
                toastr.success('Field changed.', 'Success', { timeOut: 1500 });
            },
            error: function () {
                toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
            }
        });
    } else if (node.id.startsWith("date-col-")) {
        let colId = parseInt(node.id.slice(9));
        let date = node.textContent;
        $.ajax({
            type: "POST",
            url: "/Lector/UpdateJournalColumn",
            data: {
                'colId': colId,
                'date': date
            },
            success: function () {
                toastr.success('Field changed.', 'Success', { timeOut: 1500 });
            },
            error: function () {
                toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
            }
        });
    } else if (node.id.startsWith("row-col-")) {
        let gradeId = parseInt(node.id.slice(8));
        let mark = parseInt(node.textContent);
        let colId = parseInt(node.lastElementChild.id.slice(6));
        let stId = parseInt(node.firstElementChild.id.slice(5));
        $.ajax({
            type: "POST",
            url: "/Lector/UpdateGroupColumn",
            data: {
                'gradeId': gradeId,
                'mark': mark,
                'colId': colId,
                'stId': stId
            },
            success: function () {
                toastr.success('Field changed.', 'Success', { timeOut: 1500 });
            },
            error: function () {
                toastr.error('Some error occurred.', 'Error', { timeOut: 3000 });
            }
        });
    }
}
