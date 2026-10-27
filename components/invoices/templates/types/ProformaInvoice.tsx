import React from 'react';
import { InvoiceData } from '../../types';

interface ProformaInvoiceProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const ProformaInvoice: React.FC<ProformaInvoiceProps> = ({ data, styleClass }) => {
  const getClasses = (...keys: string[]): string => {
    return keys
      .map(key => styleClass[key])
      .filter(Boolean)
      .join(' ');
  };

  const hasPageLayout = !!styleClass.page;
  const hasCoverImage = !!styleClass.coverImage;
  const hasInvoiceCard = !!styleClass.invoiceCard;

  if (hasCoverImage) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.coverImage}>
          <div className={styleClass.coverGradient}></div>
        </div>
        <div className={styleClass.pageContent}>
          <div className={styleClass.pageIcon}>
            <span>&#128203;</span>
          </div>
          <h1 className={styleClass.title}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle}>Proforma Invoice</p>

          <div className={styleClass.metadata}>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Date</span>
              <span className={styleClass.metaValue}>{data.issuedDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Valid Until</span>
              <span className={styleClass.metaValue}>{data.proforma?.validUntil || data.dueDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Estimated Total</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Status</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagDRAFT}`}>Proforma</span>
              </span>
            </div>
          </div>

          <div className={styleClass.calloutBlock}>
            <div className={styleClass.calloutIcon}>
              <span>&#9888;</span>
            </div>
            <div className={styleClass.calloutContent}>
              <h3>Not for Payment</h3>
              <p>This is a proforma invoice and is not a demand for payment. It provides an estimate of charges for your review.</p>
            </div>
          </div>

          <div className={getClasses('addressSection', 'addresses')}>
            <div className={getClasses('addressBlock', 'addressCol')}>
              <h3>Bill To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.company}</div>
              <div>{data.to.address}</div>
              <div>{data.to.city}</div>
              {data.to.email && <div>{data.to.email}</div>}
            </div>
            <div className={getClasses('addressBlock', 'addressCol')}>
              <h3>From</h3>
              <div className={styleClass.name}>{data.from.name}</div>
              <div>{data.from.address}</div>
              <div>{data.from.city}</div>
              {data.from.email && <div>{data.from.email}</div>}
            </div>
          </div>

          <div className={getClasses('divider')}></div>

          <div className={styleClass.tableSection}>
            <div className={styleClass.tableTitle}>
              <span className={styleClass.tableTitleIcon}>&#128203;</span>
              Estimated Items
            </div>
            <div className={styleClass.tableWrapper}>
              <table className={styleClass.table}>
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
                      <td className={styleClass.descriptionCell}>
                        <span className={styleClass.itemIcon}>{i + 1}</span>
                        {item.description}
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td>${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styleClass.totalsSection}>
            <div className={styleClass.totalRow}>
              <span>Estimated Subtotal</span>
              <span>${data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {data.tax && (
              <div className={`${styleClass.totalRow} ${styleClass.amount}`}>
                <span>Estimated Tax</span>
                <span>${data.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className={styleClass.grandTotal}>
              <span>Estimated Total</span>
              <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {data.notes && (
            <div className={getClasses('toggleSection', 'notes')}>
              <div className={styleClass.toggleHeader}>
                <span className={styleClass.toggleIcon}>&#128172;</span>
                <span className={styleClass.toggleText}>Notes</span>
              </div>
              <div className={styleClass.toggleContent}>{data.notes}</div>
            </div>
          )}

          <div className={styleClass.footer}>
            <div className={styleClass.commentsIndicator}>
              <span className={styleClass.commentsIcon}>&#128483;</span>
              <span>Comments (0)</span>
            </div>
            <div className={styleClass.breadcrumbs}>
              <span className={styleClass.breadcrumb}>Proformas</span>
              <span className={styleClass.breadcrumb}>{data.invoiceNumber}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasInvoiceCard) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.invoiceCard}>
          <div className={styleClass.header}>
            <div className={styleClass.shopifyBrand}>
              <div className={styleClass.shopifyLogo}>S</div>
              <span className={styleClass.shopifyText}>{data.from.name}</span>
            </div>
            <div className={styleClass.invoiceMeta}>
              <h3 className={styleClass.title}>Proforma Invoice</h3>
              <div className={styleClass.invoiceNumber}>{data.invoiceNumber}</div>
              <div className={styleClass.orderTag}>
                <span>&#128203;</span>
                Estimate #{data.invoiceNumber.split('-').pop()}
              </div>
            </div>
          </div>

          <div className={styleClass.customerSection}>
            <div className={styleClass.customerBlock}>
              <h3>Bill To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.company}</div>
              <div>{data.to.email}</div>
            </div>
            <div className={styleClass.customerBlock}>
              <h3>Valid Until</h3>
              <div className={styleClass.name}>{data.proforma?.validUntil || data.dueDate}</div>
              <div className={styleClass.statusPill} style={{ background: '#fff3cd', color: '#856404' }}>
                <span>&#9888;</span> Estimate
              </div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Estimated Items</h2>
              <span className={styleClass.itemCount}>{data.items.length} items</span>
            </div>

            <div className={styleClass.tableHeader}>
              <span>Product</span>
              <span style={{ textAlign: 'center' }}>Qty</span>
              <span>Price</span>
              <span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {data.items.map((item, i) => (
              <div key={i} className={styleClass.tableRow}>
                <div className={styleClass.productCell}>
                  <div className={styleClass.productImage}>{i + 1}</div>
                  <div className={styleClass.productInfo}>
                    <div className={styleClass.productName}>{item.description}</div>
                    <div className={styleClass.sku}>SKU-{1000 + i}</div>
                  </div>
                </div>
                <div className={styleClass.quantityCell}>{item.qty}</div>
                <div className={styleClass.unitPriceCell}>${item.rate.toFixed(2)}</div>
                <div className={styleClass.totalCell}>${item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className={styleClass.financialSummary}>
            <div className={styleClass.summaryCard}>
              <div className={styleClass.summaryRows}>
                <div className={styleClass.summaryRow}>
                  <span>Subtotal</span>
                  <span>${data.subtotal.toFixed(2)}</span>
                </div>
                {data.tax && (
                  <div className={styleClass.summaryRow}>
                    <span>Tax</span>
                    <span>${data.tax.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className={styleClass.grandTotal}>
                <span>Estimated Total</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.paymentSection}>
            <div className={styleClass.paymentInfo}>
              <div className={styleClass.paymentIcon}>&#9888;</div>
              <div className={styleClass.paymentDetails}>
                <h4>Proforma Notice</h4>
                <span>This is an estimate, not a demand for payment</span>
              </div>
            </div>
            <button className={styleClass.payNowBtn} style={{ background: '#856404' }}>
              <span>&#128203;</span> Convert to Invoice
            </button>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink}>Terms</a>
                <a href="#" className={styleClass.footerLink}>Privacy</a>
                <a href="#" className={styleClass.footerLink}>Contact</a>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <div className={styleClass.poweredByIcon}></div>
              <span>Estimate valid until {data.proforma?.validUntil || data.dueDate}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasPageLayout) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.page}>
          <div className={styleClass.header}>
            <div className={getClasses('brandHeader', 'slackLogo')}>
              <div className={styleClass.logoArea}>
                <div className={getClasses('logoPlaceholder', 'shopifyLogo')}></div>
                <span className={getClasses('title', 'slackText')}>{data.from.name}</span>
              </div>
              <div className={getClasses('invoiceBadge', 'invoiceLabel')} style={{ background: '#f59e0b', color: 'white' }}>PROFORMA</div>
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')}>Issued: {data.issuedDate}</div>
            </div>
          </div>

          <div className={getClasses('metaGrid', 'detailsGrid', 'metadata')}>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Date</label>
              <span>{data.issuedDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Valid Until</label>
              <span>{data.proforma?.validUntil || data.dueDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Estimated</label>
              <span style={{ fontWeight: '700' }}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Status</label>
              <span className={getClasses('statusBadge', 'statusPill')} style={{ background: '#f59e0b', color: 'white' }}>Proforma</span>
            </div>
          </div>

          <div className={styleClass.content}>
            <div className={getClasses('addressSection', 'addressGrid', 'addresses', 'customerSection')}>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>Bill To</h3>
                <div className={getClasses('company', 'name')}>{data.to.name}</div>
                <div>{data.to.company}</div>
                <div>{data.to.address}</div>
                <div>{data.to.city}</div>
                {data.to.email && <div>{data.to.email}</div>}
              </div>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>From</h3>
                <div className={getClasses('company', 'name')}>{data.from.name}</div>
                <div>{data.from.address}</div>
                <div>{data.from.city}</div>
                {data.from.email && <div>{data.from.email}</div>}
              </div>
            </div>

            <div className={getClasses('tableSection', 'tableContainer', 'itemsSection', 'lineItemsHeader')}>
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Estimated Line Items</h2>
              <table className={styleClass.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Description</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Rate</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className={getClasses('productCell', 'productInfo')}>
                          <span className={styleClass.descriptionCell}>{item.description}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ textAlign: 'right' }} className={styleClass.unitPrice}>
                        ${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right' }} className={getClasses('amountCell', 'extendedPrice', 'totalCell', 'totalAmount')}>
                        ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={getClasses('totals', 'summarySection', 'financialSummary', 'summaryCard')}>
              <div className={getClasses('totalRow', 'summaryRow')}>
                <span>Subtotal</span>
                <span>${data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              {data.tax && (
                <div className={getClasses('totalRow', 'summaryRow', 'taxRow')}>
                  <span>Tax</span>
                  <span>${data.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className={getClasses('grandTotal', 'grandTotalRow')}>
                <span>Estimated Total</span>
                <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styleClass.container}>
      <header className={styleClass.header}>
        <div className={styleClass.title}>{data.from.name}</div>
        <div className={getClasses('subtitle', 'subHeader')} style={{ color: '#e67e22' }}>PROFORMA INVOICE</div>
      </header>

      <div style={{
        padding: '16px',
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba',
        marginBottom: '24px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        This is a proforma invoice. This is not a demand for payment.
      </div>

      <div className={getClasses('metaGrid', 'metaSection', 'detailsGrid', 'meta')}>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Proforma No</label>
          <span className={getClasses('metaValue')}>{data.invoiceNumber}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Date</label>
          <span className={getClasses('metaValue')}>{data.issuedDate}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Valid Until</label>
          <span className={getClasses('metaValue')}>{data.proforma?.validUntil || data.dueDate}</span>
        </div>
      </div>

      <div className={getClasses('addressSection', 'addressGrid', 'addresses')}>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>Bill To</h3>
          <div>{data.to.name}</div>
          <div>{data.to.company}</div>
          <div>{data.to.address}</div>
          <div>{data.to.city}</div>
        </div>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>From</h3>
          <div>{data.from.name}</div>
          <div>{data.from.address}</div>
          <div>{data.from.city}</div>
        </div>
      </div>

      <table className={styleClass.table}>
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
              <td>${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              <td>${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styleClass.totals}>
        <div className={styleClass.totalRow}>
          <span>Estimated Subtotal</span>
          <span>${data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {data.tax && (
          <div className={styleClass.totalRow}>
            <span>Tax</span>
            <span>${data.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className={`${styleClass.totalRow} ${getClasses('final', 'grandTotal')}`}>
          <span>Estimated Total</span>
          <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {data.notes && (
        <div className={getClasses('notes', 'footer')}>
          {data.notes}
        </div>
      )}
    </div>
  );
};

export default ProformaInvoice;
