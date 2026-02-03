import React from 'react';
import { InvoiceData } from '../../types';

interface Props {
    data: InvoiceData;
    styleClass: { readonly [key: string]: string };
}

const CreditNote: React.FC<Props> = ({ data, styleClass }) => {
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
                <div className={styles.subtitle} style={{ color: '#e74c3c' }}>CREDIT NOTE</div>
            </header>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <label>Credit Note #</label>
                    <span>{data.invoiceNumber}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Date</label>
                    <span>{data.issuedDate}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Ref. Invoice</label>
                    <span>#{data.invoiceNumber.replace('CN', 'INV')}</span>
                </div>
            </div>

            <div className={styles.addresses}>
                <div className={styles.addressBlock}>
                    <h3>Credit To</h3>
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
                            <td style={{ color: '#e74c3c' }}>-${Math.abs(item.amount).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.totals}>
                <div className={styles.totalRow}>
                    <span>Total Credit</span>
                    <span style={{ color: '#e74c3c' }}>-${Math.abs(data.total).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default CreditNote;
