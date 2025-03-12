
if (typeof jsPDF === "undefined") {
   
    let jspdfScript = document.createElement("script");

    jspdfScript.onload = function () {
      
        generatePDF();
    };

    jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';
    document.body.appendChild(jspdfScript);
} else {
   
    generatePDF();
}

function generatePDF() {
    let pdf = new jsPDF();
    let elements = document.getElementsByTagName("img");
    
    let pdfWidth = pdf.internal.pageSize.getWidth();
    let pdfHeight = pdf.internal.pageSize.getHeight();

    let imageCount = 0;

    Array.from(elements).forEach((img, index) => {
        if (!/^blob:/.test(img.src)) {
            console.log("Invalid source, skipping...");
            return;
        }

        // Create a canvas to render the image
        let can = document.createElement("canvas");
        let con = can.getContext("2d");
        can.width = img.width;
        can.height = img.height;
        con.drawImage(img, 0, 0, img.width, img.height);

        
        let imgData = can.toDataURL("image/jpeg", 0.7); /

        let imgHeight = (img.height / img.width) * pdfWidth; 

        if (index > 0) {
            pdf.addPage(); 
        }
        

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);

        
        imageCount++;
        if (imageCount >= 300) {
            
            pdf.save("download.pdf");
            pdf = new jsPDF(); 
            imageCount = 0; 
        }
    });

    
    if (imageCount > 0) {
        pdf.save("download.pdf");
    }
}
///

let trustedURL;


if (!trustedURL) {
  if (window.trustedTypes && trustedTypes.createPolicy) {
    const policy = trustedTypes.createPolicy('myPolicy', {
      createScriptURL: (input) => {
        return input;
      }
    });
    trustedURL = policy.createScriptURL('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js');
  } else {
    trustedURL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js';
  }
}


if (!window.jspdf) {
  
  let jspdfScript = document.createElement("script");
  jspdfScript.onload = function() {
    // Generate a PDF from images with "blob:" sources
    let pdf = new jsPDF();
    let elements = document.getElementsByTagName("img");
    let pageHeight = pdf.internal.pageSize.height;
    let pageWidth = pdf.internal.pageSize.width;

    for (let i = 0; i < elements.length; i++) {
      let img = elements[i];
      if (!/^blob:/.test(img.src)) {
        continue;
      }
      let canvasElement = document.createElement('canvas');
      let con = canvasElement.getContext("2d");
      canvasElement.width = img.width;
      canvasElement.height = img.height;
      con.drawImage(img, 0, 0, img.width, img.height);

      let imgData = canvasElement.toDataURL("image/jpeg", 1.0);
      let imgWidth = pageWidth;
      let imgHeight = (img.height * pageWidth) / img.width;

      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = (img.width * pageHeight) / img.height;
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      if (i !== elements.length - 1) {
        pdf.addPage();
      }
    }

    // Download the generated PDF
    pdf.save("download.pdf");
  };

  jspdfScript.src = trustedURL;
  document.body.appendChild(jspdfScript);
} else {
  console.log("jsPDF is already loaded.");
}
