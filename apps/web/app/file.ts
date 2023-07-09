export const downloadFile = (file: File) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  console.log(a.href);
  a.download = file.name;
  a.click();
};
