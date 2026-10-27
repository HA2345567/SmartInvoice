import React from 'react';
import { InvoiceData } from '../../types';

interface RecurringInvoiceProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const RecurringInvoice: React.FC<RecurringInvoiceProps> = ({ data, styleClass }) => {
  const getClasses = (...keys: string[]): string => {
    return keys
      .map(key => styleClass[key])
      .filter(Boolean)
      .join(' ');
  };

  const hasPageLayout = !!styleClass.page;
  const hasCoverImage = !!styleClass.coverImage;
  const hasInvoiceCard = !!styleClass.invoiceCard;

  const subscription = data.recurring;

  if (hasCoverImage) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.coverImage}>
          <div className={styleClass.coverGradient}></div>
        </div>
        <div className={styleClass.pageContent}>
          <div className={styleClass.pageIcon}>
            <span>&#128257;</span>
          </div>
          <h1 className={styleClass.title}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle}>Recurring Invoice</p>

          <div className={styleClass.metadata}>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Period</span>
              <span className={styleClass.metaValue}>{subscription?.subscriptionPeriod || 'Monthly'}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Next Billing</span>
              <span className={styleClass.metaValue}>{subscription?.nextBillingDate || data.dueDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Amount</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Subscription</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagSENT}`}>Active</span>
              </span>
            </div>
          </div>

          {subscription && (
            <div className={styleClass.calloutBlock}>
              <div className={styleClass.calloutIcon}>
                <span>&#128257;</span>
              </div>
              <div className={styleClass.calloutContent}>
                <h3>Subscription Details</h3>
                <p>{subscription.subscriptionDetails || 'Your subscription will automatically renew.'}</p>
              </div>
            </div>
          )}

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
              Subscription Items
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
              <span>This Period</span>
              <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.commentsIndicator}>
              <span className={styleClass.commentsIcon}>&#128257;</span>
              <span>Next: {subscription?.nextBillingDate || data.dueDate}</span>
            </div>
            <div className={styleClass.breadcrumbs}>
              <span className={styleClass.breadcrumb}>Subscriptions</span>
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
              <h3 className={styleClass.title}>Recurring Invoice</h3>
              <div className={styleClass.invoiceNumber}>{data.invoiceNumber}</div>
              <div className={styleClass.orderTag} style={{ background: '#e0e7ff', color: '#3730a3' }}>
                <span>&#128257;</span> {subscription?.subscriptionPeriod || 'Monthly'}
              </div>
            </div>
          </div>

          {subscription && (
            <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>Subscription Period</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{subscription.subscriptionDetails || 'Auto-renews monthly'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: '#4f46e5' }}>Next Billing</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{subscription.nextBillingDate}</div>
                </div>
              </div>
            </div>
          )}

          <div className={styleClass.customerSection}>
            <div className={styleClass.customerBlock}>
              <h3>Bill To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.company}</div>
              <div>{data.to.email}</div>
            </div>
            <div className={styleClass.customerBlock}>
              <h3>Billing Cycle</h3>
              <div className={styleClass.name}>{subscription?.subscriptionPeriod || 'Monthly'}</div>
              <div className={styleClass.statusPill} style={{ background: '#e0e7ff', color: '#3730a3' }}>Active</div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Subscription Items</h2>
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
                <span>This Period</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.paymentSection}>
            <div className={styleClass.paymentInfo}>
              <div className={styleClass.paymentIcon}>&#128257;</div>
              <div className={styleClass.paymentDetails}>
                <h4>Auto-Pay Active</h4>
                <span>Next charge: {subscription?.nextBillingDate || data.dueDate}</span>
              </div>
            </div>
            <button className={styleClass.payNowBtn} style={{ background: '#4f46e5' }}>
              <span>&#128257;</span> Manage Plan
            </button>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink}>Subscription</a>
                <a href="#" className={styleClass.footerLink}>Billing History</a>
                <a href="#" className={styleClass.footerLink}>Cancel</a>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <span>Auto-renews on {subscription?.nextBillingDate || data.dueDate}</span>
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
              <div className={getClasses('invoiceBadge', 'invoiceLabel')} style={{ background: '#4f46e5', color: 'white' }}>RECURRING</div>
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')}>{subscription?.subscriptionPeriod || 'Monthly'} Billing</div>
            </div>
          </div>

          {subscription && (
            <div style={{ display: 'flex', gap: '16px', padding: '20px', background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', background: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>&#128257;</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Subscription Active</div>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>{subscription.subscriptionDetails || 'Your subscription automatically renews each billing period.'}</div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Period</div>
                    <div style={{ fontWeight: '600' }}>{subscription.subscriptionPeriod}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Billing</div>
                    <div style={{ fontWeight: '600' }}>{subscription.nextBillingDate}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={getClasses('metaGrid', 'detailsGrid', 'metadata')}>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Invoice Date</label>
              <span>{data.issuedDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Due Date</label>
              <span>{data.dueDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Amount</label>
              <span style={{ fontWeight: '700' }}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Status</label>
              <span className={getClasses('statusBadge', 'statusPill')} style={{ background: '#4f46e5', color: 'white' }}>Active</span>
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
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Subscription Items</h2>
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
                <span>This Period</span>
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
        <div className={getClasses('subtitle', 'subHeader')}>RECURRING INVOICE</div>
      </header>

      {subscription && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Period</div>
            <div style={{ fontWeight: '600' }}>{subscription.subscriptionPeriod}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Next Billing</div>
            <div style={{ fontWeight: '600' }}>{subscription.nextBillingDate}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Active</span>
          </div>
        </div>
      )}

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
        <div className={`${styleClass.totalRow} ${getClasses('final', 'grandTotal')}`}>
          <span>Total This Period</span>
          <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default RecurringInvoice;
