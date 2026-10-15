import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId, filename = 'Resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    window.print();
    return;
  }

  try {
    // Clone or capture with high resolution scale
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 mm
    const pageHeight = 297; // A4 mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Embed clickable hyperlinks directly into PDF pages
    const elemRect = element.getBoundingClientRect();
    const links = element.querySelectorAll('a[href]');

    const scaleX = imgWidth / elemRect.width;
    const scaleY = imgHeight / elemRect.height;

    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:')) return;

      const rect = a.getBoundingClientRect();
      const xMm = (rect.left - elemRect.left) * scaleX;
      const yMm = (rect.top - elemRect.top) * scaleY;
      const wMm = rect.width * scaleX;
      const hMm = rect.height * scaleY;

      const pageIndex = Math.floor(yMm / pageHeight);
      const yOnPage = yMm - pageIndex * pageHeight;

      if (pageIndex + 1 <= pdf.getNumberOfPages()) {
        pdf.setPage(pageIndex + 1);
        pdf.link(xMm, yOnPage, Math.max(wMm, 4), Math.max(hMm, 3), { url: href });
      }
    });

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export error, falling back to print:', error);
    window.print();
  }
};
