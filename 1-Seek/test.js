// /* ecris une fonction qui renvoie un boolean et qui calcule s'il y a collision entre un cercle et un rectangle */
// function collideCircleRect(circleX, circleY, circleR, rectX, rectY, rectW, rectH) {
//   // Teste si le cercle est en dehors du rectangle
//   if (circleX > rectX + rectW) {
//     return false;
//   }
//   if (circleY > rectY + rectH) {
//     return false;
//   }
//   if (circleX < rectX) {
//     return false;
//   }
//   if (circleY < rectY) {
//     return false;
//   }

//   // Teste si le cercle est à l'intérieur du rectangle
//   let testX = circleX;
//   let testY = circleY;
//   if (circleX < rectX) {
//     testX = rectX;
//   } else if (circleX > rectX + rectW) {
//     testX = rectX + rectW;
//   }
//   if (circleY < rectY) {
//     testY = rectY;
//   } else if (circleY > rectY + rectH) {
//     testY = rectY + rectH;
//   }

//   // Teste si le cercle est en collision avec le rectangle
//   let d = dist(circleX, circleY, testX, testY);
//   if (d <= circleR) {
//     return true;
//   }
//   return false;
// }

// /* ecris une fonction qui renvoie un boolean et qui calcule s'il y a collision entre un cercle et un cercle */
// function collideCircleCircle(x1, y1, r1, x2, y2, r2) {
//   // Teste si le cercle est en collision avec l'autre cercle
//   let d = dist(x1, y1, x2, y2);
//   if (d <= r1 + r2) {
//     return true;
//   }
//   return false;
// }

// // Test unitaires de la fonction collideCircleRect
// function testCollideCircleRect() {
//   let result = collideCircleRect(250, 250, 20, 200, 200, 100, 100);
//   if (result === false) {
//     console.error("Test 1 failed");
//   }
//   result = collideCircleRect(250, 250, 20, 300, 300, 100, 100);
//   if (result === true) {
//     console.error

