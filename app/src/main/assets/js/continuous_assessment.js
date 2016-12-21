MathJax.Hub.Config({
	showProcessingMessages: false,
	showMathMenu: false,
	messageStyle: "none",
    tex2jax: {
        inlineMath: [['$$','$$'], ['\\(','\\)']],
        displayMath: [['$$$','$$$'], ['\\(','\\)']]
    },
    styles: {
		".MathJax_SVG svg > g, .MathJax_SVG_Display svg > g": {
			fill: "#4A4A4A",
			stroke: "#4A4A4A"
		}
	}
});

MathJax.Hub.Register.StartupHook("End", function(){
	if ("jsObject" in window)
		jsObject.mathjax_done();
});

var $question_wrapper;
var $passages_wrapper;
var APPENDED_PASSAGE_IDS = {};
var PASSAGE_MARKER_LINE_NUMBERS = {};

$(function() {
	$question_wrapper = $("#questions_wrapper");
    $passages_wrapper = $("#passages_wrapper");

	// Simple choice options list
	$(document).on('click', '.js-option-list-item', function(e){
		e.preventDefault();
		e.stopPropagation();
		var $choice_clicked = $(e.target).closest(".js-option-list-item");
		var $question = $choice_clicked.closest(".js-question");

		if ($question.data("attempted") == true){
            return; // Already attempted
        }

		var question_style = $question.data("style") || "";

		// If choice is already selected
		if ($choice_clicked.hasClass("selected")) {
			var selected_choices_count = $question.find(".js-option-list-item.selected").length || 0;

			if (selected_choices_count<=1) {
				// Only 1 choice was selected, so should also disable submit button
				$question.data("user_answer_available", false);
				disablePrimaryQuestionBtnSubmit();
			}

			$choice_clicked.find("input").prop("checked", false);
			$choice_clicked.removeClass("selected");

			return;
		}

		// Single answer allowed
		if (question_style != "multiple correct") {
			var $selected_choices = $question.find(".js-option-list-item.selected");
			if ($selected_choices.length) {
				$selected_choices.each(function() {
	                $(this).find("input").prop("checked", false);
	                $(this).removeClass("selected");
	            });
			}
		}

		$choice_clicked.find("input").prop("checked", true);
		$choice_clicked.addClass("selected");
		$question.data("user_answer_available", true);
		enablePrimaryQuestionBtnSubmit();
	});

	// Matrix options
	$(document).on('click', '.js-matrix-choice', function(e){
		e.preventDefault();
		e.stopPropagation();

		var $choice_clicked = $(e.target).closest(".js-matrix-choice");
		var $question = $choice_clicked.closest(".js-question");

		if ($question.data("attempted") == true){
            return; // Already attempted
        }

        // If choice is already selected
		if ($choice_clicked.hasClass("selected")) {
			var selected_choices_count = $question.find(".js-matrix-choice.selected").length || 0;

			if (selected_choices_count<=1) {
				// Only 1 choice was selected, so should also disable submit button
				$question.data("user_answer_available", false);
				disablePrimaryQuestionBtnSubmit();
			}

			$choice_clicked.find("input").prop("checked", false);
			$choice_clicked.removeClass("selected");
			return;
		}

		$choice_clicked.find("input").prop("checked", true);
		$choice_clicked.addClass("selected");
		$question.data("user_answer_available", true);
		enablePrimaryQuestionBtnSubmit();
	});

	// Blank
	$(document).on('keyup', '.js-blank-input', function(e){
		var $input = $(e.target).closest(".js-blank-input");
		var $question = $input.closest(".js-question");

		if ($input.val()) {
			$question.data("user_answer_available", true);
			enablePrimaryQuestionBtnSubmit();
		} else {
			$question.data("user_answer_available", false);
			disablePrimaryQuestionBtnSubmit();
		}
	});

    $(document).on('click', '.js-expand-passage-btn', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).closest(".js-passage-item-wrapper").addClass("is-expanded");
    });

    $(document).on('click', '.js-collapse-passage-btn', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).closest(".js-passage-item-wrapper").removeClass("is-expanded");
    });

    //display_dummy_passage_question();
});

