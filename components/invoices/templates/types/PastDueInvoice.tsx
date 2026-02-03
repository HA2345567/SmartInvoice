import React from 'react';
import { InvoiceData } from '../../types';

interface Props {
    data: InvoiceData;
    styleClass: { readonly [key: string]: string };
}

const PastDueInvoice: React.FC<Props> = ({ data, styleClass }) => {
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
        <div className={styles.container} style={{ border: '4px solid #c0392b' }}>
            <header className={styles.header}>
                <div className={styles.title} style={{ color: '#c0392b' }}>{data.from.name}</div>
                <div className={styles.subtitle} style={{ color: '#c0392b', fontWeight: 'bold' }}>PAST DUE INVOICE</div>
            </header>

            <div style={{
                backgroundColor: '#c0392b',
                color: 'white',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                OVERDUE: PLEASE PAY IMMEDIATELY
            </div>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <label>Invoice No</label>
                    <span>{data.invoiceNumber}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Due Date</label>
                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{data.dueDate} (OVERDUE)</span>
                </div>
            </div>

            <div className={styles.addresses}>
                <div className={styles.addressBlock}>
                    <h3>Bill To</h3>
                    <div>{data.to.name}</div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, i) => (
                        <tr key={i}>
                            <td>{item.description}</td>
                            <td>${item.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.totals}>
                <div className={styles.totalRow}>
                    <span>Total Due</span>
                    <span style={{ color: '#c0392b', fontSize: '1.2em' }}>${data.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default PastDueInvoice;
