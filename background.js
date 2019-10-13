/**
 * @author Vinit Shahdeo
 * @email vinitshahdeo@gmail.com
 */
let count = 0;
$("#banner").fadeTo(4000, 500).slideUp(500, function(){
  $("#banner").slideUp(500);
});
$("#developer").fadeTo(4000, 500).slideUp(500, function(){
  $("#developer").slideUp(500);
});
function setCookieCount(){
chrome.cookies.getAll({},function(cookies){
    count=cookies.length;
    document.getElementById("cookie-counter").innerHTML = count;
});
}

setCookieCount();

function displayCookies(){

  setCookieCount();
  
  document.getElementById("cookie").style.display="none";
  
  const tableLog = document.getElementById("cookieslog");
  tableLog.style.display="table";
  tableLog.innerHTML = "";
  
  const domain = document.getElementById("url").value;
  //let tarea_regex = /(http(s?))\:\/\//gi;
  if(domain=="" || domain==null){
    document.getElementById("banner").style.display="block";
    document.getElementById("message").style.display-"block";
    document.getElementById("banner").style.className="alert alert-danger alert-dismissible";
    document.getElementById("message").innerHTML="Invalid URL! <strong>Hint</strong> : Please enter <strong>complete url</strong> including <kbd>http://</kpd> or <kpd>https://</kpd> below and press <span class='label label-primary'>Display Cookies</span>"
  }
  if(!(domain.indexOf("http://") == 0 || domain.indexOf("https://") == 0)){
    document.getElementById("banner").style.display="block";
    document.getElementById("message").style.display="block";
    document.getElementById("banner").style.className="alert alert-danger alert-dismissible";
    document.getElementById("message").innerHTML="Invalid URL! <strong>Hint</strong> : Please enter <strong>complete url</strong> including <kbd>http://</kbd> or <kbd>https://</kbd> below and press <span class='label label-primary'>Display Cookies</span>";
  }
  else{
    document.getElementById("banner").style.display="none";
    chrome.cookies.getAll({url:domain},function(cookies){
    //let row = tableLog.insertRow(-1);
  
    for(let i in cookies){

      
      if(i==0){
        let firstRow = tableLog.insertRow(-1);
        firstRow.insertCell(0).innerHTML="<strong>NAME</strong>";
        firstRow.insertCell(1).innerHTML="<strong>VALUE</strong>";
      }
      
      console.log(cookies[i]);
      //let row = "<tr><td>"+cookies[i].name+"</td><td>"+cookies[i].value+"</td></tr>";
      const row = tableLog.insertRow(-1);
      let value = cookies[i].value;
      let name = cookies[i].name;
      
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

function setCookies(){
  document.getElementById("cookieslog").style.display="none";
  const domain = document.getElementById("url").value;
  const name = document.getElementById("key").value;
  const value = document.getElementById("value").value;
  const input = document.getElementById("cookie").style.display="block";
  const banner = document.getElementById("banner");
  banner.style.display="block";
  banner.className="alert alert-info alert-dismissible"
  document.getElementById("message").innerHTML = "Please enter the <strong>url</strong>, <strong>name</strong> and <strong>value</strong> pair and click <span class='label label-success'>Set Cookies</span> button."
  if(domain=="" || domain==null){
    document.getElementById("message").innerHTML = "Please enter the <kbd>url</kbd>, <kbd>name</kbd> & <kbd>value</kbd> pair and click <span class='label label-success'>Set Cookies</span> button."
  }
  else if(name=="" || name==null || value=="" || value==null){
    banner.className="alert alert-warning alert-dismissible";
    document.getElementById("message").innerHTML = "Please enter the <code>name</code> and <code>value</code> pair and click <span class='label label-success'>Set Cookies</span> button."
  }
  else{
  chrome.cookies.set({url:domain,name:name,value:value,expirationDate : 1610701693},function(cookie){
    console.log("cookie is set");

    document.getElementById("banner").className="alert alert-success alert-dismissible";
    document.getElementById("message").innerHTML = "<strong>SUCCESS!</strong> Cookies is set for <strong>"+domain+"</strong>";
    console.log(cookie);
    const name = document.getElementById("key").value="";
    const value = document.getElementById("value").value="";
    $("#banner").fadeTo(2000, 500).slideUp(500, function(){
      $("#banner").slideUp(500);
    });
    setCookieCount();
  });
}
}
 //displayCookies();
 //setCookies();
function onCookieChanged(){
  chrome.cookies.onChanged.addListener(function(cookies){
      console.log("cookies are being changed ", cookies.cookie.domain);
      console.log(cookies);
  });
}

onCookieChanged();

  function clearAllCookies(){
    console.log("cookies cleared");
    chrome.cookies.getAll({}, function(cookies) {
        for (let i in cookies) {
          removeCookie(cookies[i]);
        }
      });
      document.getElementById("banner").className="alert alert-danger alert-dismissible";
      document.getElementById("message").innerHTML = "All Cookies are cleared!";
      setCookieCount();
  }
  
  function removeCookie(cookie) {
    let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
              cookie.path;
    chrome.cookies.remove({"url": url, "name": cookie.name});
  }
  
  function updateBanner(){
    document.getElementById("banner").style.display="none";
  }

  document.addEventListener('DOMContentLoaded', function() {
    let clear_Cookies = document.getElementById("clear_cookies");
    let set_Cookies = document.getElementById("set_cookies");
    let display_Cookies = document.getElementById("display_cookies");
    let url = document.getElementById("url");
    // onClick's logic below:
    clear_Cookies.addEventListener('click', function() {
        clearAllCookies();
    });
    set_Cookies.addEventListener('click',function(){
        setCookies();
    });
    display_Cookies.addEventListener('click',function(){
        displayCookies();
    });
    url.addEventListener('blur',function(){
        updateBanner();
    });
});
