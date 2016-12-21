MathJax.Hub.Config({
    showProcessingMessages: false,
    showMathMenu: false,
    messageStyle: "none",
    tex2jax: {
        inlineMath: [
            ['$$', '$$'],
            ['\\(', '\\)']
        ],
        displayMath: [
            ['$$$', '$$$'],
            ['\\(', '\\)']
        ]
    },
    styles: {
        ".MathJax_SVG svg > g, .MathJax_SVG_Display svg > g": {
            fill: "#4A4A4A",
            stroke: "#4A4A4A"
        }
    }
});
MathJax.Hub.Register.StartupHook("End", function() {
    if ("jsObject" in window)
        jsObject.mathjax_done();
    else
        console.log("mathjax done");
});

$(function() {
    $(document).on('click', '.bookmark', on_bookmark_clicked);
    $(document).on('click', '.js-question-options', on_question_options_clicked);
    $(document).on('click', '.js-subjective-solution-btn', on_subjective_question_solution_btn_clicked);

    $(document).on('click', '.js-header-btn-filter', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if ("jsObject" in window)
            jsObject.display_filters();
    });

    $(document).on('click', '.js-upgrade-alert', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if ("jsObject" in window)
            jsObject.upgrade();
    });

    $(document).on('click', '.js-expand-passage', function(e) {
        $(e.target).closest(".js-passage").addClass("expand");
    });

    $(document).on('click', '.js-collapse-passage', function(e) {
        $(e.target).closest(".js-passage").removeClass("expand");
    });

    $(document).on('click', '.js-passage-question-nav', function(e) {
        var $navItem = $(e.target).closest(".js-passage-question-nav");
        var navType = $navItem.data("nav-type");
        var $passageQuestionItem = $navItem.closest(".js-passage-question-item");
        var currentQuestion = parseInt($passageQuestionItem.data("current-question"));
        var totalQuestions = parseInt($passageQuestionItem.data("total-questions"));
        var newCurrentQuestion;

        if (!$navItem.hasClass("active"))
            return;

        if (navType == "prev") {
            newCurrentQuestion = currentQuestion-1;
        } else {
            newCurrentQuestion = currentQuestion+1;
        }

        var $newQuestion = $passageQuestionItem.find(".js-question").eq(newCurrentQuestion-1);
        if (!$newQuestion.length) {
            console.log("new question " + newCurrentQuestion + " doesn't exist in DOM. " + navType);
            return;
        }

        $passageQuestionItem.find(".js-question").hide();
        $newQuestion.show();
        $passageQuestionItem.data("current-question", newCurrentQuestion);
        $passageQuestionItem.find(".js-active-passage-question-num").text("Q"+ (newCurrentQuestion));

        var $navPrev = $passageQuestionItem.find(".js-passage-question-nav[data-nav-type='prev']");
        var $navNext = $passageQuestionItem.find(".js-passage-question-nav[data-nav-type='next']");

        $navPrev.toggleClass("active", newCurrentQuestion != 1);
        $navNext.toggleClass("active", newCurrentQuestion != totalQuestions);
    });

    $(document).on('click', '.js-option-list-item', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $choice_clicked = $(e.target).closest(".js-option-list-item");
        var $question = $choice_clicked.closest(".js-question");

        if ($question.data("attempted") == true) {
            return; // Already attempted
        }

        var question_style = $question.data("style") || "";
        var $submit_btn = $question.find(".js-submit-btn");

        // If choice is already selected
        if ($choice_clicked.hasClass("selected")) {
            var selected_choices_count = getSelectedOptionsCount($question) || 0;

            if (selected_choices_count <= 1) {
                // Only 1 choice was selected, so should also disable submit button
                $submit_btn.removeClass("active");
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
        $submit_btn.addClass("active");
    });

    $(document).on('click', '.js-matrix-choice', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $choice_clicked = $(e.target).closest(".js-matrix-choice");
        var $question = $choice_clicked.closest(".js-question");

        if ($question.data("attempted") == true) {
            return; // Already attempted
        }

        var $submit_btn = $question.find(".js-submit-btn");

        // If choice is already selected
        if ($choice_clicked.hasClass("selected")) {
            var selected_choices_count = $question.find(".js-matrix-choice.selected").length || 0;

            if (selected_choices_count <= 1) {
                // Only 1 choice was selected, so should also disable submit button
                $submit_btn.removeClass("active");
            }

            $choice_clicked.find("input").prop("checked", false);
            $choice_clicked.removeClass("selected");

            return;
        }

        $choice_clicked.find("input").prop("checked", true);
        $choice_clicked.addClass("selected");
        $submit_btn.addClass("active");
    });

    $(document).on('keyup', '.js-blank-input', function(e) {
        var $input = $(e.target).closest(".js-blank-input");
        var $question = $input.closest(".js-question");
        var $submit_btn = $question.find(".js-submit-btn");

        if ($input.val()) {
            $submit_btn.addClass("active");
        } else {
            $submit_btn.removeClass("active");
        }
    });

    $(document).on('submit', 'form', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $question = $(e.target).closest(".js-question");
        var $submit_btn = $question.find(".js-submit-btn");

        if ($submit_btn.hasClass("active")) {
            $submit_btn.click();
        }
    });

    $(document).on('click', '.js-submit-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $submit_btn = $(e.target).closest(".js-submit-btn");

        if (!$submit_btn.hasClass("active")) {
            return;
        }

        var $question = $(this).closest(".js-question");
        var question_id = $question.data("id") || 0;
        var form_data = $question.find("form").serialize();

        //console.log("question_id: "+question_id);
        //console.log("form serialize: "+form_data);

        if ("jsObject" in window)
            jsObject.submit_answer(question_id, form_data);
    });

    $(document).on('click', '.js-show-more', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $target = $(e.target);
        var $question = $target.closest(".js-question");
        $question.toggleClass("is-show-partial");
        if ($question.hasClass("is-show-partial")) {
            $target.html('Show More');
        } else {
            $target.html('Show Less');
        }
    });

    $(document).on('click', '.js-question-doubt', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $question = $(this).closest(".js-question");
        var question_id = $question.data("id") || 0;

        if ("jsObject" in window)
            jsObject.display_ask_doubt(question_id)
    });
});

