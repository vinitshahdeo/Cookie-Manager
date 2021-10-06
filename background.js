/**
 * @author Vinit Shahdeo
 * @email vinitshahdeo@gmail.com
 */
var count = 0;

$('#banner').fadeTo(4000, 500).slideUp(500, () => {
  $('#banner').slideUp(500);
});

$('#developer').fadeTo(4000, 500).slideUp(500, () => {
  $('#developer').slideUp(500);
});

function setCookieCount() {
  chrome.cookies.getAll({}, (cookies) => {
    count = cookies.length;
    $('#cookie-counter').innerHTML = count;
  });
}

setCookieCount();

function displayCookies() {
  setCookieCount();

  $('#cookie').style.display = 'none';

  var tableLog = $('#cookieslog');
  tableLog.style.display = 'table';
  tableLog.innerHTML = '';

  var domain = $('#url').value;
  //var tarea_regex = /(http(s?))\:\/\//gi;
  if (!domain) {
    $('#banner').style.display = 'block';
    $('#message').style.display = 'block';
    $('#banner').style.className = 'alert alert-danger alert-dismissible';
    $('#message').innerHTML = "Invalid URL! <strong>Hint</strong> : Please enter <strong>complete url</strong> including <kbd>http://</kpd> or <kpd>https://</kpd> below and press <span class='label label-primary'>Display Cookies</span>"
  }

  if (!(domain.indexOf('http://') == 0 || domain.indexOf('https://') == 0)) {
    $('#banner').style.display = 'block';
    $('#message').style.display = 'block';
    $('#banner').style.className = 'alert alert-danger alert-dismissible';
    $('#message').innerHTML = "Invalid URL! <strong>Hint</strong> : Please enter <strong>complete url</strong> including <kbd>http://</kbd> or <kbd>https://</kbd> below and press <span class='label label-primary'>Display Cookies</span>";
  } else { 
    $('#banner').style.display = 'none';

    chrome.cookies.getAll({url:domain}, (cookies) => {
    //var row = tableLog.insertRow(-1);

    for (var i in cookies) {
      if (i == 0) {
        var firstRow = tableLog.insertRow(-1);
        firstRow.insertCell(0).innerHTML = '<strong>NAME</strong>';
        firstRow.insertCell(1).innerHTML = '<strong>VALUE</strong>';
      }

      console.log(cookies[i]);
      //var row = '<tr><td>'+cookies[i].name+'</td><td>'+cookies[i].value+'</td></tr>';
      var row = tableLog.insertRow(-1);
      var value = cookies[i].value;
      var name = cookies[i].name;
      
      if (name.length > 10) {
        name = name.substring(0, 10);
        name += '...';
      }

      if (value.length > 15) {
        value = value.substring(0, 15);
        value += '...';
      }

      row.insertCell(0).innerHTML = name;
      row.insertCell(1).innerHTML = value;
    }
  });
}
}

function setCookies() {
  $('#cookieslog').style.display = 'none';

  var domain = $('#url').value;
  var name = $('#key').value;
  var value = $('#value').value;
  var input = $('#cookie').style.display = 'block';
  var banner = $('#banner');

  banner.style.display = 'block';
  banner.className = 'alert alert-info alert-dismissible'

  $('#message').innerHTML = "Please enter the <strong>url</strong>, <strong>name</strong> and <strong>value</strong> pair and click <span class='label label-success'>Set Cookies</span> button."
  if (!domain) {
    $('#message').innerHTML = "Please enter the <kbd>url</kbd>, <kbd>name</kbd> & <kbd>value</kbd> pair and click <span class='label label-success'>Set Cookies</span> button."
  } else if (!name || !value) {
    banner.className = 'alert alert-warning alert-dismissible';
    $('#message').innerHTML = "Please enter the <code>name</code> and <code>value</code> pair and click <span class='label label-success'>Set Cookies</span> button."
  } else {
    chrome.cookies.set({ url:domain, name:name, value:value, expirationDate: 1610701693 }, (cookie) => {
      console.log('cookie is set');

      $('#banner').className = 'alert alert-success alert-dismissible';
      $('#message').innerHTML = '<strong>SUCCESS!</strong> Cookies is set for <strong>'+domain+'</strong>';

      console.log(cookie);

      var name = $('#key').value = '';
      var value = $('#value').value = '';

      $('#banner').fadeTo(2000, 500).slideUp(500, () => {
        $('#banner').slideUp(500);
      });

      setCookieCount();
    });
  }
}

// displayCookies();
// setCookies();

function onCookieChanged() {
  chrome.cookies.onChanged.addListener((cookies) => {
    console.log('cookies are being changed ', cookies.cookie.domain);
    console.log(cookies);
  });
}

onCookieChanged();

  function clearAllCookies() {
    console.log('cookies cleared');
    chrome.cookies.getAll({}, (cookies) => {
      for (var i in cookies)
        removeCookie(cookies[i]);
      });

    $('#banner').className = 'alert alert-danger alert-dismissible';
    $('#message').innerHTML = 'All Cookies are cleared!';

    setCookieCount();
  }
  
  function removeCookie(cookie) {
    var url = 'http' +
    (cookie.secure ? 's' : '') +
    '://' +
    cookie.domain +
    cookie.path;

    chrome.cookies.remove({'url': url, 'name': cookie.name});
  }

  function updateBanner() {
    $('#banner').style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', () => {
    var clear_Cookies = $('#clear_cookies');
    var set_Cookies = $('#set_cookies');
    var display_Cookies = $('#display_cookies');
    var url = $('#url');

    // onClick's logic below:
    clear_Cookies.addEventListener('click', () => {
        clearAllCookies();
    });

    set_Cookies.addEventListener('click', () => {
        setCookies();
    });

    display_Cookies.addEventListener('click', () => {
        displayCookies();
    });

    url.addEventListener('blur', () => {
        updateBanner();
    });
});