function enablePrimaryQuestionBtnSubmit() {
	// JSObject
	console.log("enable submit button");
	if ("jsObject" in window)
		jsObject.enable_question_submit_btn();
}

function disablePrimaryQuestionBtnSubmit() {
	// JSObject
	console.log("disable submit button");
	if ("jsObject" in window)
		jsObject.disable_question_submit_btn();
}

function display_dummy_passage_question(){
    var passage_header = 'The excerpt below is from Ha Jin\'s "The Night of". Please read the passage and answer the following questions.';
    var passage_text = "<span>Their adobe house was the same as two de-</span><span>cades before, four large rooms under a thatched&#160;</span><span>roof and three square windows facing south with&#160;</span><span>their frames painted sky blue. Lin stood in the </span><span>yard facing the front wall while flipping over a&#160;</span><span>dozen mildewed books he had left to be sunned&#160;</span><span>on a stack of firewood. Sure thing, he thought,&#160;</span><span>Shuyu doesn't know how to take care of books.&#160;</span><span>Maybe I should give them to my nephews. These&#160;</span><span>books are of no use to me anymore.&#160;</span><span>Beside him chickens were strutting and geese&#160;</span><span>waddling. A few little chicks were passing back&#160;</span><span>and forth through the narrow gaps in the pal-&#160;</span><span>ing that fenced a small vegetable garden. In the&#160;</span><span>garden pole beans and long cucumbers hung on&#160;</span><span>trellises,&#160;</span><span class=\"x-marker\">11147</span><span>eggplants curved like ox horns, and let</span><span>tuce heads were so robust that they covered up&#160;</span><span>the furrows. In addition to the poultry, his wife&#160;</span><span>kept two pigs and a goat for milk. Their sow was&#160;</span><span>oinking from the pigpen, which was adjacent to </span><span>the western end of the vegetable garden. Against&#160;</span><span>the wall of the pigpen a pile of manure waited&#160;</span><span>to be carted to their family plot, where it would&#160;</span><span>go through high-temperature composting in a pit&#160;</span><span>for two months before being put into the field.&#160;</span><div><span>The air reeked of distillers' grains mixed in the </span><span>pig feed. Lin disliked the&#160;</span><span class=\"x-marker\">17960</span><span>&#160;our smell, which was&#160;</span><span>the only uncomfortable thing to him here. From&#160;</span><span>the kitchen, where Shuyu was cooking, came the&#160;</span><span>coughing of the bellows. In the south, elm and&#160;</span><span>birch crowns shaded their neighbors' straw and&#160;</span><span>titled roofs. Now and then a dog barked from&#160;</span><span>one of these homes.&#160;</span><span>Having turned over all the books,&#160;</span><span class=\"x-marker\">23837</span><span>Lin went&#160;</span><span>out of the front wall, which was three feet high&#160;</span><span>and topped with thorny jujube branches. In one&#160;</span><span>hand he held a dog-eared Russian dictionary he&#160;</span><span>had used in high school. Having nothing to do,&#160;</span><span>he sat on their grinding stone, thumbing through&#160;</span><span>the old dictionary. He still remembered some&#160;</span><span>Russian vocabulary and even tried to form a few&#160;</span><span>short sentences in his mind with some words.&#160;</span><span>But he couldn't recall the grammatical rules&#160;</span><span>for the case changes exactly, so he gave up and&#160;</span><span>let the books lie on his lap. Its pages fluttered&#160;</span><span>a little as a breeze blew across.&#160;</span><span class=\"x-marker\">32442</span><span>&#160;He raised his&#160;</span><span>eyes to watch the villagers hoeing potatoes in a </span><span>distant field, which was so vast that a red flag&#160;</span><span>was planted in the middle of it as a marker, so&#160;</span><span>that they could take a break when they reached&#160;</span><span>the flag. Lin was fascinated by the sight, but he&#160;</span><span>knew little about farm work.&#160;</span><span>(1999)</span></div>";
    var passage_footer = '';
    var question = "<div class=\"question js-question\" id=\"q-3\" data-id=\"201904\" data-style=\"single correct\" data-solution-available=\"1\">  <form method=\"post\" class=\"js-question-form\" autocomplete=\"off\" onsubmit=\"return false;\">  <div class=\"content\">                 <span>The phrase &#34;eggplants curved like oxhorns&#34; in line&#160;</span><span class=\"x-ref\">11147</span><span>&#160;</span><span>contains an instance of</span><br/>                              </div>               <table class=\"options-list\">               <tr class=\"js-option-list-item\" data-choice-id=\"659951\" data-is-right=\"1\">         <td>          <span class=\"label\">A</span>         </td>         <td class=\"option\">          170 g line no&#160;<span class=\"x-ref\">32442</span>                          <input type=\"checkbox\" name=\"choices\" value=\"659951\">                <div class=\"choice-result js-choice-result\"></div>         </td>        </tr>               <tr class=\"js-option-list-item\" data-choice-id=\"1269573\" >         <td>          <span class=\"label\">B</span>         </td>         <td class=\"option\">          85 g line no&#160;<span class=\"x-ref\">23837</span>                          <input type=\"checkbox\" name=\"choices\" value=\"1269573\">                <div class=\"choice-result js-choice-result\"></div>         </td>        </tr>               <tr class=\"js-option-list-item\" data-choice-id=\"1269574\" >         <td>          <span class=\"label\">C</span>         </td>         <td class=\"option\">          340 g line no&#160;<span class=\"x-ref\">17960</span>                          <input type=\"checkbox\" name=\"choices\" value=\"1269574\">                <div class=\"choice-result js-choice-result\"></div>         </td>        </tr>               <tr class=\"js-option-list-item\" data-choice-id=\"1269575\" >         <td>          <span class=\"label\">D</span>         </td>         <td class=\"option\">          240 g line no&#160;<span class=\"x-ref\">11147</span>                          <input type=\"checkbox\" name=\"choices\" value=\"1269575\">                <div class=\"choice-result js-choice-result\"></div>         </td>        </tr>                </table>     <div class=\"content solution js-solution\">   <h2>Solution</h2>      Reaction:<br/><span>$$NaCl+AgNO_3 \\rightarrow AgCl+NaNO_3$$</span><div><span>1 mole of sodium chloride reacts with 1 mole of silver nitrate to form 1 mole of silver chloride and one mole of silver nitrate.<br/>58.5 g of sodium chloride reacts with 170 g of silver nitrate to form 143.5 g of silver chloride and 85 g of sodium nitrate.</span></div>  </div>  </form> </div>";
    var seq_num = 3;
    var passage_id = 101;

    addQuestion(question, seq_num);
    addPassage(passage_id, passage_header, passage_footer, passage_text);

    setTimeout(function(){
        displayQuestion(3);
        displayPassage(101, 3);
    },0);

    setTimeout(function(){
        displayPassage(101, 3);
    },1500);
}

