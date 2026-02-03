import React from 'react';
import { InvoiceData } from '../../types';

interface Props {
    data: InvoiceData;
    styleClass: { readonly [key: string]: string };
}

const InterimInvoice: React.FC<Props> = ({ data, styleClass }) => {
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
                <div className={styles.subtitle}>INTERIM INVOICE</div>
            </header>

            {data.interim && (
                <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #eee' }}>
                    <h4>Project Status: {data.interim.projectName}</h4>
                    <p>Milestone: {data.interim.milestone}</p>
                    <div style={{ width: '100%', backgroundColor: '#eee', height: '10px', marginTop: '5px' }}>
                        <div style={{
                            width: `${data.interim.percentComplete}%`,
                            backgroundColor: '#0078D4',
                            height: '100%'
                        }}></div>
                    </div>
                    <small>{data.interim.percentComplete}% Complete</small>
                </div>
            )}

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <label>Invoice No</label>
                    <span>{data.invoiceNumber}</span>
                </div>
                <div className={styles.metaItem}>
                    <label>Date</label>
                    <span>{data.issuedDate}</span>
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
                    <span>Total this Milestone</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default InterimInvoice;
