jQuery(document).ready(($) => {

  $('#ResultBody tr').click(function () {
    $('#ResultBody tr.resultRowSelected').removeClass('resultRowSelected');
    $(this).addClass('resultRowSelected');
  });

  $('#BacktoList').click(() => {
    $('#DataInput', window.parent.document).hide('slow');
  });
  $('#ResultTable').DataTable({
    columnDefs: [
      { searchable: false, targets: -1 },
    ]
  });
  $('#ResultTableResponsive').DataTable({
    responsive: true,
    columnDefs: [
      { searchable: false, targets: -1 },
      { responsivePriority: 1, targets: -1 },
    ]
  });
});
function hideDataInput(divID) {
  $(`#${divID}`).hide('slow');
}
function showDataInput(divID) {
  if ($(window).width() > 768) {
    wid = '400px';
    $(`#${divID}`).draggable(
      {
        containment: 'window',
        handle: "div.panel-heading"
      });
  }
  else {
    wid = `${$(window).width()}px`;
  }
  if (!$(`#${divID}`).is(':visible')) {
    $(`#${divID}`).css('top', 5);
    $(`#${divID}`).css('left', 'auto');
    $(`#${divID}`).css('right', 5);
    $(`#${divID}`).animate({ width: 0 }, 0).animate({ width: wid }, 0).attr('src', $(this).attr('value')).show('slow').scrollTop(0);
  }
  else {
    $(`#${divID}`).attr('src', $(this).attr('value')).scrollTop(0);
  }
}
function showAlert(msg) {
  bootbox.alert({
    message: msg
  })
}
function confirmDelete(obj, callDelete = deleteData) {
  bootbox.confirm({
    message: "Are you sure you want to delete this record?",
    buttons: {
        confirm: {
            label: 'Yes',
            className: 'btn-success'
        },
        cancel: {
            label: 'No',
            className: 'btn-danger'
        }
    },
    callback: function (result) {
      if (result) {
        callDelete(obj);
      }
    }
  });
}
function FilterData() {
  let rowValid = true;
  $('#ResultTable tr.resultRow').each((i, tr) => {
    $(tr).addClass('hide');
    if ($('#SearchField').val() != null)	{
      rowValid = false;
      $(tr).children('td').each((i, td) => {
        const tdcontent = $(td).html();
        if (tdcontent.toLowerCase().indexOf($('#SearchField').val().toLowerCase()) >= 0) {
          rowValid = true;
        }
      });
    }
    if (rowValid) {
      $(tr).removeClass('hide');
    }
  });
}
function fillSearchCustomerItem(selectItem, urlPath, itemKey, itemName, itemName2) {
  selectItem.find('option')
  .remove()
  .end();
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: urlPath,

    success: function (data) {
      console.log(`data fetched successuffly for ${urlPath}`);
      $.each(data, (key, item) => {
        selectItem.append(`<li class="form-control dropdown">${item[itemName]}</li>`);
      });
      selectItem.selectpicker('refresh');
    },
    error: function (e) {
        showAlert('Failed to load Customers!');
        console.log(`Error fetching Customers${e}`);
    }
  });
}

function fillSelectItem(selectItem, urlPath, itemKey, itemName, itemName2) {
  selectItem.find('option')
  .remove()
  .end();
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: urlPath,

    success: function (data) {
      console.log(`data fetched successuffly for ${urlPath}`);
      selectItem.append('<option value="">Please Select</option>');
      $.each(data, (key, item) => {
        let optionName = item[itemName];
        if (itemName2) {
          optionName = `${optionName} ${item[itemName2]}`;
        }
        selectItem.append(`<option value="${item[itemKey]}">${optionName}</option>`);
      });
      selectItem.selectpicker('refresh');
    },
    error: function (e) {
        showAlert(`Failed to load ${urlPath}!`);
        console.log(`Error fetching Customers${e}`);
    }
  });
}

