let fac = 1; //Debug

var pi = Math.PI;
var pi_2 = pi * 2;
var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;

var timer;
var runing = false;

var w = window.innerWidth;
var h = window.innerHeight;
var r = 100 * w / h;
var cx = w / 2;
var cy = h * 0.8 / 2;


var palatte = [
  "#FA5732",
  "#4BA370",
  "#E38614",
  "#8F182E",
  "#E6B515",
  "#83D3F2",
  "#D9B4DB"
]

window.onload = function () {
  $("#input").on('input', function () {
    if (!runing) {
      clearTimeout(timer);
      if ($("#input").val()) {
        runing = true;
        timer = setTimeout(Draw, 3000);
      }
    }
    if ($("#input").val().length < 1)
      clear();

  });

  var warn = $("#prewarn");
  var svg = $("#canvas");

  svg.width(w);
  svg.height(h * 0.8);
  $(".base").attr("cx", cx);
  $(".base").attr("cy", cy);

  var init = anime.timeline({
    easing: 'cubicBezier(.51, .01, .51, .99)',
  });

  init
    .add({
      targets: ".msg",
      duration: 2000 / fac,
      opacity: [0, 1]
    })
    .add({
      targets: "#prewarn",
      opacity: [1, 0],
      complete: function () {
        $("#prewarn").remove();
      }
    }, 3000 / fac)
    .add({
      targets: ".fa-bars",
      opacity: [0, 1],
      duration: 500
    })
    .add({
      targets: ".base",
      cx: cx,
      cy: cy,
      r: [0, r],
      duration: 1000,
      complete: Draw
    });
  //


}

function moveTo(x, y) {
  var sx = x.toString();
  var sy = y.toString();
  return " M" + sx + " " + sy;
}

function lineTo(x, y) {
  var sx = x.toString();
  var sy = y.toString();
  return " L" + sx + " " + sy;
}


function Draw() {
  var text = $("#input").val();
  var list = []
  clear();
  console.log("drawing");

  var move = anime.timeline({
    easing: 'cubicBezier(.51, .01, .51, .99)',
  });

  for (var i = 0; i < text.length; i++) {
    list[i] = text.charCodeAt(i) * i;
  }
  var d = moveTo(cx, cy + r);
  for (var i = 0; i < list.length; i++) {
    var num = list[i];
    var offset = 0;

    if (num % 7 == 0) {
      var tr = cir(num, i);
      if (i % 3 == 0) {
        move.add({
          targets: ".circle" + i.toString(),
          r: [0, tr],
          duration: 500
        });
      } else {
        move.add({
          targets: ".rect" + i.toString(),
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 500
        });
      }
    }
    if (num % 5 == 0) {
      var conc = conCir(num, i, list.length);
      move.add({
        targets: ".concir" + i.toString(),
        r: [0, conc.tr],
        cx: [cx, conc.pos.x],
        cy: [cy, conc.pos.y],
        duration: 500
      });
    }

    //      
    //    if (num % 5 == 0)
    //      
    //    if (num % 7 == 0)
    //      
    //    if (num % 9 == 0)
    //    else
    //    var offset = pi / list.length * i
    offset += i * 30;
    d += lineTo(cx + r * sin(offset),
      cy + r * cos(offset));
    //    console.log(list[i] / cx, list[i] / cy);
  }

  $(".lines").attr({
    d: d,
    stroke: platte[list.length % platte.length]
  });
  console.log(platte[platte.length]);
  move
    .add({
      targets: ".lines",
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 100 * list.length
    })
    .add({
      targets: "",
      complete: function () {
        runing = false;
      }
    });

  ;
}

function clear() {
  $("#canvas .circle").remove();
  $("#canvas .concir").remove();
  $("#canvas .rect").remove();
  $("#canvas .lines").attr({
    d: ""
  });

}




function conCir(num, i, n) {
  var c = document.createElementNS('http://www.w3.org/2000/svg', "circle");
  var tr = r * 0.2 * (Math.abs(cos(num)) + 0.5);
  var offset = pi_2 / n * i;
  var pos = {
    x: cx + r * sin(offset),
    y: cy + r * cos(offset)
  };

  $(c).addClass("concir");
  $(c).addClass("concir" + i.toString());
  $(c).attr({
    cx: pos.x,
    cy: pos.y,
    r: tr,
    stroke: platte[i % platte.length],
    "stroke-width": (i % 5) + 2,
    fill: "transparent"
  });

  $("#canvas").append(c);
  return {
    tr: tr,
    pos: pos
  }
}

function cir(num, i) {
  var tr = (r - 30 * w / h) - 20 * cos(num);
  if (i % 3 == 0) {
    var c = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    $(c).addClass("circle");
    $(c).addClass("circle" + i.toString());
    $(c).attr({
      cx: cx,
      cy: cy,
      r: tr,
      stroke: platte[i % platte.length],
      "stroke-width": (i % 5) + 2,
      fill: "transparent"
    });
    $("#canvas").append(c);

  } else {
    var p = document.createElementNS('http://www.w3.org/2000/svg', "path");
    var ang = num * i;
    $(p).addClass("rect");
    $(p).addClass("rect" + i.toString());
    $(p).attr({
      d: moveTo(cx, cy - tr) +
        lineTo(cx + tr, cy) +
        lineTo(cx, cy + tr) +
        lineTo(cx - tr, cy) +
        lineTo(cx, cy - tr),
      //      d: moveTo((cx) + sin(ang), (cy - tr) + cos(ang)) +
      //        lineTo((cx + tr) - sin(ang), (cy) + cos(ang)) +
      //        lineTo((cx) + sin(ang), (cy + tr) - cos(ang)) +
      //        lineTo((cx - tr) + sin(ang), (cy) - cos(ang)) +
      //        lineTo((cx) + sin(ang), (cy - tr) + cos(ang)),
      stroke: platte[i % platte.length],
      "stroke-width": 4,
      transform: "rotate(" + (i * num) + " " + cx + " " + cy + ")",
      fill: "transparent"
    });

    $("#canvas").append(p);
  }
  return tr;


  //  return lineTo(cx + r * sin(offset),
  //    cy + r * cos(offset));
}






function expand() {
  var menu = anime.timeline({
    easing: 'cubicBezier(.51, .01, .51, .99)',
  });
  if ($(".fa-bars").hasClass("closed")) {
    menu
      .add({
        targets: ".fa-bars",
        left: "18vw",
        rotate: 90,
        duration: 500
      })
      .add({
        targets: ".info",
        width: 0.2 * w,
        duration: 500
      }, "-=500");
    $(".fa-bars").removeClass("closed");
  } else {
    menu
      .add({
        targets: ".fa-bars",
        left: "2vw",
        rotate: 0,
        duration: 500
      })
      .add({
        targets: ".info",
        width: 0,
        duration: 500
      }, "-=500");

    $(".fa-bars").addClass("closed");

  }
}
