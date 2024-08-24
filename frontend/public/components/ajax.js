var ajax = {
    ajaxRequest: function(path,okFunction,koFunction) {
        var request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.send();
        request.onreadystatechange = function() {
            /**
             *  Ready States:
             * 0 Unsent
             * 1 Opened
             * 2 HEADERS_RECIVED
             * 3 LOADING
             * 4 DONE
            **/
            if(request.readyState==XMLHttpRequest.DONE) {
                if(request.status == 200) {
                    var result=JSON.parse(request.responseText)
                    if(okFunction)okFunction(result);
                } else {
                    console.log("Error [%d]: %s",request.status,request.responseText);
                    if(koFunction)koFunction(request);
                }
            }
        };
    }
};