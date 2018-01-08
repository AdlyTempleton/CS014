export function utilAlert() {
  document.write("this is a util function<br/>");
}

export function utilLogHelloWorld() {
  console.log("Hello Console")
}

export function init2DArray(x=1,y=1,initVal='') {
  var a = [];
  for (var xdim=0; xdim < x; xdim++) {
    a.push([]);
    for (var ydim=0; ydim < y; ydim++) {
      a[xdim].push(initVal);
    }
  }
  return a;
}
