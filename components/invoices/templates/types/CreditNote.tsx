import React from 'react';
import { InvoiceData } from '../../types';

interface CreditNoteProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const CreditNote: React.FC<CreditNoteProps> = ({ data, styleClass }) => {
  const getClasses = (...keys: string[]): string => {
    return keys
      .map(key => styleClass[key])
      .filter(Boolean)
      .join(' ');
  };

  const hasPageLayout = !!styleClass.page;
  const hasCoverImage = !!styleClass.coverImage;
  const hasInvoiceCard = !!styleClass.invoiceCard;

  const referencedInvoice = data.invoiceNumber.replace('CN', 'INV');

  if (hasCoverImage) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.coverImage}>
          <div className={styleClass.coverGradient} style={{
            background: `linear-gradient(90deg, #fee2e2 0%, transparent 30%),
                        linear-gradient(180deg, #fef3c7 0%, transparent 50%),
                        linear-gradient(270deg, #fecaca 0%, transparent 40%)`,
            opacity: 0.6
          }}></div>
        </div>
        <div className={styleClass.pageContent}>
          <div className={styleClass.pageIcon}>
            <span>&#128312;</span>
          </div>
          <h1 className={styleClass.title}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle}>Credit Note</p>

          <div className={styleClass.metadata}>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Date</span>
              <span className={styleClass.metaValue}>{data.issuedDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Reference</span>
              <span className={styleClass.metaValue}>#{referencedInvoice}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Credit Amount</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`} style={{ color: '#dc2626' }}>
                -${Math.abs(data.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Status</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagOVERDUE}`}>Credit</span>
              </span>
            </div>
          </div>

          <div className={styleClass.calloutBlock} style={{ background: 'rgba(220, 38, 38, 0.05)' }}>
            <div className={styleClass.calloutIcon}>
              <span>&#128312;</span>
            </div>
            <div className={styleClass.calloutContent}>
              <h3>Credit Issued</h3>
              <p>This credit note has been applied to your account. The credit will be reflected in your next invoice.</p>
            </div>
          </div>

          <div className={getClasses('addressSection', 'addresses')}>
            <div className={getClasses('addressBlock', 'addressCol')}>
              <h3>Credit To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.company}</div>
              <div>{data.to.email}</div>
            </div>
            <div className={getClasses('addressBlock', 'addressCol')}>
              <h3>Issued By</h3>
              <div className={styleClass.name}>{data.from.name}</div>
              <div>{data.from.email}</div>
            </div>
          </div>

          <div className={getClasses('divider')}></div>

          <div className={styleClass.tableSection}>
            <div className={styleClass.tableTitle}>
              <span className={styleClass.tableTitleIcon}>&#128203;</span>
              Credit Items
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
                      <td style={{ color: '#dc2626' }}>-${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td style={{ color: '#dc2626' }}>-${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styleClass.totalsSection}>
            <div className={styleClass.totalRow}>
              <span>Subtotal Credit</span>
              <span style={{ color: '#dc2626' }}>-${Math.abs(data.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            {data.tax && (
              <div className={`${styleClass.totalRow} ${styleClass.amount}`}>
                <span>Tax Credit</span>
                <span style={{ color: '#dc2626' }}>-${Math.abs(data.tax).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className={styleClass.grandTotal} style={{ background: '#dc2626' }}>
              <span>Total Credit</span>
              <span>-${Math.abs(data.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.commentsIndicator}>
              <span className={styleClass.commentsIcon}>&#128312;</span>
              <span>Credited to account</span>
            </div>
            <div className={styleClass.breadcrumbs}>
              <span className={styleClass.breadcrumb}>Credit Notes</span>
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
              <div className={styleClass.shopifyLogo} style={{ background: '#dc2626' }}>{data.from.name.charAt(0)}</div>
              <span className={styleClass.shopifyText}>{data.from.name}</span>
            </div>
            <div className={styleClass.invoiceMeta}>
              <h3 className={styleClass.title}>Credit Note</h3>
              <div className={styleClass.invoiceNumber}>{data.invoiceNumber}</div>
              <div className={styleClass.orderTag} style={{ background: '#fee2e2', color: '#991b1b' }}>
                <span>&#128312;</span> Ref: #{referencedInvoice}
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5', background: '#fef2f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px' }}>&#128312;</div>
              <div>
                <div style={{ fontWeight: '600', color: '#991b1b' }}>Credit Issued</div>
                <div style={{ fontSize: '12px', color: '#b91c1c' }}>This credit has been applied to your account</div>
              </div>
            </div>
          </div>

          <div className={styleClass.customerSection}>
            <div className={styleClass.customerBlock}>
              <h3>Credit To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.company}</div>
              <div>{data.to.email}</div>
            </div>
            <div className={styleClass.customerBlock}>
              <h3>Date</h3>
              <div className={styleClass.name}>{data.issuedDate}</div>
              <div className={styleClass.statusPill} style={{ background: '#fee2e2', color: '#991b1b' }}>Credit</div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Credit Items</h2>
              <span className={styleClass.itemCount}>{data.items.length} items</span>
            </div>

            <div className={styleClass.tableHeader}>
              <span>Description</span>
              <span style={{ textAlign: 'center' }}>Qty</span>
              <span style={{ color: '#dc2626' }}>Rate</span>
              <span style={{ textAlign: 'right', color: '#dc2626' }}>Credit</span>
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
                <div className={styleClass.unitPriceCell} style={{ color: '#dc2626' }}>-${item.rate.toFixed(2)}</div>
                <div className={styleClass.totalCell} style={{ color: '#dc2626' }}>-${Math.abs(item.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className={styleClass.financialSummary}>
            <div className={styleClass.summaryCard}>
              <div className={styleClass.summaryRows}>
                <div className={styleClass.summaryRow}>
                  <span>Subtotal Credit</span>
                  <span style={{ color: '#dc2626' }}>-${Math.abs(data.subtotal).toFixed(2)}</span>
                </div>
                {data.tax && (
                  <div className={styleClass.summaryRow}>
                    <span>Tax Credit</span>
                    <span style={{ color: '#dc2626' }}>-${Math.abs(data.tax).toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className={styleClass.grandTotal} style={{ background: '#dc2626' }}>
                <span>Total Credit</span>
                <span>-${Math.abs(data.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink}>Original Invoice</a>
                <a href="#" className={styleClass.footerLink}>Account Balance</a>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <span>Credited on {data.issuedDate}</span>
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
                <div className={getClasses('logoPlaceholder', 'shopifyLogo')} style={{ background: '#dc2626' }}></div>
                <span className={getClasses('title', 'slackText')}>{data.from.name}</span>
              </div>
              <div className={getClasses('invoiceBadge', 'invoiceLabel')} style={{ background: '#dc2626', color: 'white' }}>CREDIT NOTE</div>
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')}>Ref: #{referencedInvoice}</div>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px' }}>&#128312;</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '18px', color: '#991b1b' }}>Credit Issued</div>
                <div style={{ color: '#b91c1c', fontSize: '14px' }}>This credit has been applied to your account and will be reflected in future invoices.</div>
              </div>
            </div>
          </div>

          <div className={getClasses('metaGrid', 'detailsGrid', 'metadata')}>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Date</label>
              <span>{data.issuedDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Reference Invoice</label>
              <span>#{referencedInvoice}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Credit Amount</label>
              <span style={{ fontWeight: '700', color: '#dc2626' }}>-${Math.abs(data.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Status</label>
              <span className={getClasses('statusBadge', 'statusPill')} style={{ background: '#dc2626', color: 'white' }}>Credited</span>
            </div>
          </div>

          <div className={styleClass.content}>
            <div className={getClasses('addressSection', 'addressGrid', 'addresses', 'customerSection')}>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>Credit To</h3>
                <div className={getClasses('company', 'name')}>{data.to.name}</div>
                <div>{data.to.company}</div>
                <div>{data.to.email}</div>
              </div>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>Issued By</h3>
                <div className={getClasses('company', 'name')}>{data.from.name}</div>
                <div>{data.from.email}</div>
              </div>
            </div>

            <div className={getClasses('tableSection', 'tableContainer', 'itemsSection', 'lineItemsHeader')}>
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Credit Items</h2>
              <table className={styleClass.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Description</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right', color: '#dc2626' }}>Rate</th>
                    <th style={{ textAlign: 'right', color: '#dc2626' }}>Credit</th>
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
                      <td style={{ textAlign: 'right', color: '#dc2626' }}>
                        -${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right', color: '#dc2626' }}>
                        -${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={getClasses('totals', 'summarySection', 'financialSummary', 'summaryCard')}>
              <div className={getClasses('totalRow', 'summaryRow')}>
                <span>Subtotal Credit</span>
                <span style={{ color: '#dc2626' }}>-${Math.abs(data.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              {data.tax && (
                <div className={getClasses('totalRow', 'summaryRow', 'taxRow')}>
                  <span>Tax Credit</span>
                  <span style={{ color: '#dc2626' }}>-${Math.abs(data.tax).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className={getClasses('grandTotal', 'grandTotalRow')} style={{ background: '#dc2626' }}>
                <span>Total Credit</span>
                <span>-${Math.abs(data.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
        <div className={getClasses('subtitle', 'subHeader')} style={{ color: '#e74c3c' }}>CREDIT NOTE</div>
      </header>

      <div style={{
        padding: '16px',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fee2e2',
        marginBottom: '24px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>&#128312;</span>
        <span style={{ fontWeight: '500' }}>Credit note issued for invoice #{referencedInvoice}</span>
      </div>

      <div className={getClasses('metaGrid', 'metaSection', 'detailsGrid', 'meta')}>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Credit Note #</label>
          <span className={getClasses('metaValue')}>{data.invoiceNumber}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Date</label>
          <span className={getClasses('metaValue')}>{data.issuedDate}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Ref. Invoice</label>
          <span className={getClasses('metaValue')}>#{referencedInvoice}</span>
        </div>
      </div>

      <div className={getClasses('addressSection', 'addressGrid', 'addresses')}>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>Credit To</h3>
          <div>{data.to.name}</div>
          <div>{data.to.company}</div>
          <div>{data.to.email}</div>
        </div>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>Issued By</h3>
          <div>{data.from.name}</div>
          <div>{data.from.email}</div>
        </div>
      </div>

      <table className={styleClass.table}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th style={{ color: '#dc2626' }}>Rate</th>
            <th style={{ color: '#dc2626' }}>Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td>{item.description}</td>
              <td>{item.qty}</td>
              <td style={{ color: '#dc2626' }}>-${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#dc2626' }}>-${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styleClass.totals}>
        <div className={styleClass.totalRow}>
          <span>Subtotal Credit</span>
          <span style={{ color: '#dc2626' }}>-${Math.abs(data.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {data.tax && (
          <div className={styleClass.totalRow}>
            <span>Tax Credit</span>
            <span style={{ color: '#dc2626' }}>-${Math.abs(data.tax).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className={`${styleClass.totalRow} ${getClasses('final', 'grandTotal')}`} style={{ background: '#dc2626', color: 'white' }}>
          <span>Total Credit</span>
          <span>-${Math.abs(data.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditNote;