function addQuestion(question, seq_num){
	var html = '<div class="js-question-item-wrapper" id="q-'+seq_num+'" style="display:none;">'+question+'</div>';
	$question_wrapper.append(html);
	console.log("Added question: " + seq_num);
}

function displayQuestion(seq_num){
	console.log("displayQuestion invoked " + seq_num);
	$question_wrapper.find(".js-question-item-wrapper").hide();

	var $question = $question_wrapper.find("#q-"+seq_num);
	if ($question.length) {
		console.log("Displaying question " + seq_num);
		$question.show();

		setTimeout(function(){
			console.log("Typesetting mathjax");
			MathJax.Hub.Queue(['Typeset',MathJax.Hub, "q-"+seq_num]);
		},0);
	}
}

function addPassage(passage_id, passage_header, passage_footer, passage_text) {
	console.log("addPassage invoked " + passage_id);

	if (APPENDED_PASSAGE_IDS.hasOwnProperty(passage_id)) {
		console.log("passage " + passage_id + "already in DOM");
		return;
	}

    var html = '\
        <div id="p-'+passage_id+'" data-processed="0" class="passage-item-wrapper js-passage-item-wrapper" style="display:none;">\
            <div class="passage-toggle">\
                <a class="passage-toggle-btn expand-passage js-expand-passage-btn"><span class="passage-toggle-btn-icon expand"></span>Show passage</a>\
                <a class="passage-toggle-btn collapse-passage js-collapse-passage-btn"><span class="passage-toggle-btn-icon collapse"></span>Hide passage</a>\
            </div>\
            <div class="passage-content">\
                <div class="passage-header js-passage-header">'+(passage_header||'')+'</div>\
                <div class="passage-text js-passage-text">'+(passage_text||'')+'</div>\
                <div class="passage-footer js-passage-footer">'+(passage_footer||'')+'</div>\
            </div>\
        </div>';

    $passages_wrapper.append(html);
    APPENDED_PASSAGE_IDS[passage_id] = true;
    console.log("passage " + passage_id + " added to DOM");
}

