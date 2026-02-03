import React from 'react';
import { InvoiceData } from '../../types';

interface SalesInvoiceProps {
    data: InvoiceData;
    styleClass: { readonly [key: string]: string };
}

const SalesInvoice: React.FC<SalesInvoiceProps> = ({ data, styleClass }) => {
    // Normalize style classes to handle variations across different design styles
    const styles = {
        container: styleClass.container,
        header: styleClass.header,
        title: styleClass.title,
        subtitle: styleClass.subtitle || styleClass.subHeader,

        // Meta section (Invoice #, Date, etc)
        meta: styleClass.metaGrid || styleClass.metaSection || styleClass.header || '',
        metaItem: styleClass.metaItem || styleClass.metaGroup || '',

        // Address section (From/To)
        addresses: styleClass.addressSection || styleClass.addressGrid || styleClass.addresses || styleClass.columns,
        addressBlock: styleClass.addressBlock || styleClass.addressBox || styleClass.addressCol || styleClass.column,

        // Table
        table: styleClass.table,

        // Totals
        totals: styleClass.totals,
        totalRow: styleClass.totalRow,
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>{data.from.name}</div>
                <div className={styles.subtitle}>INVOICE</div>
            </header>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <label>Invoice No</label>
                    <span>{data.invoiceNumber}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Date</label>
                    <span>{data.issuedDate}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Due Date</label>
                    <span>{data.dueDate}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Total Due</label>
                    <span>${data.total.toFixed(2)}</span>
                </div>
            </div>

            <div className={styles.addresses}>
                <div className={styles.addressBlock}>
                    <h3>Bill To</h3>
                    <div>{data.to.name}</div>
                    <div>{data.to.company}</div>
                    <div>{data.to.address}</div>
                    <div>{data.to.city}</div>
                    <div>{data.to.email}</div>
                </div>

                <div className={styles.addressBlock}>
                    <h3>From</h3>
                    <div>{data.from.name}</div>
                    <div>{data.from.address}</div>
                    <div>{data.from.city}</div>
                    <div>{data.from.email}</div>
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
                    <span>Subtotal</span>
                    <span>${data.subtotal.toFixed(2)}</span>
                </div>
                {data.tax && (
                    <div className={styles.totalRow}>
                        <span>Tax</span>
                        <span>${data.tax.toFixed(2)}</span>
                    </div>
                )}
                <div className={`${styles.totalRow} ${styleClass.final || styleClass.grandTotal || ''}`}>
                    <span>Total</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>
            </div>

            {data.notes && (
                <div className={styleClass.notes || styleClass.footer}>
                    {data.notes}
                </div>
            )}
        </div>
    );
};

export default SalesInvoice;
