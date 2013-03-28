

var tweetSearch = function () {
	"use strict";
	//global variables
	var props = {
		container : null,
		tweet_results : [],
		user_entry : "",
		result_no : 5
	};



	return {

		init:function () {

			var reference = null;

			props.container = $('#container');

			// cancellling the function of the enter key
			props.container.find('#twitter_search').keypress(function (evt) {
				var charCode = evt.charCode || evt.keyCode;
				if (charCode  == 13) { //Enter key's keycode
					return false;
				}
			});
			props.container.find('.icon_close').on('click', function() {
				$(this).siblings('#twitter_search').val('');
				clearTimeout(reference);
				reference = setTimeout(function(){
					tweetSearch.loadTweets();
				}, 500);
			});

			props.container.find('#twitter_search').on('keyup', function(evt) {
				// Deferring the triggering of loadTweets until 1 second
				// if user presses another key it will run clearTimeout and will reset to wait 1 second
				clearTimeout(reference);
				reference = setTimeout(function(){
					tweetSearch.loadTweets();
				}, 1000);
			});

			props.container.find('select#resultNo').change(function() {
				// Deferring the triggering of loadTweets until half a second second
				clearTimeout(reference);
				reference = setTimeout(function(){
					tweetSearch.loadTweets();
				}, 500);
			});

		},
		// end init


		loadTweets:function () {
				//EMPTY TABLE
				props.container.find('#tweetResults tbody tr').not('.template').remove();

				props.user_entry = $('input#twitter_search').val();
				props.result_no = $('select#resultNo').val();

				//SETTING DATA
				var data = {
					q: props.user_entry,
					rpp: props.result_no
				};

				// Using ?callback=? in the url it tells jquery it's jsonp
				$.getJSON('http://search.twitter.com/search.json?callback=?', data, function(data) {
					props.tweet_results = data.results;

					// Doesn't iterate if there no results
					if (data.results === undefined || data.results.length === 0) {
						return;
					}

					$.each(data.results, function(index, result) {
						// Removing the class template, otherwise it won't be visible
						var template = props.container.find('.template').clone().removeClass('template');


						template.children('.usernames').html( function () {
							var extURL = 'https://twitter.com/';
							var userURL = extURL.concat(result.from_user);
							var linkEncode = '@<a href="' + userURL + '" class="username">' + result.from_user +'</a>';
							return linkEncode;
						});

						template.children('.tweet').html(twttr.txt.autoLink(result.text));




						props.container.find('#tweetResults tbody').append(template);
					});
				});
		}

	}; // end return

}();  // end main function

$(document).ready(function () {
	"use strict";
   // twitter plugin call
   tweetSearch.init();
});