function displayPassage(passage_id, ques_seq_num){
	console.log("Display passage invoked " + passage_id);
    $passages_wrapper.find(".js-passage-item-wrapper").hide();
    var $passage = $passages_wrapper.find("#p-"+passage_id);
    if ($passage.length) {
        console.log("Displaying passage");
        $passage.removeClass("is-expanded").show();

        setTimeout(function(){
            console.log("initialising passage..");
            insertLineNumbersAndMarkers($passage, passage_id, ques_seq_num);
            //MathJax.Hub.Queue(['Typeset',MathJax.Hub, "p-"+passage_id]);
            // $passage.data("processed", 1);
        },0);
    } else {
    	console.log("could not find passage in dom "+ passage_id);
    }
}

function hidePassage(){
    console.log("hidePassage invoked ");
    $passages_wrapper.find(".js-passage-item-wrapper").hide();
}

function insertLineNumbersAndMarkers($passage, passage_id, ques_seq_num){
    var passageMarkerLines = {};
    if (!PASSAGE_MARKER_LINE_NUMBERS.hasOwnProperty('p-' + passage_id)) {
        console.log('no line data for passage '+ passage_id);
        var $passage_text = $passage.find(".js-passage-text");
        var passageHeight = $passage_text.height();
        var lineHeight = parseInt($passage_text.css('line-height'), 10);
        var totalLines = passageHeight / lineHeight;

        for (var lineNumber = 1; lineNumber <= totalLines; lineNumber++) {
            if (lineNumber == 1 || lineNumber % 5 == 0) {
                $passage_text.append($("<span>", { class: "line-num" }).text(lineNumber).css("top", (lineNumber-1)*lineHeight));
            }
        }

        var passageTopOffset = $passage_text.offset().top;
        var $passageMarkers = $passage.find('.x-marker');
        $passageMarkers.each(function(){
            var $marker = $(this);
            var markerID = $marker.text();
            $marker.data("marker", markerID);
            var topOffset = $marker.offset().top;
            var lineNum = Math.ceil((topOffset - passageTopOffset) / lineHeight);
            passageMarkerLines['ref-' + markerID] = lineNum;
            $marker.text('');
            // console.log(markerID, topOffset, lineNum);
        });
        PASSAGE_MARKER_LINE_NUMBERS[('p-' + passage_id)] = passageMarkerLines;
        console.log('PASSAGE_MARKER_LINE_NUMBERS', PASSAGE_MARKER_LINE_NUMBERS);
    } else {
        passageMarkerLines = PASSAGE_MARKER_LINE_NUMBERS[('p-' + passage_id)];
        console.log('already have line data for passage '+ passage_id);
    }

    var $question = $question_wrapper.find("#q-"+ques_seq_num);
    if ($question.length) {
        var processed = parseInt($question.data("markers-processed"),10);
        if (processed) {
            console.log("passage question markers are already initialised " + ques_seq_num);
            return;
        }

        var $refs = $question.find('.x-ref');
        $refs.each(function(){
            var $ref = $(this);
            var referencedMarker = $ref.text();
            var referencedMarkerKey = 'ref-' + referencedMarker;

            $ref.data("marker", referencedMarker);
            if (passageMarkerLines.hasOwnProperty(referencedMarkerKey)) {
                $ref.text(passageMarkerLines[referencedMarkerKey]).css({color: 'inherit'});
            }

            $question.data("markers-processed", 1);
        });
    }
}

