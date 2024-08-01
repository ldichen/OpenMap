/*
 * @Author: DiChen
 * @Date: 2024-07-23 11:36:10
 * @LastEditors: DiChen
 * @LastEditTime: 2024-08-01 11:00:53
 */
declare function createImageBitmap(
  image: HTMLCanvasElement
): Promise<ImageBitmap>;

export async function modifyImageBitmap(
  imgBitmap: ImageBitmap,
  changeColor: any
): Promise<ImageBitmap> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法获取 2D 上下文");
  canvas.width = imgBitmap.width;
  canvas.height = imgBitmap.height;
  const ifFunctions = generateIfFunctions(changeColor);
  ctx.drawImage(imgBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    ifFunctions.some((fn) => fn(imageData, i));
    // // 只要有一个函数返回 true 就跳出循环
    // if () {
    //   continue;
    // }
  }

  ctx.putImageData(imageData, 0, 0);
  return createImageBitmap(canvas);
}
// 生成if语句的函数
function generateIfFunctions(changeColor) {
  const functions = [];
  for (let i = 0; i < changeColor.RGBA.length; i++) {
    functions.push(function (imageData, index) {
      try {
        if (
          changeColor.RGBA[i].R[0] <= imageData.data[index] &&
          imageData.data[index] <= changeColor.RGBA[i].R[1] &&
          changeColor.RGBA[i].G[0] <= imageData.data[index + 1] &&
          imageData.data[index + 1] <= changeColor.RGBA[i].G[1] &&
          changeColor.RGBA[i].B[0] <= imageData.data[index + 2] &&
          imageData.data[index + 2] <= changeColor.RGBA[i].B[1]
        ) {
          imageData.data[index] = changeColor.RGBA[i].NEW[0];
          imageData.data[index + 1] = changeColor.RGBA[i].NEW[1];
          imageData.data[index + 2] = changeColor.RGBA[i].NEW[2];
          if (changeColor.RGBA[i].NEW.length == 4) {
            imageData.data[index + 3] = changeColor.RGBA[i].NEW[3];
          }
          return true; // 颜色已修改，返回 true
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  if (changeColor.Grey != undefined) {
    functions.push(function (imageData, index) {
      try {
        if (
          imageData.data[index] === imageData.data[index + 1] &&
          imageData.data[index + 1] === imageData.data[index + 2] &&
          changeColor.Grey.G[0] <= imageData.data[index] &&
          imageData.data[index] <= changeColor.Grey.G[1]
        ) {
          imageData.data[index] = changeColor.Grey.NEw;
          imageData.data[index + 1] = changeColor.Grey.NEw;
          imageData.data[index + 2] = changeColor.Grey.NEw;
          return true;
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  if (changeColor.other != undefined) {
    functions.push(function (imageData, index) {
      try {
        imageData.data[index] = changeColor.other[0];
        imageData.data[index + 1] = changeColor.other[1];
        imageData.data[index + 2] = changeColor.other[2];
        if (changeColor.other.length == 4) {
          imageData.data[index + 3] = changeColor.other[3];
        }
        return true;
      } catch (e) {
        console.log(e);
      }
    });
  }
  if (changeColor.add != undefined) {
    functions.push(function (imageData, index) {
      try {
        imageData.data[index] = imageData.data[index] + changeColor.add[0];
        imageData.data[index + 1] =
          imageData.data[index + 1] + changeColor.add[1];
        imageData.data[index + 2] =
          imageData.data[index + 2] + changeColor.add[2];
        if (changeColor.add.length == 4) {
          imageData.data[index + 3] = changeColor.add[3];
        }
        return true;
      } catch (e) {
        console.log(e);
      }
    });
  }
  return functions;
}
