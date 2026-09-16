document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  var slides = document.querySelectorAll('.hero-slider .slide');
  var dots = document.querySelectorAll('.slide-dots button');
  if (slides.length) {
    var current = 0;
    var timer;

    function showSlide(i) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 6000);
    }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { showSlide(i); startAuto(); });
    });

    var nextBtn = document.querySelector('.slide-arrow.next');
    var prevBtn = document.querySelector('.slide-arrow.prev');
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAuto(); });

    showSlide(0);
    startAuto();
  }

  var form = document.querySelector('form.enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      var status = document.querySelector('.form-status');
      if (!status) return;
      // Netlify Forms handles the actual submission via the form's
      // data-netlify attribute; this just gives the user feedback.
      setTimeout(function () {
        status.textContent = "Thanks — your enquiry has been sent. We'll be in touch soon.";
        status.className = 'form-status show ok';
        form.reset();
      }, 400);
    });
  }
});
