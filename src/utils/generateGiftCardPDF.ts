import { jsPDF } from 'jspdf';
import { GeneratedGiftCard } from '../types';

/**
 * Generates an elegant, high-end, A5 landscape PDF for an Aquabeauté Gift Card.
 * This function also returns the PDF as a base64 Data URL so it can be temporarily stored, 
 * pre-viewed, or downloaded by the customer.
 */
export function generateGiftCardPDF(giftCard: GeneratedGiftCard): jsPDF {
  // A5 size in Landscape is 210mm x 148mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5'
  });

  const width = 210;
  const height = 148;

  // 1. Background (Cream / Warm Off-White #fefaf6)
  doc.setFillColor(254, 250, 246);
  doc.rect(0, 0, width, height, 'F');

  // 2. Double Border Frame
  // Outer Border in soft blush pink (#e8c3b9)
  doc.setDrawColor(232, 195, 185);
  doc.setLineWidth(1.5);
  doc.rect(6, 6, width - 12, height - 12);

  // Inner Border in elegant gold sand (#c89d7c)
  doc.setDrawColor(200, 157, 124);
  doc.setLineWidth(0.4);
  doc.rect(9, 9, width - 18, height - 18);

  // Decorative corner flourishes
  const flourishDist = 12;
  doc.line(9, flourishDist, flourishDist, 9);
  doc.line(width - 9, flourishDist, width - flourishDist, 9);
  doc.line(9, height - flourishDist, flourishDist, height - 9);
  doc.line(width - 9, height - flourishDist, width - flourishDist, height - 9);

  // 3. Header Branding
  // "AQUABEAUTÉ"
  doc.setTextColor(30, 25, 24); // Deep charcoal
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text('A Q U A B E A U T É', width / 2, 22, { align: 'center' });

  // Subtitle "L'éden du bien-être à Mutzig"
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(138, 123, 117); // Soft taupe
  doc.text("Institut de Beauté • L'éden du soin à Mutzig", width / 2, 27, { align: 'center' });

  // Soft division line
  doc.setDrawColor(232, 195, 185);
  doc.setLineWidth(0.3);
  doc.line(45, 31, width - 45, 31);

  // 4. Main Type Descriptor
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(200, 157, 124); // Gold sand
  doc.text('I N V I T A T I O N   A U   V O Y A G E', width / 2, 39, { align: 'center' });

  // 5. Voucher Name (The main title)
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 25, 24); // Charcoal
  doc.text(giftCard.name.toUpperCase(), width / 2, 49, { align: 'center' });

  // If there's an amount, show it tastefully
  if (giftCard.amount > 0) {
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(106, 127, 116); // Sage Green
    doc.text(`Valeur : ${giftCard.amount.toFixed(2)} €`, width / 2, 57, { align: 'center' });
  }

  // Soft horizontal bar
  doc.setDrawColor(247, 225, 219);
  doc.line(70, 62, width - 70, 62);

  // 6. Beneficiary & Creator details
  let textY = 70;
  
  // "Pour: Beneficiary Name"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(138, 123, 117); // Taupe
  doc.text('Offert à :', 35, textY);
  
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 25, 24);
  doc.text(giftCard.beneficiaryName, 60, textY);

  textY += 7;

  // "De la part de: Buyer Name"
  if (giftCard.buyerName) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(138, 123, 117);
    doc.text('De la part de :', 35, textY);
    
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(30, 25, 24);
    doc.text(giftCard.buyerName, 60, textY);
    textY += 7;
  }

  // "Message personnalisé"
  if (giftCard.message) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(138, 123, 117);
    doc.text('Message :', 35, textY);

    doc.setFont('times', 'italic');
    doc.setFontSize(10.5);
    doc.setTextColor(70, 65, 63); // Muted brown

    // Soft text wrapping for customized text messages
    const maxMsgWidth = 115;
    const splitMessage = doc.splitTextToSize(giftCard.message, maxMsgWidth);
    doc.text(splitMessage, 60, textY);
  }

  // 7. Legal Disclaimer & Validity codes at bottom
  const footerY = 118;
  
  // Divider
  doc.setDrawColor(200, 157, 124);
  doc.setLineWidth(0.2);
  doc.line(15, footerY - 5, width - 15, footerY - 5);

  // Left Section: Code and Dates
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(138, 123, 117);
  doc.text(`Référence : ${giftCard.id}`, 20, footerY);
  doc.text(`Date d'émission : ${formatFrenchDate(giftCard.dateGenerated)}`, 20, footerY + 4);
  doc.text(`Valide jusqu'au : ${formatFrenchDate(giftCard.expiryDate)}`, 20, footerY + 8);

  // Right Section: Action note and contact info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Valable exclusivement pour les prestations de l\'institut.', width - 20, footerY, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text('Réservation obligatoire • Sur présentation de ce bon à l\'accueil.', width - 20, footerY + 4, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('Aquabeauté, 14 rue de l\'Église, 67190 Mutzig • Tél : 03 88 47 12 90', width - 20, footerY + 8, { align: 'right' });

  return doc;
}

// Simple date formatter function for French
function formatFrenchDate(isoString: string): string {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoString;
}

/**
 * Utility to instantly trigger pdf download in user browser
 */
export function downloadGiftCardPDF(giftCard: GeneratedGiftCard): void {
  const doc = generateGiftCardPDF(giftCard);
  const fileName = `Bon_Cadeau_${giftCard.id}_${giftCard.beneficiaryName.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
