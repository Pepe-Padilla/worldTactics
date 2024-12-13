var ajax = {
    ajaxRequest: function(path,okFunction,koFunction) {
        let request = new XMLHttpRequest();
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
            if(request.readyState===XMLHttpRequest.DONE) {
                if(request.status === 200) {
                    const result=JSON.parse(request.responseText)
                    if(okFunction)okFunction(result);
                } else {
                    console.log("Error [%d]: %s",request.status,request.responseText);
                    if(koFunction)koFunction(request);
                }
            }
        };
    },
    postRequest: function(path,body,okFunction,koFunction) {
        let request = new XMLHttpRequest();
        request.open("POST", path, true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(body);
        request.onreadystatechange = function() {
            /**
             *  Ready States:
             * 0 Unsent
             * 1 Opened
             * 2 HEADERS_RECIVED
             * 3 LOADING
             * 4 DONE
            **/
            if(request.readyState===XMLHttpRequest.DONE) {
                if(request.status >= 200 && request.status < 300) {
                    const result=JSON.parse(request.responseText)
                    if(okFunction)okFunction(result);
                } else {
                    console.log("Error [%d]: %s",request.status,request.responseText);
                    if(koFunction)koFunction(request);
                }
            }
        };
    }
};