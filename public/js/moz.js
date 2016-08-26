var cam = $('.fa-camera');
var toggle = $('.toggle .fa');
var takeSnap = $('.takesnap');
var canvas = document.querySelector('canvas');
var video = document.querySelector('video');
var context = canvas.getContext('2d');
var mozImage = $('.slide.mozimage .mover .img.on').attr('data-img');
var eveImage = $('.slide.eveimg .mover .img.on').attr('data-img');
var snapShot = false;

var constraints = {
  audio: false,
  video: {mandatory: {
    maxWidth: 640,
    maxHeight: 480
  }}
};

takeSnap.on('click', function() {
  snapShot = true;

  $.ajax({
    url: '/savecanvas',
    method: "POST",
    dataType: "json",
    data: { canvas : canvas.toDataURL("image/png") },
    dataType: "html",
    success: function(result) {
      result = JSON.parse(result);
      $('.snap').attr('href', '/result#' + result.hash);
      snapShot = false;
      cam.on('click');
    }
  });
});

toggle.on('click', function() {
  var $this = $(this).parents('.slideshow');
  if($this.hasClass('open')) {
    $this.removeClass('open');
  }
  else {
    $this.addClass('open');
    $('html, body').animate({ scrollTop: $(document).height() }, 500);
  }
})

function handleSuccess(stream) {
  cam.hide();
  video.src = window.URL.createObjectURL(stream);
  canvas.width = 640;
  canvas.height = 480
}
baseMozImg = new Image();
baseMozImg.src = mozImage;

// baseEveImg = new Image();
// baseEveImg.src = eveImage;

function make_base() {
  context.drawImage(baseMozImg, 0, 0, 640, 480);
  //context.drawImage(baseEveImg, 502, 352, 128, 128);
}


function playy() {
  var $this = this; //cache
  (function loop() {
      if (!$this.paused && !$this.ended) {
          if(snapShot === false) {
            context.drawImage($this, 0, 0);
            make_base();
            setTimeout(loop, 1000 / 10); // drawing at 30fps
          }
      }
  })();
}

video.addEventListener('play', playy);
function handleError() {

}

cam.on('click', function() {
  if(navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
	}
	else {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia({video:true}, handleSuccess, handleError);
	}
});

var mozimage = $('.slide.mozimage');
var firstMozImg = $('.slide.mozimage .holder .img').eq(0);

$('.slide .left, .slide .right').on('click', function() {
  var mozImage = !!$(this).parents('.slide.mozimage').length;
  var $this = $(this);
  var dir = 'left';
  if($this.hasClass('right')) {
    dir = 'right';
  }
  var images = $this.parents('.slide').find('.holder .img');
  var mover = $this.parents('.slide').find('.mover');
  var index = images.filter('.on').index();
  var total = images.length;

  if(dir === 'left') {
    newIndex = index - 1;
  }
  else {
    newIndex = index + 1;
  }

  if(newIndex >= 0 && newIndex < total) {
    images.eq(index).removeClass('on');
    var size = 75;
    if(newIndex > 0) {
      size = size - (newIndex * 150);
    }
    mover.css('margin-left', size + 'px');
    var newImage = images.eq(newIndex);
    newImage.addClass('on');

    if(mozImage) {
      baseMozImg = new Image();
      baseMozImg.src = newImage.attr('data-img');
    }
    else {
      baseEveImg = new Image();
      baseEveImg.src = newImage.attr('data-img');
    }
  }
});
