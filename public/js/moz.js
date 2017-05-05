var camButton = $('.fa.fa-camera');
var toggle = $('.toggle .fa');
var takeSnap = $('.takesnap');
var retryButton = $('.retry');
var canvas = document.querySelector('canvas');
var video = document.querySelector('video');
var context = canvas.getContext('2d');
var defaultImageSrc = '/logos/shape.png';
var snapShot = false;
var localStream = false;

var constraints = {
  audio: false,
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 480
    }
  }
};

takeSnap.on('click', function() {
  snapShot = true;

  $.ajax({
    url: '/savecanvas',
    method: 'POST',
    dataType: 'json',
    data: { canvas: canvas.toDataURL('image/png') },
    dataType: 'html',
    success: function(result) {
      result = JSON.parse(result);
      alert('Picture has been generated!');
      $('.snapshots-container').prepend(
        '<a target="_blank" href="' +
          '/result#' +
          result.hash +
          '"><img src="/img/generated/pic/' +
          result.hash +
          '.png"></a>'
      );
    }
  });
});

retryButton.on('click', function() {
  snapShot = false;
  startVideo();
});

//Toggle the footer menu
toggle.on('click', function() {
  var $this = $(this).parents('.slideshow');
  if ($this.hasClass('open')) {
    $this.removeClass('open');
  } else {
    $this.addClass('open');
    $('html, body').animate({ scrollTop: $(document).height() }, 500);
  }
});

function handleSuccess(stream) {
  camButton.hide();
  video.src = window.URL.createObjectURL(stream);
  localStream = stream;
  canvas.width = 640;
  canvas.height = 480;
}
var defaultImageElement = new Image();
defaultImageElement.src = defaultImageSrc;

function takeAPicture(picture) {
  context.drawImage(picture, 0, 0);
  context.drawImage(defaultImageElement, 0, 0, 640, 480);
  //context.drawImage(baseEveImg, 502, 352, 128, 128);
}

function playVideoOnCanvas() {
  var picture = this; //cache
  (function loop() {
    if (!picture.paused && !picture.ended) {
      if (snapShot === false) {
        takeAPicture(picture);
        setTimeout(loop, 1000 / 10);
      } else {
        video.pause();
        video.src = '';
        localStream.getTracks()[0].stop();
      }
    }
  })();
}

video.addEventListener('play', playVideoOnCanvas);
function handleError() {}

function startVideo() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);
  } else {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    navigator.getUserMedia({ video: true }, handleSuccess, handleError);
  }
}

camButton.on('click', startVideo);

//var mozimage = $('.slide.mozimage');
//var firstMozImg = $('.slide.mozimage .holder .img').eq(0);
//
// $('.slide .left, .slide .right').on('click', function() {
//   var mozImage = !!$(this).parents('.slide.mozimage').length;
//   var $this = $(this);
//   var dir = 'left';
//   if ($this.hasClass('right')) {
//     dir = 'right';
//   }
//   var images = $this.parents('.slide').find('.holder .img');
//   var mover = $this.parents('.slide').find('.mover');
//   var index = images.filter('.on').index();
//   var total = images.length;
//
//   if (dir === 'left') {
//     newIndex = index - 1;
//   } else {
//     newIndex = index + 1;
//   }
//
//   if (newIndex >= 0 && newIndex < total) {
//     images.eq(index).removeClass('on');
//     var size = 75;
//     if (newIndex > 0) {
//       size = size - newIndex * 150;
//     }
//     mover.css('margin-left', size + 'px');
//     var newImage = images.eq(newIndex);
//     newImage.addClass('on');
//
//     if (mozImage) {
//       defaultImageElement = new Image();
//       defaultImageElement.src = newImage.attr('data-img');
//     } else {
//       baseEveImg = new Image();
//       baseEveImg.src = newImage.attr('data-img');
//     }
//   }
// });
