import React from 'react';
import { InvoiceData } from '../../types';

interface FinalInvoiceProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const FinalInvoice: React.FC<FinalInvoiceProps> = ({ data, styleClass }) => {
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
            <span>&#9989;</span>
          </div>
          <h1 className={styleClass.title}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle}>Final Invoice</p>

          <div className={styleClass.metadata}>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Date</span>
              <span className={styleClass.metaValue}>{data.issuedDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Due Date</span>
              <span className={styleClass.metaValue}>{data.dueDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Total Due</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Status</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagPAID}`}>Final</span>
              </span>
            </div>
          </div>

          <div className={styleClass.calloutBlock}>
            <div className={styleClass.calloutIcon}>
              <span>&#9989;</span>
            </div>
            <div className={styleClass.calloutContent}>
              <h3>Project Completion</h3>
              <p>All milestones have been delivered and approved. This is the final invoice for this project.</p>
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
              Final Items
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
            <div className={styleClass.grandTotal}>
              <span>Final Balance</span>
              <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {data.notes && (
            <div className={getClasses('toggleSection', 'notes')}>
              <div className={styleClass.toggleHeader}>
                <span className={styleClass.toggleIcon}>&#128172;</span>
                <span className={styleClass.toggleText}>Project Notes</span>
              </div>
              <div className={styleClass.toggleContent}>{data.notes}</div>
            </div>
          )}

          <div className={styleClass.footer}>
            <div className={styleClass.commentsIndicator}>
              <span className={styleClass.commentsIcon}>&#9989;</span>
              <span>Project Complete</span>
            </div>
            <div className={styleClass.breadcrumbs}>
              <span className={styleClass.breadcrumb}>Final Invoices</span>
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
              <div className={styleClass.shopifyLogo}>{data.from.name.charAt(0)}</div>
              <span className={styleClass.shopifyText}>{data.from.name}</span>
            </div>
            <div className={styleClass.invoiceMeta}>
              <h3 className={styleClass.title}>Final Invoice</h3>
              <div className={styleClass.invoiceNumber}>{data.invoiceNumber}</div>
              <div className={styleClass.orderTag} style={{ background: '#dcfce7', color: '#166534' }}>
                <span>&#9989;</span> Project Complete
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#dcfce7', borderBottom: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>&#9989;</div>
              <div>
                <div style={{ fontWeight: '600', color: '#166534' }}>All Milestones Completed</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>Final invoice for this project</div>
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
              <h3>Payment Due</h3>
              <div className={styleClass.name}>{data.dueDate}</div>
              <div className={styleClass.statusPill} style={{ background: '#fef3c7', color: '#92400e' }}>Final Payment</div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Final Items</h2>
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
              <div className={styleClass.grandTotal}>
                <span>Final Balance</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.paymentSection}>
            <div className={styleClass.paymentInfo}>
              <div className={styleClass.paymentIcon}>&#128179;</div>
              <div className={styleClass.paymentDetails}>
                <h4>Final Payment</h4>
                <span>Due by {data.dueDate}</span>
              </div>
            </div>
            <button className={styleClass.payNowBtn}>
              <span>&#9989;</span> Pay Final Balance
            </button>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink}>All Invoices</a>
                <a href="#" className={styleClass.footerLink}>Receipt</a>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <span>Thank you for your business!</span>
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
              <div className={getClasses('invoiceBadge', 'invoiceLabel')} style={{ background: '#0f7b6c', color: 'white' }}>FINAL INVOICE</div>
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')}>Project Completion</div>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#0f7b6c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>&#9989;</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '18px', color: '#166534' }}>All Milestones Delivered</div>
                <div style={{ color: '#15803d', fontSize: '14px' }}>This is the final invoice for this project. All deliverables have been completed and approved.</div>
              </div>
            </div>
          </div>

          <div className={getClasses('metaGrid', 'detailsGrid', 'metadata')}>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Date</label>
              <span>{data.issuedDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Due Date</label>
              <span>{data.dueDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Final Balance</label>
              <span style={{ fontWeight: '700' }}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Status</label>
              <span className={getClasses('statusBadge', 'statusPill')} style={{ background: '#0f7b6c', color: 'white' }}>Final</span>
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
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Final Items</h2>
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
                <span>Final Balance</span>
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
        <div className={getClasses('subtitle', 'subHeader')}>FINAL INVOICE</div>
      </header>

      <div style={{ marginBottom: '24px', padding: '16px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>&#9989;</span>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: '#166534' }}>Project Completion Summary</h4>
            <p style={{ margin: 0, color: '#15803d', fontSize: '14px' }}>All milestones have been delivered and approved.</p>
          </div>
        </div>
      </div>

      <div className={getClasses('metaGrid', 'metaSection', 'detailsGrid', 'meta')}>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Invoice No</label>
          <span className={getClasses('metaValue')}>{data.invoiceNumber}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Date</label>
          <span className={getClasses('metaValue')}>{data.issuedDate}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Due Date</label>
          <span className={getClasses('metaValue')}>{data.dueDate}</span>
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
          <span>Subtotal</span>
          <span>${data.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {data.tax && (
          <div className={styleClass.totalRow}>
            <span>Tax</span>
            <span>${data.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className={`${styleClass.totalRow} ${getClasses('final', 'grandTotal')}`}>
          <span>Final Balance</span>
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

export default FinalInvoice;
