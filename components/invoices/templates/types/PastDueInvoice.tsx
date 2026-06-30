import React from 'react';
import { InvoiceData } from '../../types';

interface PastDueInvoiceProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const PastDueInvoice: React.FC<PastDueInvoiceProps> = ({ data, styleClass }) => {
  const getClasses = (...keys: string[]): string => {
    return keys
      .map(key => styleClass[key])
      .filter(Boolean)
      .join(' ');
  };

  const hasPageLayout = !!styleClass.page;
  const hasCoverImage = !!styleClass.coverImage;
  const hasInvoiceCard = !!styleClass.invoiceCard;

  const overdueColor = '#c0392b';
  const overdueBg = '#fef2f2';
  const overdueBorder = '#fecaca';

  if (hasCoverImage) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.coverImage}>
          <div className={styleClass.coverGradient} style={{
            background: `linear-gradient(90deg, #fef2f2 0%, transparent 30%),
                        linear-gradient(180deg, #fee2e2 0%, transparent 50%),
                        linear-gradient(270deg, #fecaca 0%, transparent 40%)`,
            opacity: 0.8
          }}></div>
        </div>
        <div className={styleClass.pageContent}>
          <div className={styleClass.pageIcon}>
            <span style={{ filter: 'grayscale(100%)' }}>&#128680;</span>
          </div>
          <h1 className={styleClass.title} style={{ color: overdueColor }}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle} style={{ color: overdueColor }}>PAST DUE INVOICE</p>

          <div className={styleClass.metadata}>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Date</span>
              <span className={styleClass.metaValue}>{data.issuedDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Due Date</span>
              <span className={styleClass.metaValue} style={{ color: overdueColor, fontWeight: '700' }}>{data.dueDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Amount Due</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`} style={{ color: overdueColor }}>
                ${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Status</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagOVERDUE}`}>OVERDUE</span>
              </span>
            </div>
          </div>

          <div className={styleClass.calloutBlock} style={{ background: overdueBg, border: `1px solid ${overdueBorder}` }}>
            <div className={styleClass.calloutIcon}>
              <span>&#128680;</span>
            </div>
            <div className={styleClass.calloutContent}>
              <h3 style={{ color: overdueColor }}>Immediate Payment Required</h3>
              <p>This invoice is past due. Please remit payment immediately to avoid late fees and service interruption.</p>
            </div>
          </div>

          <div className={getClasses('addressSection', 'addresses')}>
            <div className={getClasses('addressBlock', 'addressCol')}>
              <h3>Bill To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.company}</div>
              <div>{data.to.email}</div>
            </div>
            <div className={getClasses('addressBlock', 'addressCol')}>
              <h3>From</h3>
              <div className={styleClass.name}>{data.from.name}</div>
              <div>{data.from.email}</div>
            </div>
          </div>

          <div className={getClasses('divider')}></div>

          <div className={styleClass.tableSection}>
            <div className={styleClass.tableTitle}>
              <span className={styleClass.tableTitleIcon}>&#128203;</span>
              Overdue Items
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
              <span>Subtotal</span>
              <span>${data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {data.tax && (
              <div className={`${styleClass.totalRow} ${styleClass.amount}`}>
                <span>Tax</span>
                <span>${data.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className={styleClass.grandTotal} style={{ background: overdueColor }}>
              <span>Total Due (OVERDUE)</span>
              <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {data.notes && (
            <div className={getClasses('toggleSection', 'notes')}>
              <div className={styleClass.toggleHeader} style={{ background: overdueBg }}>
                <span className={styleClass.toggleIcon}>&#128172;</span>
                <span className={styleClass.toggleText} style={{ color: overdueColor }}>Important Notice</span>
              </div>
              <div className={styleClass.toggleContent} style={{ background: overdueBg, border: `1px solid ${overdueBorder}` }}>{data.notes}</div>
            </div>
          )}

          <div className={styleClass.footer}>
            <div className={styleClass.commentsIndicator}>
              <span className={styleClass.commentsIcon}>&#128680;</span>
              <span style={{ color: overdueColor, fontWeight: '600' }}>PAYMENT OVERDUE</span>
            </div>
            <div className={styleClass.breadcrumbs}>
              <span className={styleClass.breadcrumb}>Overdue</span>
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
        <div className={styleClass.invoiceCard} style={{ border: `3px solid ${overdueColor}` }}>
          <div className={styleClass.header} style={{ background: overdueColor }}>
            <div className={styleClass.shopifyBrand}>
              <div className={styleClass.shopifyLogo} style={{ background: 'white', color: overdueColor }}>{data.from.name.charAt(0)}</div>
              <span className={styleClass.shopifyText} style={{ color: 'white' }}>{data.from.name}</span>
            </div>
            <div className={styleClass.invoiceMeta}>
              <h3 className={styleClass.title} style={{ color: 'white' }}>PAST DUE INVOICE</h3>
              <div className={styleClass.invoiceNumber} style={{ color: 'rgba(255,255,255,0.9)' }}>{data.invoiceNumber}</div>
            </div>
          </div>

          <div style={{ padding: '20px', background: overdueBg, borderBottom: `1px solid ${overdueBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: overdueColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px' }}>&#128680;</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '18px', color: overdueColor }}>OVERDUE: PLEASE PAY IMMEDIATELY</div>
                <div style={{ fontSize: '14px', color: '#991b1b', marginTop: '4px' }}>This invoice was due on {data.dueDate}. Late fees may apply.</div>
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
              <h3>Due Date</h3>
              <div className={styleClass.name} style={{ color: overdueColor }}>{data.dueDate}</div>
              <div className={styleClass.statusPill} style={{ background: overdueColor, color: 'white' }}>OVERDUE</div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Overdue Items</h2>
              <span className={styleClass.itemCount}>{data.items.length} items</span>
            </div>

            <div className={styleClass.tableHeader}>
              <span>Description</span>
              <span style={{ textAlign: 'center' }}>Qty</span>
              <span>Rate</span>
              <span style={{ textAlign: 'right' }}>Amount</span>
            </div>

            {data.items.map((item, i) => (
              <div key={i} className={styleClass.tableRow}>
                <div className={styleClass.productCell}>
                  <div className={styleClass.productImage}>{i + 1}</div>
                  <div className={styleClass.productInfo}>
                    <div className={styleClass.productName}>{item.description}</div>
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
              <div className={styleClass.grandTotal} style={{ background: overdueColor }}>
                <span>Total Due</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.paymentSection}>
            <div className={styleClass.paymentInfo}>
              <div className={styleClass.paymentIcon} style={{ color: overdueColor }}>&#128680;</div>
              <div className={styleClass.paymentDetails}>
                <h4 style={{ color: overdueColor }}>Immediate Payment Required</h4>
                <span>Due date was {data.dueDate}</span>
              </div>
            </div>
            <button className={styleClass.payNowBtn} style={{ background: overdueColor }}>
              <span>&#128179;</span> Pay Now
            </button>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink} style={{ color: overdueColor }}>Payment Options</a>
                <a href="#" className={styleClass.footerLink}>Contact Support</a>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <span style={{ color: overdueColor, fontWeight: '600' }}>Late fees may apply</span>
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
          <div className={styleClass.header} style={{ background: overdueColor }}>
            <div className={getClasses('brandHeader', 'slackLogo')} style={{ background: 'transparent' }}>
              <div className={styleClass.logoArea}>
                <div className={getClasses('logoPlaceholder', 'shopifyLogo')} style={{ background: 'white' }}></div>
                <span className={getClasses('title', 'slackText')} style={{ color: 'white' }}>{data.from.name}</span>
              </div>
              <div className={getClasses('invoiceBadge', 'invoiceLabel')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>OVERDUE</div>
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')} style={{ color: 'white' }}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')} style={{ color: 'rgba(255,255,255,0.9)' }}>Due: {data.dueDate}</div>
            </div>
          </div>

          <div style={{ padding: '24px', background: `linear-gradient(135deg, ${overdueBg} 0%, #fee2e2 100%)`, borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: overdueColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px' }}>&#128680;</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '18px', color: overdueColor }}>OVERDUE: PLEASE PAY IMMEDIATELY</div>
                <div style={{ color: '#991b1b', fontSize: '14px' }}>This invoice was due on {data.dueDate}. Late payment fees may now apply. Please remit payment as soon as possible.</div>
              </div>
            </div>
          </div>

          <div className={getClasses('metaGrid', 'detailsGrid', 'metadata')}>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Invoice Date</label>
              <span>{data.issuedDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Due Date</label>
              <span style={{ color: overdueColor, fontWeight: '700' }}>{data.dueDate} (OVERDUE)</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Amount Due</label>
              <span style={{ fontWeight: '700', color: overdueColor }}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Status</label>
              <span className={getClasses('statusBadge', 'statusPill')} style={{ background: overdueColor, color: 'white' }}>OVERDUE</span>
            </div>
          </div>

          <div className={styleClass.content}>
            <div className={getClasses('addressSection', 'addressGrid', 'addresses', 'customerSection')}>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>Bill To</h3>
                <div className={getClasses('company', 'name')}>{data.to.name}</div>
                <div>{data.to.company}</div>
                <div>{data.to.email}</div>
              </div>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>From</h3>
                <div className={getClasses('company', 'name')}>{data.from.name}</div>
                <div>{data.from.email}</div>
              </div>
            </div>

            <div className={getClasses('tableSection', 'tableContainer', 'itemsSection', 'lineItemsHeader')}>
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Overdue Items</h2>
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
              <div className={getClasses('grandTotal', 'grandTotalRow')} style={{ background: overdueColor }}>
                <span>Total Due (OVERDUE)</span>
                <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {data.notes && (
              <div style={{ padding: '16px', background: overdueBg, borderRadius: '8px', border: `1px solid ${overdueBorder}` }}>
                <h4 style={{ margin: '0 0 8px 0', color: overdueColor }}>Important Notice</h4>
                <p style={{ margin: 0, color: '#7f1d1d' }}>{data.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styleClass.container} style={{ border: `4px solid ${overdueColor}` }}>
      <header className={styleClass.header} style={{ borderBottom: `2px solid ${overdueColor}` }}>
        <div className={styleClass.title} style={{ color: overdueColor }}>{data.from.name}</div>
        <div className={getClasses('subtitle', 'subHeader')} style={{ color: overdueColor, fontWeight: '700' }}>PAST DUE INVOICE</div>
      </header>

      <div style={{
        backgroundColor: overdueColor,
        color: 'white',
        padding: '16px',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '24px' }}>&#128680;</span>
        OVERDUE: PLEASE PAY IMMEDIATELY
      </div>

      <div style={{ padding: '16px', background: overdueBg, borderRadius: '8px', marginBottom: '24px', border: `1px solid ${overdueBorder}` }}>
        <div style={{ color: overdueColor, fontWeight: '600', marginBottom: '8px' }}>Payment Notice</div>
        <div style={{ color: '#991b1b', fontSize: '14px' }}>This invoice was due on {data.dueDate}. Late payment fees may apply. Please remit payment as soon as possible.</div>
      </div>

      <div className={getClasses('metaGrid', 'metaSection', 'detailsGrid', 'meta')}>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Invoice No</label>
          <span className={getClasses('metaValue')}>{data.invoiceNumber}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Due Date</label>
          <span className={getClasses('metaValue')} style={{ color: overdueColor, fontWeight: '700' }}>{data.dueDate} (OVERDUE)</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Amount Due</label>
          <span className={getClasses('metaValue')} style={{ color: overdueColor, fontWeight: '700', fontSize: '1.2em' }}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className={getClasses('addressSection', 'addressGrid', 'addresses')}>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>Bill To</h3>
          <div>{data.to.name}</div>
          <div>{data.to.company}</div>
          <div>{data.to.email}</div>
        </div>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>From</h3>
          <div>{data.from.name}</div>
          <div>{data.from.email}</div>
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
          <span>Subtotal</span>
          <span>${data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {data.tax && (
          <div className={styleClass.totalRow}>
            <span>Tax</span>
            <span>${data.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className={`${styleClass.totalRow} ${getClasses('final', 'grandTotal')}`} style={{ background: overdueColor, color: 'white' }}>
          <span>Total Due (OVERDUE)</span>
          <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {data.notes && (
        <div style={{ padding: '16px', background: overdueBg, borderRadius: '8px', marginTop: '16px', border: `1px solid ${overdueBorder}` }}>
          {data.notes}
        </div>
      )}
    </div>
  );
};

export default PastDueInvoice;
