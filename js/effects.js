$(document).ready(function() {
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop(true, true).animate({
        scrollTop: target.offset().top - 60
      }, 500);
    }
  });

  $('.btn, .card').hover(
    function() {
      $(this).stop(true, true).animate({ marginTop: '-3px' }, 150);
    },
    function() {
      $(this).stop(true, true).animate({ marginTop: '0px' }, 150);
    }
  );

  $('.schedule-header').on('click', function() {
    const targetTable = $(this).nextAll('.table-responsive').first();
    targetTable.stop(true, true).slideToggle(300);
  });

  $('#trialForm').on('submit', function(e) {
    e.preventDefault();
    if (this.checkValidity()) {
      $(this).stop(true, true).fadeOut(300, function() {
        $('#successCard').stop(true, true).removeClass('d-none').hide().fadeIn(400);
      });
    }
  });

  $('#resetFormBtn').on('click', function() {
    $('#successCard').stop(true, true).fadeOut(300, function() {
      $('#trialForm').trigger('reset').stop(true, true).fadeIn(400);
    });
  });
});