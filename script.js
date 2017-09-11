$(document).ready(function() {
  //Smooth Scrolling function
  //Help from: css-tricks.com/snippets/jquery/smooth-scrolling/
  // Select all links with hashes
  $('a[href*="#"]') //select all links with hashes
    .not('[href="#"]').not('[href="#0"]') // Remove links that don't do anything
    .click(function(event) {
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
        && location.hostname == this.hostname ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          event.preventDefault();//Only prevent default if animation is happening
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() { //Callback after animation... Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); //Adding tabindex for elements not focusable
              $target.focus(); //Set focus again
            };
          });
        }
      }
    });

    //set all <hr> to dark-blue
    $("hr").each(function(){$(this).css("border-color","#214555")});

    //horizontall flip cards on hover
    $(".cardx").each(function(){
      $(this).flip({
        axis: 'y',
        trigger: 'hover',
        reverse: $(this).attr('class').split(" ")[1] === 'UChi' ? true : false
      });
    });

    //vertically flip cards on hover
    $(".cardy").each(function(){
      $(this).flip({
        axis: 'x',
        trigger: 'hover',
        reverse: true
      });
    });

    //toggle link colors
    $("a").hover(
      function(){
        var link = $(this)["0"].hash;
        if (link === "#biolink" ||
            link === '#experiencelink' ||
            link === "#projectslink" ||
            link === '#contactlink') {
          $(this).css('color', '#214555');
        } else {
          $(this).css('color', '#EC5C7D');
        }
      }, function() {
        var link = $(this)["0"].hash;
        if (link === "#biolink" ||
            link === '#experiencelink' ||
            link === "#projectslink" ||
            link === '#contactlink') {
          $(this).css('color', '#C7D7D4');
        } else {
          $(this).css('color', '#214555');
        }
      }
    );

    //animate all headers
    $("h1").hover(
      function(){
        $(this).addClass("animated jello");
      }, function(){
        $(this).removeClass("animated jello");
      }
    );

    $("dev").hover(
      function(){
        console.log("hi");
      }
    );


    //toggle pic size
    $('.alex-pic').hover(function() {
      $(this).animate({width: "65%", height: "65%"}, 'fast');
    }, function(){
      $(this).animate({width: "60%", height: "60%"}, 'fast');
    });


});
