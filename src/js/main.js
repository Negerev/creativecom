// import jquery from"./modules/jquery-3.6.1.min";
// import jquery from"./modules/locomotive-scroll.min";
// import jquery from"./modules/gsap.min";
// import jquery from"./modules/ScrollTrigger.min";
// import { on } from "gulp";
import scrollVideo from "./modules/scrollVideo";



// window.addEventListener('DOMContentLoaded', function () {
$(window).on("load", function () {
  // $( document ).ready(function() {
// ——————————————————————————————————————————————————
// Noise effect
// ——————————————————————————————————————————————————

// if ($(window).width() > 1024) {
//   const canvas = document.createElement("canvas");
//   const sheet = document.getElementById('tv-css').sheet;
//   const ctx = canvas.getContext("2d");
//   let tileSize = 300;
  
//   canvas.width = tileSize;
//   canvas.height = tileSize;
//   let cssKeyFrames = [];
//   let frames = 5;
//   let array = ctx.createImageData(tileSize, tileSize);
  
//   for (let i = 0; i < frames; i++) {
//     for (let j = 0; j < array.data.length;) {
//       const c = (Math.random() * 2) * 125;
//       const alfa = (Math.random() * 2) * 15;
//       // console.log(c);
//       array.data[j++] = c;
//       array.data[j++] = c;
//       array.data[j++] = c;
//       array.data[j++] = alfa;
//     }
//     ctx.putImageData(array, 0, 0);
  
//     let img = canvas.toDataURL("image/png", 0.1);
//     cssKeyFrames.push((100 / (frames - 1) * i) +
//       '% { background: url(' + img + ') repeat top left/512px 512px; }'
//     );
//     $('.header').css('background', 'url(' + img + ') repeat top left/512px 512px')
//   }
  
//   let styles = '@keyframes tvShow { ' + cssKeyFrames.join('') + '}';
//   sheet.insertRule(styles, 1);
// }
  


  
  scrollVideo();
  let ellipse = document.querySelector(".ellipse-path");
  if (ellipse) {
    let ellipseLength = ellipse.getTotalLength();
    ellipse.style.strokeDasharray = ellipseLength;
    ellipse.style.strokeDashoffset = ellipseLength;
  }

  let locoScroll;
  if ($(window).width() > 1024) {
    locoScroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      multiplier: 0.8,
      smooth: true,
      scrollFromAnywhere: true,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });
    setTimeout(() => {
      locoScroll.update();
      ScrollTrigger.refresh();
      $( window ).resize();
      window.dispatchEvent(new Event('resize'));
      console.log("scroll update");
    }, 1000);
  }


  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      locoScroll.on("scroll", ScrollTrigger.update);
      // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
      ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
          return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed",
      });
    },
    "(max-width: 1024px)": function () {
      ScrollTrigger.config({
        ignoreMobileResize: true,
      });

      // ScrollTrigger.normalizeScroll(true);
      // ScrollTrigger.normalizeScroll({
      //   type: "touch,wheel,pointer", // now the page will be drag-scrollable on desktop because "pointer" is in the list
      //   momentum: self => Math.max(0.5, self.velocityY / 10) // dynamically control the duration of the momentum when flick-scrolling
      // });
    },
  });

  


  const tlShowreel = gsap.timeline({});

  tlShowreel
    .from(".showreel__logo", { scale: 0, opacity: 0 })
    .from(".showreel__ufo-img", { scale: 0, opacity: 0 })
    .from(".showreel__ufo-light", { opacity: 0, scaleX: 0 })
    .from(".showreel__open-video", { opacity: 0 }, "<")
    .from(".showreel__text", { opacity: 0, duration: 3 }, "<")
    .from(".word-animate", { y: 200, stagger: 0.15, duration: 1 }, "<")
    .from(".showreel__big-word", { autoAlpha: 0, duration: 1 }, "<")
    .from(".showreel__btn", { autoAlpha: 0, duration: 1, y: 200 }, "<")
    .fromTo(".ellipse-path", { strokeDashoffset: 1134, opacity: 0}, { strokeDashoffset: 0,  opacity: 1, duration: 1 }, "<50%");
      // .to(".showreel__ellipse", { autoAlpha: 0, duration: 1 }, "<");

  if ($(window).width() > 1024) {
    const tlShowreelScroll = gsap.timeline({
      scrollTrigger: {
        trigger: ".showreel__inner",
        start: "top 20%",
        pin: true,
        scrub: 2,
        end: "+=1000",
        onUpdate: (self) => {
          if (self.progress > 0) {
            $(".showreel__content").addClass("active");
          } else {
            $(".showreel__content").removeClass("active");
          }
        },
      },
    });
    tlShowreelScroll.from(".ellipse-path", { strokeDashoffset: 0 })
    .to(".showreel__ellipse", { opacity: 0}, "<")
    .to(".showreel__content", { y: 100 },"<")
    .to(".showreel__text", { y: -750 }, "<")
    .from(".showreel__text-2", { y: 550 }, "<")
    .to(".showreel__video", { bottom: "50%", height: "150%" }, "<");
  }

  gsap.to(".fixed-btn", {
    scrollTrigger: {
      trigger: ".fixed-btn",
      start: "bottom bottom",
      endTrigger: ".footer",
      end: "top bottom",
      toggleClass: "active",
      scrub: 2,
      pin: true,
      pinSpacing: false,
    },
    // opacity: 0,
  });

  gsap.to(".awwards", {
    scrollTrigger: {
      trigger: ".awwards",
      start: "center center",
      endTrigger: "body",
      end: "bottom bottom",
      toggleClass: "active",
      scrub: 2,
      pin: true,
      pinSpacing: false,
    },
    // opacity: 0,
  });

  const tlProjectsTop = gsap.timeline({
    scrollTrigger: {
      trigger: ".projects",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  tlProjectsTop.from(".projects__title", { y: 400 }).from(".projects__descr-line", { y: 400, stagger: 0.2, duration: 0.7 }).from(".projects__descr-line span", { y: 200, stagger: 0.2, rotation: 10, duration: 0.7 }, "<30%");

  if ($(window).width() > 1024) {
    const scrollProjects = gsap.timeline({
      scrollTrigger: {
        trigger: ".projects__top",
        start: "center 40%",
        endTrigger: ".projects",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      },
    });

    gsap.utils.toArray(".projects__item").forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "center center",
          scrub: 2,
          // markers: true,
        },
        y: 0,
        x: 0,
        rotation: 0,
      });
    });
  }

  gsap.utils.toArray(".about__text p, .about__subtitle, .about__btn").forEach((text, i) => {
    gsap.from(text, {
      scrollTrigger: {
        trigger: text,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 100,
    });
  });

  const tlTeam = gsap.timeline({
    scrollTrigger: {
      trigger: ".team__inner",
      start: "top 75%",
      scrub: 2,
    },
  });

  tlTeam.fromTo(".team__item", { y: 150 }, { y: -100 });

  const tlContact = gsap.timeline({
    scrollTrigger: {
      trigger: ".contact__inner",
      start: "top 80%",
      end: "center center",
      scrub: 5,
    },
  });

  tlContact.from(".contact__text span", { x: 100, duration: 2})
          //  .from(".contact__hand--human", { y: 100, x: -100, duration: 5 }, "<50%")
          //  .from(".contact__hand--alien", { y: -100, x: 100, duration: 5 }, "<")
           .to(".contact__star", { opacity: 1, scale: 1.5, duration: 1 }, "<50%")
           .from(".contact__border", { width: "0%", duration: 2 }, "<50%");

  // about page
  const aboutShow = gsap.timeline({});

  aboutShow.from(".about-top__ufo", { scale: 0, opacity: 0 }).from(".about-top__btn", { scale: 0, opacity: 0 }, "<");

 const tlAboutTeam = gsap.timeline({
  scrollTrigger: {
    trigger: ".expertize__team",
    start: "top bottom",
    end: "center center",
    scrub: 3,
  }
 })

 tlAboutTeam.from(".expertize__teammate--left", {x:-250, duration: 1})
            .from(".expertize__teammate--right", {x:250, duration: 1}, "<")
            .from(".expertize__teammate--center", {scale: 0.8, duration: 1}, "<");
  // about page end

  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
      // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
      ScrollTrigger.addEventListener("refresh", () => {
        locoScroll.update();
      });

      // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
      ScrollTrigger.refresh();
    },
  });

  $(".header__btn").on("click", function () {
    $(".menu").toggleClass("active");
    $(".header__burger").toggleClass("open");
    $(".menu").slideToggle({
      start: function () {
        if ($(this).is(":visible")) $(this).css("display", "flex");
      },
    });
    if (locoScroll) {
      let offsetTop = locoScroll.scroll.instance.scroll.y;
      $(".menu").css("top", offsetTop + "px");
      if ($(".menu").hasClass("active")) {
        locoScroll.stop();
      } else {
        locoScroll.start();
      }
    } else {
      let html = document.documentElement;
      if ($(".menu").hasClass("active")) {
        scrollPosition = window.pageYOffset;
        $("html").addClass("scroll-lock");
        html.style.top = -scrollPosition + "px";
      } else {
        $("html").removeClass("scroll-lock");
        window.scrollTo(0, scrollPosition);
        html.style.top = "";
      }
    }
  });

  let scrollPosition;
  $(".header__contact, .feedback__close, .about__btn, .menu__link--contacts, .contact__text, .open-contact").on("click", function () {
    $(".feedback").toggleClass("active");
    $(".feedback").slideToggle({
      start: function () {
        if ($(this).is(":visible")) $(this).css("display", "flex");
      },
    });
    if (locoScroll) {
      let offsetTop = locoScroll.scroll.instance.scroll.y;
      $(".feedback").css("top", offsetTop + "px");
      if ($(".feedback").hasClass("active")) {
        locoScroll.stop();
      } else {
        locoScroll.start();
      }
    } else {
      let html = document.documentElement;
      if ($(".feedback").hasClass("active")) {
        scrollPosition = window.pageYOffset;
        $("html").addClass("scroll-lock");
        html.style.top = -scrollPosition + "px";
      } else {
        $("html").removeClass("scroll-lock");
        window.scrollTo(0, scrollPosition);
        html.style.top = "";
      }
    }
  });

  $(".feedback__close").on("click", function () {
    if ($(".menu").hasClass("active")) {
      $(".menu").toggleClass("active");
      $(".header__burger").toggleClass("open");
      $(".menu").slideToggle({
        start: function () {
          if ($(this).is(":visible")) $(this).css("display", "flex");
        },
      });
    }
  });

  $(".showreel__open-video").on("click", function () {
    $(".popup").fadeIn();
    $(".popup__video").get(0).play();
    if (locoScroll) {
      let offsetTop = locoScroll.scroll.instance.scroll.y;
      $(".popup").css("top", offsetTop + "px");
      locoScroll.stop();
    } else {
      let html = document.documentElement;
      scrollPosition = window.pageYOffset;
      $("html").addClass("scroll-lock");
      html.style.top = -scrollPosition + "px";
    }
  });

  $(".popup__close").on("click", function () {
    $(".popup__video").trigger("pause");
    $(".popup").fadeOut();
    if (locoScroll) {
      let offsetTop = locoScroll.scroll.instance.scroll.y;
      $(".popup").css("top", offsetTop + "px");
      locoScroll.start();
    } else {
      let html = document.documentElement;

      $("html").removeClass("scroll-lock");
      window.scrollTo(0, scrollPosition);
      html.style.top = "";
    }
  });

  $(".menu-anchor").on("click", function () {
    $(".menu").toggleClass("active");
    $(".header__burger").toggleClass("open");
    $(".menu").slideToggle({
      start: function () {
        if ($(this).is(":visible")) $(this).css("display", "flex");
      },
    });
    if (locoScroll) {
      locoScroll.start();
    } else {
      $("html").removeClass("scroll-lock");
    }
  });

  $(".showreel__big-word").hover(
    function() {
      let src = $(this).attr("data-src");
      $(".showreel__video[data-id=" + src + "]").addClass("show");
      $(".showreel__text-2[data-id=" + src + "]").addClass("show");
    }, function() {
      let src = $(this).attr("data-src");
      $(".showreel__video[data-id=" + src + "]").removeClass("show");
      $(".showreel__text-2[data-id=" + src + "]").removeClass("show");
    }
   
  );

  $("#feedback__form").on("submit", function (e) {
    e.preventDefault();
    $.post("/mailer/mail.php", $("#feedback__form").serialize(), function () {
      console.log("send");
    })
      .done(function (data) {
        // при успешной отправке
        console.log(1);
        $("#feedback__form").fadeOut("slow"); // прячем форму
        $(".feedback__server-answer").html(data); // вставляем инфу с сервака
        $(".feedback__server-answer").fadeIn("slow"); // показывем инфу с сервака
      })
      .fail(function (data) {
        // при НЕ успешной отправке
        $("#feedback__form").fadeOut("slow"); // прячем форму
        $(".feedback__server-answer").html("Message could not be sent."); // вставляем инфу
        $(".feedback__server-answer").fadeIn("slow"); // показывем инфу
        console.log("fail");
        console.log(data);
      });
  });

  $(".contact__form").on("submit", function (e) {
    e.preventDefault();
    $.post("/mailer/mail.php", $(".contact__form").serialize(), function () {
      console.log("send");
    })
      .done(function (data) {
        // при успешной отправке
        $(".contact__form-inner").addClass('hidden'); // прячем форму
        $(".contact__server-answer").html(data); // вставляем инфу с сервака
        $(".contact__server-answer").fadeIn(); // показывем инфу с сервака
      })
      .fail(function (data) {
        // при НЕ успешной отправке
        $(".contact__form-inner").addClass('hidden'); // прячем форму
        $(".contact__server-answer").html("Message could not be sent."); // вставляем инфу
        $(".contact__server-answer").fadeIn(); // показывем инфу
        console.log("fail");
        console.log(data);
      });
  });

 
  let isSafari = navigator.vendor.match(/apple/i) && !navigator.userAgent.match(/crios/i) && !navigator.userAgent.match(/fxios/i) && !navigator.userAgent.match(/Opera|OPT\//);

  if (isSafari) {
    $(".transparent-video").each(function () {
      let src = $(this).attr("data-src");
      src = src.replace("webm", "mov");
      $(this).attr("src", src);
    });
  } else {
    $(".transparent-video").each(function () {
      let src = $(this).attr("data-src");
      $(this).attr("src", src);
    });
  }

  // change video end

  if ($('#particles-js').length > 0) {

    particlesJS("particles-js", {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#afafaf" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 3 } },
        opacity: { value: 0.7, random: true, anim: { enable: false, speed: 0.9, opacity_min: 0.1, sync: false } },
        size: { value: 3, random: true, anim: { enable: true, speed: 0, size_min: 0.03, sync: true } },
        line_linked: { enable: false, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 3, direction: "top", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: false, mode: "repulse" }, onclick: { enable: false, mode: "push" }, resize: true },
        modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } },
      },
      retina_detect: false,
    });
   
  }



  function controlVideo() {
    const watchButton = document.querySelector(".watch-button");
    const videoClip = document.querySelector(".watch-video");
    watchButton.addEventListener("click", function () {
      watchButton.style.display = "none";
      videoClip.play();
    });
    // videoClip.addEventListener('click', function() {
    //   watchButton.style.display = "block";
    // });
  }
  if ($('.watch-video').length > 0) {
    controlVideo();

  }

  // function showVideo() {
  //   const showVideo = document.querySelector('.show');
  //   showVideo.addEventListener('click', function() {
  //     showVideo.play();
  //   });
  // }
  // showVideo();




  
  
  
  console.log("ready");
});