function fillSelectedItem(selectItem, urlPath, itemKey, itemName, itemName2, itemValue, disabled) {
  selectItem.find('option')
  .remove()
  .end();
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: urlPath,

    success: function (data) {
      console.log(`data fetched successuffly for ${urlPath}`);
      $.each(data, (key, item) => {
        let optionName = item[itemName];
        if (itemName2) {
          optionName = `${optionName} ${item[itemName2]}`;
        }
        selectItem.append(`<option value="${item[itemKey]}">${optionName}</option>`);
      });
      selectOptionItem(selectItem, itemValue, disabled);
      selectItem.selectpicker('refresh');
    },
    error: function (e) {
        showAlert('Failed to load Customers!');
        console.log(`Error fetching Customers${e}`);
    }
  });
}
function selectOptionItem(selectItem, selectValue, disable) {
  selectItem.val(selectValue);
  if (disable) {
    selectItem.attr('disabled', 'disabled');
  }
}

function getCurrentDate() {
  var d = new Date();

  var month = d.getMonth() + 1;
  var day = d.getDate();

  var output = d.getFullYear() + '-' +
  (month < 10 ? '0' : '') + month + '-' +
  (day < 10 ? '0' : '') + day ;
  return output;
}
function getCurrentDateTime() {
  var d = new Date();

  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hours = d.getHours();
  var min = Math.ceil(d.getMinutes() / 5) * 5;
  var output = `${d.getFullYear()}-${
  month < 10 ? '0' : ''}${month}-${
  day < 10 ? '0' : ''}${day} ${
  hours < 10 ? '0' : ''}${hours}:${
  min < 10 ? '0' : ''}${min}`;
  return output;
}
function isNumeric(p_num) {
  return !isNaN(p_num);
}

function isEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function isEmpty(inputStr) {
  if (inputStr == null || inputStr == '') {
    return true;
  } return false;
}

function isDate(dateStr) {
  const reg1 = /^\d{2}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
  const reg2 = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;
   // If it doesn't conform to the right format (with either a 2 digit year or 4 digit year), fail
  if ((reg1.test(dateStr) == false) && (reg2.test(dateStr) == false)) {
    return false;
  }
  const parts = dateStr.split(RegExp.$1); // Split into 3 parts based on what the divider was
   // Check to see if the 3 parts end up making a valid date
  let yy = parts[0];
  const mm = parts[1];
  const dd = parts[2];
  if (parseFloat(yy) <= 50) {
    yy = (parseFloat(yy) + 2000).toString();
  }
  if (parseFloat(yy) <= 99) {
    yy = (parseFloat(yy) + 1900).toString();
  }
  const dt = new Date(parseFloat(yy), parseFloat(mm) - 1, parseFloat(dd), 0, 0, 0, 0);
  if (parseFloat(dd) != dt.getDate()) {
    return false;
  }
  if (parseFloat(mm) - 1 != dt.getMonth()) {
    return false;
  }
  return true;
}

function isDateTime(dateStr) {
  dateStr = dateStr.replace(' ', '-');
  dateStr = dateStr.replace(':', '-');
  dateStr = dateStr.replace(':', '-');
  const reg1 = /^\d{2}(\-|\/|\.)\d{1,2}\1\d{1,2}\1\d{1,2}\1\d{1,2}\1\d{1,2}$/;
  const reg2 = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}\1\d{1,2}\1\d{1,2}\1\d{1,2}$/;
   // If it doesn't conform to the right format (with either a 2 digit year or 4 digit year), fail

  if ((reg1.test(dateStr) == false) && (reg2.test(dateStr) == false)) {
    return false;
  }

  const parts = dateStr.split('-'); // Split into 6 parts based on what the divider was
   // Check to see if the 6 parts end up making a valid date
  let yy = parts[0];
  const mm = parts[1];
  const dd = parts[2];
  const hh = parts[3];
  const mi = parts[4];
  const ss = parts[5];
  if (parseFloat(yy) <= 50) {
    yy = (parseFloat(yy) + 2000).toString();
  }
  if (parseFloat(yy) <= 99) {
    yy = (parseFloat(yy) + 1900).toString();
  }
  const dt = new Date(parseFloat(yy), parseFloat(mm) - 1, parseFloat(dd), parseFloat(hh), parseFloat(mi), parseFloat(ss));
  if (parseFloat(dd) != dt.getDate()) {
    return false;
  }
  if (parseFloat(mm) - 1 != dt.getMonth()) {
    return false;
  }
  return true;
}
