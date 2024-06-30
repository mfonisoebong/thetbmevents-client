export const downloadCSVFile = (csvText: string, fileName: string) => {
  // Create a Blob object from the CSV string.
  const csvBlob = new Blob([csvText], { type: "text/csv" });

  // Create a hidden anchor element to download the CSV file.
  const downloadLink = document.createElement("a");
  downloadLink.href = window.URL.createObjectURL(csvBlob);
  downloadLink.download = fileName;
  downloadLink.style.display = "none";

  // Append the anchor element to the body of the document.
  document.body.appendChild(downloadLink);

  // Click the anchor element to download the CSV file.
  downloadLink.click();

  // Remove the anchor element from the body of the document.
  document.body.removeChild(downloadLink);
};
