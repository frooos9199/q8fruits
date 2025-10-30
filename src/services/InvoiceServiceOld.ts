import jsPDF from 'jspdf';
import { CartItem, Language } from '../types';
import emailjs from '@emailjs/browser';

// Add Arabic font support to jsPDF
declare module 'jspdf' {
  interface jsPDF {
    addFileToVFS(filename: string, content: string): jsPDF;
    addFont(filename: string, fontname: string, fontstyle: string): string;
  }
}

export interface InvoiceData {
  orderNumber: string;
  date: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    area: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  paymentMethod: 'link' | 'cash';
  language: Language;
}

export class InvoiceService {
  private static instance: InvoiceService;

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  // Helper method to handle Arabic text encoding
  private convertArabicText(text: string): string {
    // This is a simple approach to handle Arabic text
    // In production, you might want to use a proper Arabic text processing library
    return text;
  }

  private getTexts(language: Language) {
    return {
      ar: {
        title: 'فكهاني الكويت',
        subtitle: 'فاتورة شراء',
        invoice: 'فاتورة رقم',
        date: 'التاريخ',
        customer: 'بيانات العميل',
        name: 'الاسم',
        phone: 'الهاتف',
        address: 'العنوان',
        area: 'المنطقة',
        items: 'المنتجات',
        product: 'المنتج',
        quantity: 'الكمية',
        price: 'السعر',
        total: 'المجموع',
        subtotal: 'المجموع الفرعي',
        delivery: 'التوصيل',
        finalTotal: 'المجموع النهائي',
        paymentMethod: 'طريقة الدفع',
        cash: 'دفع نقدي',
        link: 'دفع إلكتروني',
        currency: 'د.ك',
        thankYou: 'شكراً لاختياركم فكهاني الكويت',
        contact: 'للاستفسار: واتساب 99999999'
      },
      en: {
        title: 'Fakahani Kuwait',
        subtitle: 'Purchase Invoice',
        invoice: 'Invoice No.',
        date: 'Date',
        customer: 'Customer Information',
        name: 'Name',
        phone: 'Phone',
        address: 'Address',
        area: 'Area',
        items: 'Items',
        product: 'Product',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        subtotal: 'Subtotal',
        delivery: 'Delivery',
        finalTotal: 'Final Total',
        paymentMethod: 'Payment Method',
        cash: 'Cash Payment',
        link: 'Electronic Payment',
        currency: 'KWD',
        thankYou: 'Thank you for choosing Fakahani Kuwait',
        contact: 'For inquiries: WhatsApp 99999999'
      }
    };
  }

