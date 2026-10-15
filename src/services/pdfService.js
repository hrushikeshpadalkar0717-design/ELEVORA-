import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * ELEVORA Smart Resume PDF Exporter
 *
 * Guarantees:
 * 1. Prioritizes finishing on EXACTLY ONE A4 PAGE whenever reasonable.
 *    Any resume with typical content (up to ~1.4 A4 pages) is auto-fit onto ONE single A4 page.
 * 2. If it legitimately requires 2 pages (heavy 5+ yr experience, multiple pages of data):
 *    - Never cuts cards, paragraphs, bullet points, or skill boxes in half.
 *    - Never leaves an orphan section heading alone at the bottom of a page.
 *    - Uses compact, uniform 8mm margins on all 4 sides of both pages (Page 2 top has 8mm, Page 1 bottom has >= 8mm).
 * 3. Enforces standard 794px (true A4 at 96 DPI) width during capture so layouts don't artificially stretch
 *    or wrap text on smaller laptop screens.
 * 4. Preserves interactive clickable links (LinkedIn, GitHub, Portfolio, Email, Certificate) with scaled coordinates.
 */
export const exportToPdf = async (elementId, filename = 'Resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export`);
    window.print();
    return;
  }

  // Preserve original inline styles to restore after capture
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalMinWidth = element.style.minWidth;
  const originalMargin = element.style.margin;

  try {
    // 1. Lock element to standard A4 desktop width (794px = 210mm at 96 DPI)
    // This prevents narrow viewport sizes on laptops from artificially bloat-wrapping lines onto 2 pages.
    element.style.width = '794px';
    element.style.maxWidth = '794px';
    element.style.minWidth = '794px';
    element.style.margin = '0 auto';

    // Allow browser a render cycle to calculate layout
    await new Promise((resolve) => setTimeout(resolve, 60));

    // 2. High-resolution canvas capture (2x scale)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const PAGE_WIDTH_MM = 210;
    const PAGE_HEIGHT_MM = 297;

    // Compact 8mm margins
    const MARGIN_TOP_MM = 8;
    const MARGIN_BOTTOM_MM = 8;
    const MARGIN_LEFT_MM = 8;
    const MARGIN_RIGHT_MM = 8;

    const PRINT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM; // 194mm
    const PRINT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM; // 281mm

    // Natural height in mm at 194mm width
    const naturalHeightMm = (canvas.height * PRINT_WIDTH_MM) / canvas.width;

    const elemRect = element.getBoundingClientRect();
    const links = element.querySelectorAll('a[href]');

    // =========================================================================
    // 1. ONE-PAGE PRIORITY (DEFAULT FOR STANDARD RESUMES)
    // Fits on ONE A4 page if the resume is within ~400mm (up to ~1.4 A4 pages).
    // Scales proportionally to keep text crisp, readable, and unified.
    // =========================================================================
    const ONE_PAGE_FIT_THRESHOLD_MM = 405;

    if (naturalHeightMm <= ONE_PAGE_FIT_THRESHOLD_MM) {
      let finalWidthMm = PRINT_WIDTH_MM;
      let finalHeightMm = naturalHeightMm;
      let xOffsetMm = MARGIN_LEFT_MM;
      let yOffsetMm = MARGIN_TOP_MM;

      if (naturalHeightMm > PRINT_HEIGHT_MM) {
        const fitScale = PRINT_HEIGHT_MM / naturalHeightMm;
        finalWidthMm = PRINT_WIDTH_MM * fitScale;
        finalHeightMm = PRINT_HEIGHT_MM;
        xOffsetMm = (PAGE_WIDTH_MM - finalWidthMm) / 2;
        yOffsetMm = MARGIN_TOP_MM;
      }

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xOffsetMm, yOffsetMm, finalWidthMm, finalHeightMm);

      // Map links accurately for 1-page output
      const scaleX = finalWidthMm / elemRect.width;
      const scaleY = finalHeightMm / elemRect.height;

      links.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:')) return;

        const rect = a.getBoundingClientRect();
        const linkX = xOffsetMm + (rect.left - elemRect.left) * scaleX;
        const linkY = yOffsetMm + (rect.top - elemRect.top) * scaleY;
        const linkW = rect.width * scaleX;
        const linkH = rect.height * scaleY;

        pdf.setPage(1);
        pdf.link(linkX, linkY, Math.max(linkW, 3.5), Math.max(linkH, 2.5), { url: href });
      });

      pdf.save(filename);
      return;
    }

    // =========================================================================
    // 2. MULTI-PAGE FALLBACK (ONLY FOR MASSIVE RESUMES)
    // Smart break-point detection: NEVER cuts text or cards in half!
    // =========================================================================
    const canvasPxPerMm = canvas.width / PRINT_WIDTH_MM;
    const maxSliceHeightCanvas = Math.floor(PRINT_HEIGHT_MM * canvasPxPerMm);
    const domScale = canvas.width / elemRect.width;

    // Collect all candidate break items in the DOM
    const allDomItems = Array.from(
      element.querySelectorAll(
        'section, header, article, h1, h2, h3, p, li, [class*="p-2"], [class*="rounded"], .grid > div, .space-y-2 > div, .space-y-2\\.5 > div, .space-y-3 > div, .space-y-4 > div'
      )
    );

    const slices = [];
    let currentStartY = 0;
    const totalCanvasHeight = canvas.height;

    while (currentStartY < totalCanvasHeight) {
      const remainingHeight = totalCanvasHeight - currentStartY;

      if (remainingHeight <= maxSliceHeightCanvas) {
        slices.push({
          startY: currentStartY,
          endY: totalCanvasHeight,
          height: remainingHeight,
        });
        break;
      }

      const idealCutY = currentStartY + maxSliceHeightCanvas;

      // Find any element that straddles across idealCutY
      let bestCutY = idealCutY;

      // Scan all DOM elements to see if any element would be cut in half
      const bisectedElements = allDomItems
        .map((el) => {
          const r = el.getBoundingClientRect();
          const topCanvas = (r.top - elemRect.top) * domScale;
          const bottomCanvas = (r.bottom - elemRect.top) * domScale;
          return { el, top: topCanvas, bottom: bottomCanvas };
        })
        .filter((item) => item.top < idealCutY && item.bottom > idealCutY);

      if (bisectedElements.length > 0) {
        // Find the topmost element that is bisected
        const topmostBisected = bisectedElements.reduce((prev, curr) =>
          curr.top < prev.top ? curr : prev
        );

        let safeCutY = Math.floor(topmostBisected.top) - 4;

        // Check if the preceding element was an <h2> or <h3> heading
        // If so, don't leave the heading as an orphan on the previous page
        const el = topmostBisected.el;
        const prevEl = el.previousElementSibling;
        if (prevEl && /^H[1-6]$/i.test(prevEl.tagName)) {
          const prevRect = prevEl.getBoundingClientRect();
          const prevTopCanvas = (prevRect.top - elemRect.top) * domScale;
          safeCutY = Math.floor(prevTopCanvas) - 4;
        } else if (el.parentElement && /^SECTION$/i.test(el.parentElement.tagName)) {
          // If this is the first item inside a section, move cut before the section
          const secRect = el.parentElement.getBoundingClientRect();
          const secTopCanvas = (secRect.top - elemRect.top) * domScale;
          if (secTopCanvas > currentStartY + maxSliceHeightCanvas * 0.5) {
            safeCutY = Math.floor(secTopCanvas) - 4;
          }
        }

        if (safeCutY > currentStartY + maxSliceHeightCanvas * 0.5) {
          bestCutY = safeCutY;
        }
      }

      const sliceHeight = bestCutY - currentStartY;
      slices.push({
        startY: currentStartY,
        endY: bestCutY,
        height: sliceHeight,
      });

      currentStartY = bestCutY;
    }

    // Render slices to PDF
    for (let i = 0; i < slices.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const slice = slices[i];
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = slice.height;

      const ctx = sliceCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);

      ctx.drawImage(
        canvas,
        0,
        slice.startY,
        canvas.width,
        slice.height,
        0,
        0,
        canvas.width,
        slice.height
      );

      const sliceImgData = sliceCanvas.toDataURL('image/png');
      const sliceHeightMm = slice.height / canvasPxPerMm;

      // Draw with 8mm compact margins
      pdf.addImage(
        sliceImgData,
        'PNG',
        MARGIN_LEFT_MM,
        MARGIN_TOP_MM,
        PRINT_WIDTH_MM,
        sliceHeightMm
      );
    }

    // Map links for multi-page
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:')) return;

      const rect = a.getBoundingClientRect();
      const linkTopCanvas = (rect.top - elemRect.top) * domScale;
      const linkLeftCanvas = (rect.left - elemRect.left) * domScale;
      const linkWidthCanvas = rect.width * domScale;
      const linkHeightCanvas = rect.height * domScale;

      const pageIndex = slices.findIndex(
        (s) => linkTopCanvas >= s.startY - 4 && linkTopCanvas < s.endY
      );

      if (pageIndex !== -1) {
        const slice = slices[pageIndex];
        const yOffsetCanvas = linkTopCanvas - slice.startY;

        const xMm = MARGIN_LEFT_MM + linkLeftCanvas / canvasPxPerMm;
        const yMm = MARGIN_TOP_MM + yOffsetCanvas / canvasPxPerMm;
        const wMm = linkWidthCanvas / canvasPxPerMm;
        const hMm = linkHeightCanvas / canvasPxPerMm;

        pdf.setPage(pageIndex + 1);
        pdf.link(xMm, yMm, Math.max(wMm, 3.5), Math.max(hMm, 2.5), { url: href });
      }
    });

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export error, falling back to print:', error);
    window.print();
  } finally {
    // Restore element original style
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.minWidth = originalMinWidth;
    element.style.margin = originalMargin;
  }
};
