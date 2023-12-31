import { encodeToDataArrForQr, fileToUint8Arr } from "./encoder";
import testImg from "../asset/testImg.png";

export const testQrData = encodeToDataArrForQr({
  type: "text",
  qrVersion: 25,
  errorCorrectionLevel: "L",
  content: `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus ultricies ante, quis congue lorem lacinia vitae. Ut arcu augue, imperdiet nec erat vitae, porttitor sodales quam. Suspendisse convallis lectus et nunc ultrices faucibus. Suspendisse ultrices vitae lacus vel tristique. Quisque a justo ex. Proin sit amet semper turpis. Pellentesque tempus malesuada laoreet. Vestibulum tristique, urna ut maximus laoreet, tellus ligula porta sem, at pulvinar lacus mi et nisl. Aenean vel ante auctor, scelerisque risus ac, dapibus ex. Pellentesque aliquet ultricies orci, vel hendrerit enim faucibus nec. Aenean porta mauris vitae augue fringilla, id pellentesque nisi iaculis. Cras mi elit, vehicula vel mollis sed, tincidunt eget est. Ut ac bibendum nunc. Sed porttitor arcu id vestibulum ultricies. Nulla sed varius mi. Aliquam pulvinar ac tellus sed mollis.

  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce non dui auctor dui imperdiet dictum ac eget metus. Curabitur quis risus mattis, vehicula risus quis, interdum ligula. Praesent sagittis mauris tellus, in gravida nulla dictum nec. Proin ut gravida diam, vel tristique ligula. Sed vel sapien sit amet velit pulvinar elementum. Mauris odio urna, ultrices ut sodales congue, suscipit eget est. Donec maximus lacus sed odio eleifend congue. Proin a felis id purus condimentum pellentesque. Sed sagittis porta est et facilisis. Etiam non accumsan augue.
  
  Sed eu tincidunt est. In vel lectus mattis enim vestibulum maximus vitae faucibus augue. Morbi at mattis est. Sed ornare, ante vitae tempor dignissim, nunc est dictum lacus, non varius lacus ipsum nec lacus. Etiam rutrum tincidunt mauris sit amet bibendum. Suspendisse tristique, tortor sed maximus luctus, est ipsum interdum elit, eget tristique massa metus eu ante. Sed tincidunt tellus a leo ultricies, at luctus felis posuere. Proin vel efficitur odio. Vestibulum sollicitudin mi vulputate egestas maximus. In eget tempor elit. Pellentesque vehicula rhoncus magna, eget ultrices leo lobortis ut. Ut dictum rhoncus felis, ac gravida justo.
  
  Mauris finibus maximus lectus, commodo pretium sapien pellentesque sit amet. Aenean porta dolor justo, quis pulvinar odio convallis non. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur posuere orci eleifend arcu malesuada, ac laoreet enim porttitor. Etiam nec interdum felis. Praesent sodales ac lacus quis aliquet. In venenatis in orci in feugiat.
  
  Donec placerat, ipsum id mollis porttitor, mi diam posuere arcu, quis elementum mauris purus vel libero. Nam mollis bibendum congue. Morbi at pretium eros. Pellentesque fermentum nisl vel nisl tempus, volutpat malesuada risus varius. Donec sodales nulla eget consectetur viverra. Nunc in mauris quis dolor pellentesque sagittis. Duis nulla turpis, ornare et tempus in, vestibulum non ligula. Integer eu enim fermentum, tempus mi vel, egestas orci.
  
  Nunc sed cursus quam. Nulla metus purus, consequat ac venenatis in, finibus non eros. Aenean egestas nisi urna. Donec vehicula, metus ut ullamcorper tincidunt, lacus urna pellentesque tortor, nec mattis nisl lacus vel est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut tellus ac justo feugiat ullamcorper. Duis ut ligula ut eros maximus porttitor. Aenean vitae nibh vitae nibh pharetra interdum. Morbi congue pulvinar sollicitudin. Pellentesque efficitur convallis tortor sed ultricies. Vestibulum maximus metus a risus euismod, eget fermentum quam rhoncus. Maecenas in tristique felis. Cras at imperdiet ex. Aliquam commodo lacus nec congue sodales. Aliquam sit amet placerat libero.
  
  Donec convallis dui nibh, et varius orci dapibus a. Praesent sed blandit neque, eget euismod lacus. Nulla tempus odio ut justo porttitor pharetra. Etiam sed orci et erat facilisis posuere. Vestibulum imperdiet fringilla turpis, vel ornare odio fringilla nec. Proin accumsan mi laoreet tellus aliquet, quis ullamcorper lectus tristique. Morbi ultrices, urna sit amet tincidunt feugiat, dolor arcu convallis sem, vitae fermentum nulla augue a odio. Nulla facilisi. Nulla ac metus a arcu cursus bibendum ac et lacus. Donec vitae mauris ut ante cursus pharetra. Donec maximus, turpis eget mollis dignissim, massa odio maximus nunc, vitae maximus odio ipsum ac diam. Sed finibus, purus vitae viverra dictum, sapien nibh porta elit, non porttitor nibh arcu eget leo. Duis a dictum turpis.
  
  Nunc pretium felis eget lacinia dignissim. Duis facilisis, massa vel placerat efficitur, massa turpis pretium libero, lacinia aliquam dolor ligula at orci. Curabitur auctor nisi a velit bibendum finibus. Aenean egestas ligula augue, non volutpat est rutrum id. Proin sit amet magna ac nunc pulvinar convallis quis pulvinar dolor. Maecenas et mattis risus. Phasellus metus sapien, maximus et suscipit at, ultricies ut quam. Praesent ac arcu eget felis bibendum feugiat consectetur id nisl.
  
  `,
});

// test image
const getFileFromUrl = async (url, name, defaultType = "image/png") => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
};

export const getTestImgData = async (): Promise<Uint8Array> => {
  const aa = await getFileFromUrl(testImg.src, "test.png");
  return fileToUint8Arr(aa);
};
