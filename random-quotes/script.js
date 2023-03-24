var colours = new Array(
  [255, 153, 200],
  [252, 246, 189],
  [208, 244, 222],
  [169, 222, 249],
  [228, 193, 249]
);

var step = 0;
//colour table indices for:
// current colour top
// next colour top
// current colour bottom
// next colour bottom
var colourIndices = [0, 1, 2, 3];

//transition speed
var gradientSpeed = 0.024;

function updateGradient() {
  if ($ === undefined) return;

  var c0_0 = colours[colourIndices[0]];
  var c0_1 = colours[colourIndices[1]];
  var c1_0 = colours[colourIndices[2]];
  var c1_1 = colours[colourIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var colour1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var colour2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  $("#quote-box-container").css({
    background: `linear-gradient(165deg, ${colour1} 0%, ${colour2} 100%)`,
  });

  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colourIndices[0] = colourIndices[1];
    colourIndices[2] = colourIndices[3];

    // pick two new target colour indices
    // do not pick the same as the current one
    colourIndices[1] =
      (colourIndices[1] +
        Math.floor(1 + Math.random() * (colours.length - 1))) %
      colours.length;
    colourIndices[3] =
      (colourIndices[3] +
        Math.floor(1 + Math.random() * (colours.length - 1))) %
      colours.length;
  }
}

$(document).ready(function () {
  function getQuote() {
    $.get("https://api.quotable.io/random", function (data) {
      animateBackground();
      $("#text, #author").animate({ opacity: 0 }, 500, function () {
        $(this).animate({ opacity: 1 }, 500);
        $("#text").html(data.content);
        $("#author").html(`- ${data.author}`);
        setTwitterLink(data);
      });
    });
  }
  function setTwitterLink(quoteData) {
    $("#tweet-quote")
      .attr(
        "href",
        `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text="${quoteData.content}" ${quoteData.author}`
      )
      .attr("target", "_blank")
      .css("visibility", "visible");
    $("#tweet-quote-button").css("visibility", "visible");
  }

  let animateBackgroundTimeoutId;
  let animateBackgroundIntervalId;
  function animateBackground() {
    clearInterval(animateBackgroundIntervalId);
    clearTimeout(animateBackgroundTimeoutId);
    animateBackgroundIntervalId = setInterval(updateGradient, 10);
    animateBackgroundTimeoutId = setTimeout(function () {
      clearInterval(animateBackgroundIntervalId);
    }, 0.5 * 1000);
  }

  getQuote();
  $("#new-quote").click(getQuote);
});
