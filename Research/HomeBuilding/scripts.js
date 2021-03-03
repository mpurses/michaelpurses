function switchStyle() {
	if (document.getElementById('styleSwitch').checked) {
		document.getElementById('gallery').classList.add("custom");
		document.getElementById('exampleModal').classList.add("custom");
	} else {
		document.getElementById('gallery').classList.remove("custom");
		document.getElementById('exampleModal').classList.remove("custom");
	}
}

//autoPlayYouTubeModal();

////FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
//function autoPlayYouTubeModal() {
//	var trigger = $("body").find('[data-bs-toggle="modal"]');
//	trigger.click(function () {
//		var theModal = $(this).data("target"),
//			videoSRC = $(this).attr("data-theVideo"),
//			videoSRCauto = videoSRC + "?autoplay=1";
//		$(theModal + ' iframe').attr('src', videoSRCauto);
//		$(theModal + ' button.close').click(function () {
//			$(theModal + ' iframe').attr('src', videoSRC);
//		});
//	});
//}