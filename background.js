/**
 * @author Vinit Shahdeo
 * @email vinitshahdeo@gmail.com
 */
var count = 0;
// banner animations
$("#banner").fadeTo(4000, 500).slideUp(500, function(){
  $("#banner").slideUp(500);
});
$("#developer").fadeTo(4000, 500).slideUp(500, function(){
  $("#developer").slideUp(500);
});

// shows total cookies 
setCookieCount = () => {
chrome.cookies.getAll({},function(cookies){
    count = cookies.length;
    $("#cookie-counter").html(count);
});
}

setCookieCount();

displayCookies = () => {
  
  $("#cookie").css('display', 'none');
  
  var tableLog = document.getElementById("cookieslog");
  tableLog.style.display="table";
  tableLog.innerHTML = "";
  
  var domain = $("#url").val();
  //var tarea_regex = /(http(s?))\:\/\//gi;
  if(domain=="" || domain==null){
    $("#banner").css('display', "block");
    $("#message").css('display',"block");
    $("#banner").addClass("alert alert-danger alert-dismissible");
    $("#message").html("Invalid URL! <strong>Hint</strong> : Please enter <strong>complete url</strong> including <kbd>http://</kpd> or <kpd>https://</kpd> below and press <span class='label label-primary'>Display Cookies</span>")
  }
  if(!(domain.indexOf("http://") == 0 || domain.indexOf("https://") == 0)){
    $("#banner").css('display', 'block');
    $("#message").html("Invalid URL! <strong>Hint</strong> : Please enter <strong>complete url</strong> including <kbd>http://</kbd> or <kbd>https://</kbd> below and press <span class='label label-primary'>Display Cookies</span>").css("display","block");

  }
  else{
    $("#banner").css('display', "none");
    chrome.cookies.getAll({url:domain},function(cookies){
    for(var i in cookies){
      if(i == 0){
        var firstRow = tableLog.insertRow(-1);
        firstRow.insertCell(0).innerHTML="<strong>NAME</strong>";
        firstRow.insertCell(1).innerHTML="<strong>VALUE</strong>";
      }
      
      console.log(cookies[i]);
      //var row = "<tr><td>"+cookies[i].name+"</td><td>"+cookies[i].value+"</td></tr>";
      var row = tableLog.insertRow(-1);
      var value = cookies[i].value;
      var name = cookies[i].name;
      
      if(name.length>10){
        name = name.substring(0,10);
        name+="...";
      }
      if(value.length>15){
        value = value.substring(0,15);
        value+="...";
      }
      row.insertCell(0).innerHTML = name;
      row.insertCell(1).innerHTML = value;
    }
  });
}
}

setCookies = () => {
  $("#cookieslog").css('display', 'none')
  var domain = $("#url").val();
  var name = $("#key").val();
  var value = $("#value").val();
  var input = $("#cookie").css('display','block')
  $("#banner").css('display','block').addClass("alert alert-info alert-dismissible")
  // One message instance
  let message = $("#message").html("Please enter the <strong>url</strong>, <strong>name</strong> and <strong>value</strong> pair and click <span class='label label-success'>Set Cookies</span> button.") 

  if(domain == ""){
    message
  }
  else if(name=="" || name==null || value=="" || value==null){
    message
  }
  else{
    chrome.cookies.set({url:domain,name:name,value:value,expirationDate : 1610701693},function(cookie){
      $("#banner").removeClass("alert alert-info alert-dismissible").addClass("alert alert-success alert-dismissible")
      $("#message").html("<strong>SUCCESS!</strong> Cookies is set for <strong>"+domain+"</strong>");
      console.log(cookie);
      $("#url").val('')
      var name = document.getElementById("key").value="";
      var value = document.getElementById("value").value="";
      $("#banner").fadeTo(2000, 500).slideUp(500, function(){
        $("#banner").slideUp(500);
      });
      setCookieCount();
    });
  }
}

onCookieChanged = () => {
  chrome.cookies.onChanged.addListener(function(cookies){
      console.log(cookies);
      console.log("cookies are being changed ", cookies.cookie.domain);
  });
}
onCookieChanged();

clearAllCookies = () => {
    console.log("cookies cleared");
    chrome.cookies.getAll({}, function(cookies) {
        for (var i in cookies) {
          removeCookie(cookies[i]);
        }
      });
      document.getElementById("banner").className="alert alert-danger alert-dismissible";
      document.getElementById("message").innerHTML = "All Cookies are cleared!";
      $("#url").val("");
      var table = document.getElementById("cookieslog");
      table.style.display="none";
      table.innerHTML = "";
      setCookieCount();
  }
  
  function removeCookie(cookie) {
    var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
    chrome.cookies.remove({"url": url, "name": cookie.name});
  }
  
  function updateBanner(){
    document.getElementById("banner").style.display="none";
  }

  document.addEventListener('DOMContentLoaded', function() {

    // onClick's logic below:
    $("#clear_cookies").on('click', function() {
        clearAllCookies();
    });
    $("#set_cookies").on('click',function(){
        setCookies();
    });
    $("#display_cookies").on('click',function(){
        displayCookies();
    });
    $("#url").on('blur',function(){
        updateBanner();
    });
});