  public async generatePDF(invoiceData: InvoiceData): Promise<Blob> {
    const texts = this.getTexts(invoiceData.language)[invoiceData.language];
    const isRTL = invoiceData.language === 'ar';
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font - use a font that supports Arabic characters better
    if (isRTL) {
      // For Arabic text, we'll use a workaround with proper encoding
      pdf.setFont('helvetica');
    } else {
      pdf.setFont('helvetica');
    }
    
    // Header
    pdf.setFillColor(34, 197, 94);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    
    if (isRTL) {
      // Handle RTL text positioning and encoding
      pdf.text(texts.title, 190, 15, { align: 'right' });
      pdf.setFontSize(14);
      pdf.text(texts.subtitle, 190, 25, { align: 'right' });
    } else {
      pdf.text(texts.title, 20, 15);
      pdf.setFontSize(14);
      pdf.text(texts.subtitle, 20, 25);
    }

    // Invoice Info
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    let yPos = 55;

    if (isRTL) {
      const invoiceText = `${texts.invoice}: ${invoiceData.orderNumber}`;
      const dateText = `${texts.date}: ${invoiceData.date}`;
      pdf.text(invoiceText, 190, yPos, { align: 'right' });
      pdf.text(dateText, 190, yPos + 8, { align: 'right' });
    } else {
      pdf.text(`${texts.invoice}: ${invoiceData.orderNumber}`, 20, yPos);
      pdf.text(`${texts.date}: ${invoiceData.date}`, 20, yPos + 8);
    }

    // Customer Info
    yPos += 25;
    pdf.setFont('helvetica', 'bold');
    
    if (isRTL) {
      pdf.text(texts.customer, 190, yPos, { align: 'right' });
    } else {
      pdf.text(texts.customer, 20, yPos);
    }
    
    pdf.setFont('helvetica', 'normal');
    yPos += 8;

    const customerLines = [
      `${texts.name}: ${invoiceData.customerInfo.name}`,
      `${texts.phone}: ${invoiceData.customerInfo.phone}`,
      `${texts.address}: ${invoiceData.customerInfo.address}`,
      `${texts.area}: ${invoiceData.customerInfo.area}`
    ];

    customerLines.forEach(line => {
      if (isRTL) {
        pdf.text(line, 190, yPos, { align: 'right' });
      } else {
        pdf.text(line, 20, yPos);
      }
      yPos += 6;
    });

    // Items Table
    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    
    if (isRTL) {
      pdf.text(texts.items, 190, yPos, { align: 'right' });
    } else {
      pdf.text(texts.items, 20, yPos);
    }

    yPos += 10;

    // Table Header
    pdf.setFillColor(248, 250, 252);
    pdf.rect(20, yPos - 5, 170, 10, 'F');
    
    pdf.setFont('helvetica', 'bold');
    
    if (isRTL) {
      pdf.text(texts.total, 30, yPos, { align: 'center' });
      pdf.text(texts.price, 70, yPos, { align: 'center' });
      pdf.text(texts.quantity, 110, yPos, { align: 'center' });
      pdf.text(texts.product, 170, yPos, { align: 'right' });
    } else {
      pdf.text(texts.product, 25, yPos);
      pdf.text(texts.quantity, 110, yPos, { align: 'center' });
      pdf.text(texts.price, 140, yPos, { align: 'center' });
      pdf.text(texts.total, 170, yPos, { align: 'center' });
    }

    yPos += 10;
    pdf.setFont('helvetica', 'normal');

    // Table Items
    invoiceData.items.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      
      if (isRTL) {
        pdf.text(`${itemTotal.toFixed(3)}`, 30, yPos, { align: 'center' });
        pdf.text(`${item.product.price.toFixed(3)}`, 70, yPos, { align: 'center' });
        pdf.text(`${item.quantity}`, 110, yPos, { align: 'center' });
        // Use English name for Arabic version to avoid encoding issues
        const productName = item.product.name.ar || item.product.name.en;
        pdf.text(productName, 170, yPos, { align: 'right' });
      } else {
        pdf.text(item.product.name.en, 25, yPos);
        pdf.text(`${item.quantity}`, 110, yPos, { align: 'center' });
        pdf.text(`${item.product.price.toFixed(3)}`, 140, yPos, { align: 'center' });
        pdf.text(`${itemTotal.toFixed(3)}`, 170, yPos, { align: 'center' });
      }
      
      yPos += 8;
    });

    // Totals
    yPos += 10;
    pdf.line(20, yPos, 190, yPos);
    yPos += 10;

    const totalsData = [
      { label: texts.subtotal, value: invoiceData.subtotal.toFixed(3) },
      { label: texts.delivery, value: invoiceData.deliveryPrice.toFixed(3) },
      { label: texts.finalTotal, value: invoiceData.total.toFixed(3) }
    ];

    totalsData.forEach((item, index) => {
      if (index === totalsData.length - 1) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
      }
      
      if (isRTL) {
        pdf.text(`${item.value} ${texts.currency}`, 50, yPos, { align: 'right' });
        pdf.text(item.label, 150, yPos, { align: 'right' });
      } else {
        pdf.text(item.label, 120, yPos);
        pdf.text(`${texts.currency} ${item.value}`, 170, yPos, { align: 'right' });
      }
      
      yPos += 8;
    });

    // Payment Method
    yPos += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    
    const paymentText = `${texts.paymentMethod}: ${invoiceData.paymentMethod === 'cash' ? texts.cash : texts.link}`;
    
    if (isRTL) {
      pdf.text(paymentText, 190, yPos, { align: 'right' });
    } else {
      pdf.text(paymentText, 20, yPos);
    }

    // Footer
    yPos = 280;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    
    if (isRTL) {
      pdf.text(texts.thankYou, 105, yPos, { align: 'center' });
      pdf.text(texts.contact, 105, yPos + 6, { align: 'center' });
    } else {
      pdf.text(texts.thankYou, 105, yPos, { align: 'center' });
      pdf.text(texts.contact, 105, yPos + 6, { align: 'center' });
    }

    return pdf.output('blob');
  }

  public async sendInvoiceEmail(
    invoiceData: InvoiceData,
    recipientEmail: string,
    adminEmail: string = 'admin@fakahani-kuwait.com'
  ): Promise<boolean> {
    try {
      const pdfBlob = await this.generatePDF(invoiceData);
      const pdfBase64 = await this.blobToBase64(pdfBlob);

      // Initialize EmailJS (you'll need to set up your service)
      emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key

      // Send to customer
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          to_email: recipientEmail,
          customer_name: invoiceData.customerInfo.name,
          order_number: invoiceData.orderNumber,
          total_amount: invoiceData.total.toFixed(3),
          attachment: pdfBase64,
          language: invoiceData.language
        }
      );

      // Send to admin
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_ADMIN_TEMPLATE_ID', // Different template for admin
        {
          to_email: adminEmail,
          customer_name: invoiceData.customerInfo.name,
          order_number: invoiceData.orderNumber,
          total_amount: invoiceData.total.toFixed(3),
          customer_phone: invoiceData.customerInfo.phone,
          customer_address: invoiceData.customerInfo.address,
          payment_method: invoiceData.paymentMethod,
          attachment: pdfBase64
        }
      );

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]); // Remove data:application/pdf;base64, prefix
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public async downloadInvoice(invoiceData: InvoiceData): Promise<void> {
    const pdfBlob = await this.generatePDF(invoiceData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceData.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}