function submitQuestionAction(seq_num, access_token) {
	var $question = $question_wrapper.find("#q-"+seq_num).find(".js-question");
	if (!$question.length)
		return;

	// console.log("found question");
	var user_answer_available = $question.data("user_answer_available") || false;
	// console.log("user_answer_available: "+user_answer_available);

	// console.log("access_token: "+access_token);

	// var time_taken = 300; //ms
	// var data = $question.find("form").serializeArray();
	// console.log(data);

	var form_data = $question.find("form").serialize();
	console.log(form_data);

	if ("jsObject" in window)
		jsObject.submit_answer(form_data);
}

function onQuestionAttempted(seq_num, is_correctly_answered, response) {
	var $question = $question_wrapper.find("#q-"+seq_num).find(".js-question");
	$question.data("attempted", true);
	var question_style = $question.data("style") || "";
	var solution_available = parseInt($question.data("solution-available"),10) || 0;

	response = $.parseJSON(response);
	is_correctly_answered = response.is_correctly_answered;
	var right_answers = response.right_answers || [];
	// console.log(right_answers);
	
	if (question_style == "single correct" || question_style == "multiple correct" || question_style == "assertion") {
		displayQuestionAnswer_optionList($question, right_answers);
	}
	else if (question_style == "matrix") {
		displayQuestionAnswer_matrix($question, right_answers);
	}
	else if (question_style == "blank") {
		displayQuestionAnswer_blank($question, is_correctly_answered, response.right_answer || "");
	}

	if (solution_available) {
		var $solution = $question.find(".js-solution");
		$solution.show();
	}
}

function displayQuestionAnswer_optionList($question, right_answers) {
	$question.find(".js-option-list-item").each(function() {
		$choice = $(this);
		var choice_id = parseInt($choice.data("choice-id"), 10);
		// console.log(choice_id);

		var is_right = $.inArray(choice_id, right_answers) > -1;
		var is_selected = $choice.hasClass("selected");

		if (is_right) {
			$choice.addClass("correct");
		} else {
			if (is_selected) {
				$choice.addClass("wrong");
			}
		}

		if (is_selected) {
			$choice.find(".js-choice-result").html("<div class='text'>Your answer</div>");
		}
	});
}

function displayQuestionAnswer_matrix($question, right_answers) {
	//var answer = $question.data("answer").split(",");
	var $selected_choices = $question.find(".js-matrix-choice.selected");
	$selected_choices.addClass("wrong");

	$.each(right_answers, function(index, value) {
        var $choice = $question.find(".js-matrix-choice-"+ value);
        $choice.removeClass("wrong").addClass("correct");
    });
}

function displayQuestionAnswer_blank($question, is_correctly_answered, right_answer) {
	var $input_wrapper = $question.find(".js-input-wrapper");
	var $input = $question.find(".js-blank-input");
	$input.prop("disabled", true);
	$input.attr("placeholder", "");

	console.log(is_correctly_answered);

	if (is_correctly_answered){
		console.log("yes, is_correctly_answered");
	} else {
		console.log("not is_correctly_answered");
	}

	console.log(typeof is_correctly_answered);
	console.log(right_answer);

	var user_answer = $input.val().trim();

	if (!is_correctly_answered) {
		$input_wrapper.addClass("wrong");
		$input_wrapper.find(".choice-result").html("Wrong answer");
		$input_wrapper.find(".js-correct-answer").html(right_answer);
	} else {
		$input_wrapper.addClass("correct");
		$input_wrapper.find(".choice-result").html("Correct answer");
	}
}


