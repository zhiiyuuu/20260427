// Hand Pose Detection with ml5.js
// 專案：淡藍色背景、大字體姓名學號與置中攝影機影像

let video;
let handPose;
let hands = [];

function preload() {
  // 初始化手勢偵測模型
  handPose = ml5.handPose({ flipped: true });
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化攝影機
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 開始偵測手部
  handPose.detectStart(video, gotHands);
  
  // 設定字體屬性：簡單、直接、粗體
  textFont('sans-serif'); 
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  // 1. 設定背景為淡藍色
  background('#add8e6');

  // 2. 計算影像縮放與置中位置 (寬高為螢幕 50%)
  let displayW = windowWidth * 0.5;
  let displayH = windowHeight * 0.5;
  
  let xOffset = (windowWidth - displayW) / 2;
  let yOffset = (windowHeight - displayH) / 2;

  // 3. 顯示「41273oo78 林oo」
  fill(255); // 改回純白色，最顯眼
  textSize(60); // 直接給它一個大大的 60 像素！
  stroke(0, 50); // 加一點點淡淡的陰影框，讓字更跳出來
  strokeWeight(4);
  
  // 位置：放在鏡頭上方，距離鏡頭邊緣稍微近一點點
  let textY = yOffset * 0.6; 
  text("41273oo78 林oo", windowWidth / 2, textY);

  // 4. 繪製攝影機畫面
  push();
  translate(xOffset, yOffset);
  
  // 畫出主畫面影像
  noStroke(); // 影像不需要邊框
  image(video, 0, 0, displayW, displayH);

  // 5. 繪製手部偵測點
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 將座標映射到縮放後的影像上
          let mappedX = (keypoint.x / video.width) * displayW;
          let mappedY = (keypoint.y / video.height) * displayH;

          // 區分左右手顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // 左手：紫色
          } else {
            fill(255, 255, 0); // 右手：黃色
          }

          noStroke();
          circle(mappedX, mappedY, 12); // 圓點稍微加回原本的大小
        }
      }
    }
  }
  pop();
}

// 視窗縮放時自動調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}