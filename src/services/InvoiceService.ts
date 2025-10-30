import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CartItem, Language } from '../types';
import emailjs from '@emailjs/browser';

export interface InvoiceData {
  orderNumber: string;
  date: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    area: string;
    notes?: string;
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
        area: 'المحافظة',
        notes: 'ملاحظات',
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
        notes: 'Notes',
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

  // Helper method to calculate subtotal from items
  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.selectedUnit.price * item.quantity), 0);
  }

  // Helper method to validate invoice calculations
  private validateInvoiceData(invoiceData: InvoiceData): InvoiceData {
    const calculatedSubtotal = this.calculateSubtotal(invoiceData.items);
    const calculatedTotal = calculatedSubtotal + invoiceData.deliveryPrice;
    
    return {
      ...invoiceData,
      subtotal: calculatedSubtotal,
      total: calculatedTotal
    };
  }

  private createInvoiceHTML(invoiceData: InvoiceData): string {
    const texts = this.getTexts(invoiceData.language)[invoiceData.language];
    const isRTL = invoiceData.language === 'ar';
    
    return `
      <div style="
        width: 800px;
        font-family: 'Cairo', 'Arial', sans-serif;
        direction: ${isRTL ? 'rtl' : 'ltr'};
        background: white;
        padding: 40px;
        color: #333;
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 30px;
          text-align: ${isRTL ? 'right' : 'left'};
        ">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${texts.title}</h1>
          <h2 style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">${texts.subtitle}</h2>
        </div>

        <!-- Invoice Info -->
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 10px;
        ">
          <div>
            <p style="margin: 0 0 5px 0; font-weight: bold;">${texts.invoice}: ${invoiceData.orderNumber}</p>
            <p style="margin: 0; color: #666;">${texts.date}: ${invoiceData.date}</p>
          </div>
        </div>

        <!-- Customer Info -->
        <div style="
          margin-bottom: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 10px;
        ">
          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-weight: bold;">${texts.customer}</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <p style="margin: 0;"><strong>${texts.name}:</strong> ${invoiceData.customerInfo.name}</p>
            <p style="margin: 0;"><strong>${texts.phone}:</strong> ${invoiceData.customerInfo.phone}</p>
            <p style="margin: 0;"><strong>${texts.address}:</strong> ${invoiceData.customerInfo.address}</p>
            <p style="margin: 0;"><strong>${texts.area}:</strong> ${invoiceData.customerInfo.area}</p>
          </div>
          ${invoiceData.customerInfo.notes ? `
          <div style="margin-top: 15px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <p style="margin: 0; font-weight: bold; color: #0f172a;">${texts.notes}:</p>
            <p style="margin: 5px 0 0 0; color: #374151;">${invoiceData.customerInfo.notes}</p>
          </div>
          ` : ''}
        </div>

        <!-- Items Table -->
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-weight: bold;">${texts.items}</h3>
          <table style="
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          ">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 15px; text-align: ${isRTL ? 'right' : 'left'}; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${texts.product}</th>
                <th style="padding: 15px; text-align: center; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${texts.quantity}</th>
                <th style="padding: 15px; text-align: center; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${texts.price}</th>
                <th style="padding: 15px; text-align: center; font-weight: bold; border-bottom: 1px solid #e5e7eb;">${texts.total}</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => {
                const itemTotal = item.selectedUnit.price * item.quantity;
                const productName = isRTL ? (item.product.name.ar || item.product.name.en) : item.product.name.en;
                const unitText = isRTL ? item.selectedUnit.unit.ar : item.selectedUnit.unit.en;
                return `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">${productName}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #f3f4f6;">${item.quantity} ${unitText}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #f3f4f6;">${item.selectedUnit.price.toFixed(3)}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #22c55e;">${itemTotal.toFixed(3)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
        ">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${texts.subtotal}:</span>
            <span style="font-weight: bold;">${invoiceData.subtotal.toFixed(3)} ${texts.currency}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>${texts.delivery}:</span>
            <span style="font-weight: bold;">${invoiceData.deliveryPrice.toFixed(3)} ${texts.currency}</span>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
            border-top: 2px solid #22c55e;
            font-size: 18px;
            font-weight: bold;
            color: #22c55e;
          ">
            <span>${texts.finalTotal}:</span>
            <span>${invoiceData.total.toFixed(3)} ${texts.currency}</span>
          </div>
        </div>

        <!-- Payment Method -->
        <div style="
          background: #f8fafc;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 30px;
        ">
          <p style="margin: 0; font-weight: bold;">
            ${texts.paymentMethod}: ${invoiceData.paymentMethod === 'cash' ? texts.cash : texts.link}
          </p>
        </div>

        <!-- Footer -->
        <div style="
          text-align: center;
          padding: 20px;
          background: #22c55e;
          color: white;
          border-radius: 10px;
        ">
          <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">${texts.thankYou}</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">${texts.contact}</p>
        </div>
      </div>
    `;
  }

  public async generatePDF(invoiceData: InvoiceData): Promise<Blob> {
    // Validate and correct calculations
    const validatedData = this.validateInvoiceData(invoiceData);
    const htmlContent = this.createInvoiceHTML(validatedData);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    
    // Add to body temporarily
    document.body.appendChild(container);
    
    try {
      // Generate canvas from HTML
      const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: 1200
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      return pdf.output('blob');
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  }

  public async downloadInvoice(invoiceData: InvoiceData): Promise<void> {
    try {
      // Validate calculations before generating PDF
      const validatedData = this.validateInvoiceData(invoiceData);
      const pdfBlob = await this.generatePDF(validatedData);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  public async sendInvoiceEmail(invoiceData: InvoiceData, customerEmail: string): Promise<void> {
    try {
      // Validate calculations before generating PDF
      const validatedData = this.validateInvoiceData(invoiceData);
      const pdfBlob = await this.generatePDF(validatedData);
      const base64PDF = await this.blobToBase64(pdfBlob);
      
      const templateParams = {
        to_email: customerEmail,
        customer_name: invoiceData.customerInfo.name,
        order_number: invoiceData.orderNumber,
        total_amount: invoiceData.total.toFixed(3),
        attachment: base64PDF
      };

      await emailjs.send(
        'your_service_id',
        'your_template_id',
        templateParams,
        'your_public_key'
      );
    } catch (error) {
      console.error('Error sending invoice email:', error);
      throw error;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export default InvoiceService;