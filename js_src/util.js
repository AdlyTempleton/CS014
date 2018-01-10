export function utilAlert() {
  document.write("this is a util function<br/>");
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

let randStringCharSource = 'abcdefghijklmnopqrstuvqxyz1234567890'.split('');

export function randomString(len = 8) {
  var res='';
    for (var i=0; i<len; i++) {
        res += randStringCharSource.random();
    }
    return res;
}
