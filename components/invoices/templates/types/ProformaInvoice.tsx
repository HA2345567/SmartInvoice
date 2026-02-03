import React from 'react';
import { InvoiceData } from '../../types';
import SalesInvoice from './SalesInvoice';

interface Props {
    data: InvoiceData;
    styleClass: { readonly [key: string]: string };
}

const ProformaInvoice: React.FC<Props> = ({ data, styleClass }) => {
    // modify data for display or wrap logic
    // For proforma, we might effectively render SalesInvoice but with specific overrides in the UI if possible,
    // or copy implementation. To DRY, I really should have a BaseInvoice but user instructions imply separate files.
    // I will extend the data passed to SalesInvoice or wrap it.

    // Since SalesInvoice is loosely coupled to "Sales", but structuraly similar.
    // I'll reuse SalesInvoice but inject a specific Note/Title via data modification if valid.
    // Actually, SalesInvoice hardcodes "INVOICE" subtitle in my implementation. 
    // I should update SalesInvoice to be more flexible or duplicate the code. 
    // Given "Enterprise" quality, I'll duplicate to allow full customization later, 
    // or refactor SalesInvoice to take a "title" prop.

    // Let's copy-paste and adapt for now which is safer for "exact" requirements.

    const styles = {
        container: styleClass.container,
        header: styleClass.header,
        title: styleClass.title,
        subtitle: styleClass.subtitle || styleClass.subHeader,
        meta: styleClass.metaGrid || styleClass.metaSection || styleClass.header || '',
        metaItem: styleClass.metaItem || styleClass.metaGroup || '',
        addresses: styleClass.addressSection || styleClass.addressGrid || styleClass.addresses || styleClass.columns,
        addressBlock: styleClass.addressBlock || styleClass.addressBox || styleClass.addressCol || styleClass.column,
        table: styleClass.table,
        totals: styleClass.totals,
        totalRow: styleClass.totalRow,
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>{data.from.name}</div>
                <div className={styles.subtitle} style={{ color: '#e67e22' }}>PROFORMA INVOICE</div>
            </header>

            <div style={{
                padding: '10px',
                backgroundColor: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeeba',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                This is a proforma invoice. This is not a demand for payment.
            </div>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <label>Proforma No</label>
                    <span>{data.invoiceNumber}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Date</label>
                    <span>{data.issuedDate}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Valid Until</label>
                    <span>{data.proforma?.validUntil || data.dueDate}</span>
                </div>
            </div>

            <div className={styles.addresses}>
                <div className={styles.addressBlock}>
                    <h3>Bill To</h3>
                    <div>{data.to.name}</div>
                    <div>{data.to.company}</div>
                    <div>{data.to.address}</div>
                    <div>{data.to.city}</div>
                </div>

                <div className={styles.addressBlock}>
                    <h3>From</h3>
                    <div>{data.from.name}</div>
                    <div>{data.from.address}</div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, i) => (
                        <tr key={i}>
                            <td>{item.description}</td>
                            <td>{item.qty}</td>
                            <td>${item.rate.toFixed(2)}</td>
                            <td>${item.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.totals}>
                <div className={styles.totalRow}>
                    <span>Estimated Total</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProformaInvoice;
