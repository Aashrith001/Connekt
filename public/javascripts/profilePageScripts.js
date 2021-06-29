$(document).ready(function () {
	$('.blogButton').click(function () {
		$('.blogs').css('display', 'block');
		$('.academics').css('display', 'none');
	});
	$('.academicsButton').click(function () {
		$('.academics').css('display', 'block');
		$('.blogs').css('display', 'none');
	});
	$('.usernameNav').addClass('active');
	$('.profileNav').addClass('active');
});