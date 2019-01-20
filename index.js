chrome.storage.local.set({syncDomain: "getpostman.com"}, function() {
    //console.log("domain is being set");
  });

// chrome.storage.local.get(['syncDomain'], function(result) {
//     console.log('Currently sync domain is set as ' + result.syncDomain);
//   });

// chrome.storage.local.get(['syncDomain'], function(result) {
//     //console.log('Currently sync domain is set as ' + result.syncDomain);
//     //console.log(result.syncDomain);
//     console.log(result);
//   });
chrome.cookies.onChanged.addListener(function(obj){
    var syncDomain ;
    //console.log(obj);
    chrome.storage.local.get(['syncDomain'],function(result){
        syncDomain = result.syncDomain;
        if(obj.cookie.domain.indexOf(result.syncDomain) !== -1 && obj.removed === false){
            console.log(obj);
        }
        //console.log(obj.cookie.domain);
    });
    
});