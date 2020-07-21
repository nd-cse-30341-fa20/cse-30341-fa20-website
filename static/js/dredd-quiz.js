/* AJAX functions */

function requestJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
	if (request.readyState == 4 && request.status == 200) {
	    callback(JSON.parse(request.responseText));
	}
    }

    request.open('GET', url, true);
    request.send();
}

function generateJSON() {
    var responses = {};
    $("#quiz-form").serializeArray().map(function(response){
    	if (response.name in responses && !(responses[response.name] instanceof Array)) {
	    responses[response.name] = [responses[response.name], response.value];
	} else {
	    if (responses[response.name] instanceof Array) {
		responses[response.name].push(response.value);
	    } else {
		responses[response.name] = response.value;
	    }
	}
    });

    var text  = JSON.stringify(responses, null, 2);
    var lines = text.split('\n')

    document.getElementById('quiz-responses').innerHTML = `<textarea class="form-control" rows="${lines.length}" cols="72">${text}</textarea>`;
}

function loadQuiz(quiz_url) {
    requestJSON(quiz_url, function(data) {
	var html = ['<form id="quiz-form"><ol>']
	
	Object.keys(data).sort().forEach(function(question) {
	    html.push(`<li><div class="form-group">${data[question].question}`);

	    if (data[question].type == 'single') {
		for (var response in data[question].responses) {
		    html.push('<div class="radio"><label>');
		    html.push(`<input type="radio" name="${question}" value="${response}">${data[question].responses[response]}`);
		    html.push('</label></div>');
		}
	    } else if (data[question].type == 'multiple') {
		for (var response in data[question].responses) {
		    html.push('<div class="checkbox"><label>');
		    html.push(`<input type="checkbox" name="${question}" value="${response}">${data[question].responses[response]}`);
		    html.push('</label></div>');
		}
	    } else if (data[question].type == 'order') {
		for (var response1 in data[question].responses) {
		    html.push(`<div class="form-group"><select name="${question}" class="form-control">`);
		    for (var response2 in data[question].responses) {
		    	var selected = (response1 == response2) ? "selected" : "";
			html.push(`<option value="${response2}" ${selected}>${data[question].responses[response2]}</option>`);
		    }
		    html.push('</select></div>');
		}
	    } else if (data[question].type == 'blank') {
	    	var blanks = data[question].question.split('____');
		html.push('<ol>');
	    	for (var i = 1; i < blanks.length; i++) {
		    html.push(`<li><input type="text" name="${question}"></li>`);
		}
		html.push('</ol>');
	    }

	    html.push('</div></li>');
	});
	html.push('</ol>');
	html.push('<div class="text-right"><button type="button" class="btn btn-primary" onclick="generateJSON()">Generate</button></div>');
	html.push('<br></form>');

	document.getElementById('quiz-questions').innerHTML = html.join('');
    });
}