function onAnswerSubmitted(question_id, is_correctly_answered) {
    var $question = $("#question_" + question_id);
    var is_correct_attempt = parseInt(is_correctly_answered) || 0;

    if (!$question.length)
        return;

    $question.data("attempted", true);
    $question.find(".js-submit-btn").removeClass("active");
    var $q_no = $question.find(".q-no");

    if (is_correct_attempt) {
        $q_no.addClass("correct");
    } else {
        $q_no.addClass("wrong");
    }

    var question_style = $question.data("style") || "";

    if (question_style == "single correct" || question_style == "multiple correct" || question_style == "assertion") {
        displayQuestionAnswer_optionList($question);
    }

    if (question_style == "matrix") {
        displayQuestionAnswer_matrix($question);
    }

    if (question_style == "blank") {
        displayQuestionAnswer_blank($question);
    }
}

function getSelectedOptionsCount($question) {
    var $selected_choices = $question.find(".js-option-list-item.selected");
    return $selected_choices.length;
}

function displayQuestionAnswer_optionList($question) {
    //$question.data("attempted", true);
    //$question.find(".js-submit-btn").remove();
    $question.find(".js-option-list-item").each(function() {
        $choice = $(this);

        var is_right = parseInt($choice.data("is-right") || 0);
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

function displayQuestionAnswer_matrix($question) {
    //$question.data("attempted", true);
    //$question.find(".js-submit-btn").remove();

    var answer = $question.data("answer").split(",");
    var $selected_choices = $question.find(".js-matrix-choice.selected");
    $selected_choices.addClass("wrong");

    $.each(answer, function(index, value) {
        var $choice = $question.find(".js-matrix-choice-" + value);
        $choice.removeClass("wrong").addClass("correct");
    });
}

function displayQuestionAnswer_blank($question) {
    //$question.data("attempted", true);
    //$question.find(".js-submit-btn").remove();
    var $input_wrapper = $question.find(".js-input-wrapper");
    var $input = $question.find("input");
    $input.prop("disabled", true);

    var answer = $question.data("answer");
    var user_answer = $input.val().trim();

    if (answer != user_answer) {
        $input_wrapper.addClass("wrong");
        $input_wrapper.find(".choice-result").html("Wrong answer");
    } else {
        $input_wrapper.addClass("correct");
        $input_wrapper.find(".choice-result").html("Correct answer");
    }
}

function on_bookmark_clicked(e) {
    var $bookmark_icon = $(e.target).closest(".bookmark");
    var id = $bookmark_icon.data("id") || 0;
    var is_bookmarked = $bookmark_icon.data("is-bookmarked") || 0;
    var in_progress = $bookmark_icon.data("in-progress") || 0;

    if (in_progress) {
        return;
    }

    $bookmark_icon.data("in-progress", 1);

    if (is_bookmarked) {
        $bookmark_icon.data("is-bookmarked", 0);
        $bookmark_icon.removeClass("active");
        remove_bookmark(id);
    } else {
        $bookmark_icon.data("is-bookmarked", 1);
        $bookmark_icon.addClass("active");
        add_bookmark(id);
    }
}

function on_question_options_clicked(e) {
    var $options_icon = $(e.target).closest(".js-question-options");
    var id = $options_icon.data("id") || 0;

    if ("jsObject" in window)
        jsObject.display_question_options(id);
}

function on_subjective_question_solution_btn_clicked(e) {
    e.preventDefault();
    e.stopPropagation();

    var $question = $(e.target).closest(".js-question");
    var question_id = $question.data("id") || 0;

    if ("jsObject" in window)
        jsObject.display_subjective_question_solution(question_id);
}

function add_bookmark(id) {
    if ("jsObject" in window)
        jsObject.add_bookmark(id);
}

function remove_bookmark(id) {
    if ("jsObject" in window)
        jsObject.remove_bookmark(id);
}

function display_bookmarked(id) {
    var $bookmark_icon = $("#bookmark_" + id);

    if ($bookmark_icon.length) {
        $bookmark_icon.data("in-progress", 0);
        $bookmark_icon.data("is-bookmarked", 1);
        $bookmark_icon.addClass("active");
    }
}

function display_non_bookmarked(id) {
    var $bookmark_icon = $("#bookmark_" + id);

    if ($bookmark_icon.length) {
        $bookmark_icon.data("in-progress", 0);
        $bookmark_icon.data("is-bookmarked", 0);
        $bookmark_icon.removeClass("active");
    }
}

function setData(data, header_data) {
    $("#questions_wrapper").html(data);
    $(".js-header-questions-count").html(header_data);
    setTimeout(function(){
        initPassages();
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    },0);
}

function initPassages(){
    var $passages = $("#questions_wrapper").find(".js-passage-question-item");
    if ($passages.length) {
        $passages.each(function(){
            var $passage = $(this);
            var $passage_text = $passage.find(".js-passage-text");
            var $passage_text_LineNumWrapper = $passage_text.find(".line-number-wrapper");
            var passageMarkerLines = {};
            var passageHeight = $passage_text.height();
            var lineHeight = parseInt($passage_text.css('line-height'), 10);
            var totalLines = passageHeight / lineHeight;

            for (var lineNumber = 1; lineNumber <= totalLines; lineNumber++) {
                if (lineNumber == 1 || lineNumber % 5 == 0) {
                    $passage_text_LineNumWrapper.append($("<span>", { class: "line-number" }).text(lineNumber).css("top", (lineNumber-1)*lineHeight));
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
            console.log('passageMarkerLines', passageMarkerLines);

            var $questions = $passage.find(".js-question");
            $questions.each(function(index){
                var $question = $(this);
                var $refs = $question.find('.x-ref');
                $refs.each(function(){
                    var $ref = $(this);
                    var referencedMarker = $ref.text();
                    var referencedMarkerKey = 'ref-' + referencedMarker;

                    $ref.data("marker", referencedMarker);
                    if (passageMarkerLines.hasOwnProperty(referencedMarkerKey)) {
                        $ref.text(passageMarkerLines[referencedMarkerKey]).css({color: 'inherit'});
                    }
                });

                if (index != 0) {
                    $question.hide();
                }
            });
        });
    }
}

function hideFilter() {
    $('.js-header-btn-filter').hide();
}

function hideQuestionsCount() {
    $('.js-header-questions-count').hide();
}

function display_upgrade_alert(locked_questions_count) {
    var $alert = $(".js-upgrade-alert");
    var $questions_count = $alert.find(".js-locked-questions-count");
    $questions_count.html(locked_questions_count);
    $alert.show();
}
