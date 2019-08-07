import $ from 'jquery'

$(document).ready(function() {  
	$(".mobil-profil").click(function(e){
		e.preventDefault();
		$(".content-profil").addClass("open");
	});

	$(".profil-close").click(function(e){
		e.preventDefault();
		$(".content-profil").removeClass("open");
	});

});
