$(document).ready(function() {

	$('.questions-image').slick({
	  infinite: false,
	  slidesToShow: 5,
	  slidesToScroll: 1,
	  
	  responsive: [
		{
		  breakpoint: 700,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,

		  }
		}
	  ]

	});


	$('.discover-trend-bottom').slick({
	  infinite: true,
	  slidesToShow: 4,
	  slidesToScroll: 1,
		variableWidth: true,
	  responsive: [
		{
		  breakpoint: 1300,
		  settings: {
			slidesToShow: 2,
			slidesToScroll: 1,
			infinite: true,
		  }
		}
	  ,

		{
		  breakpoint: 800,
		  settings: {
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
		  }
		}
	  ]

	});


	$('.discover-quizs-bottom').slick({
		infinite: true,
		slidesToShow:4 ,
		slidesToScroll: 1,
		
		responsive: [
		  {
			breakpoint: 1300,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 1,
			  infinite: true,
			}
		  }
		,
  
		  {
			breakpoint: 800,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1,
			  infinite: true,
			}
		  }
		]
  
	  });
  

	


	$(".mobil-profil").click(function(e){
		e.preventDefault();
		$(".content-profil").addClass("open");
	});

	$(".profil-close").click(function(e){
		e.preventDefault();
		$(".content-profil").removeClass("open");
	});


	$('#demo-form').parsley();	


function answer(){
	document.querySelectorAll('.col-md-6').forEach((block) => {

		if (!(block.children[0] === e.target)) {
			block.children[0].style.background = "grey";
			block.children[0].style.boxShadow = "rgb(111, 103, 103) 2px 2px 2px 2px";
		}
		block.children[0].style.boxShadow = "rgb(111, 103, 103) 2px 2px 2px 2px";
		block.style.pointerEvents = "none";

	});
}
        


    
	

});
