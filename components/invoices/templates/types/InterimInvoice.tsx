import React from 'react';
import { InvoiceData } from '../../types';

interface InterimInvoiceProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const InterimInvoice: React.FC<InterimInvoiceProps> = ({ data, styleClass }) => {
  const getClasses = (...keys: string[]): string => {
    return keys
      .map(key => styleClass[key])
      .filter(Boolean)
      .join(' ');
  };

  const hasPageLayout = !!styleClass.page;
  const hasCoverImage = !!styleClass.coverImage;
  const hasInvoiceCard = !!styleClass.invoiceCard;

  const projectInfo = data.interim;
  const percentComplete = projectInfo?.percentComplete || 0;
  const invoicedToDate = projectInfo?.invoicedToDate || 0;
  const totalProject = projectInfo?.totalProject || data.total;

  if (hasCoverImage) {
    return (
      <div className={styleClass.container}>
        <div className={styleClass.coverImage}>
          <div className={styleClass.coverGradient}></div>
        </div>
        <div className={styleClass.pageContent}>
          <div className={styleClass.pageIcon}>
            <span>&#128200;</span>
          </div>
          <h1 className={styleClass.title}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle}>Interim Invoice{projectInfo && ` - ${projectInfo.projectName}`}</p>

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
              <span className={styleClass.metaLabel}>This Invoice</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Progress</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagSENT}`}>{percentComplete}%</span>
              </span>
            </div>
          </div>

          {projectInfo && (
            <div className={styleClass.calloutBlock}>
              <div className={styleClass.calloutIcon}>
                <span>&#128200;</span>
              </div>
              <div className={styleClass.calloutContent}>
                <h3>Project Progress</h3>
                <p>Current milestone: {projectInfo.milestone}. Total invoiced to date: ${invoicedToDate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          )}

          {projectInfo && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#787774' }}>
                <span>Milestone Progress</span>
                <span>{percentComplete}% Complete</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e3e2de', height: '8px', borderRadius: '4px' }}>
                <div style={{
                  width: `${percentComplete}%`,
                  backgroundColor: '#0f7b6c',
                  height: '100%',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}></div>
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
              Milestone Items
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
              <span>This Invoice</span>
              <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.commentsIndicator}>
              <span className={styleClass.commentsIcon}>&#128483;</span>
              <span>Invoiced to Date: ${invoicedToDate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styleClass.breadcrumbs}>
              <span className={styleClass.breadcrumb}>{projectInfo?.projectName || 'Project'}</span>
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
              <h3 className={styleClass.title}>Interim Invoice</h3>
              <div className={styleClass.invoiceNumber}>{data.invoiceNumber}</div>
              <div className={styleClass.orderTag}>
                <span>&#128200;</span>
                {projectInfo?.milestone || 'Milestone'}
              </div>
            </div>
          </div>

          {projectInfo && (
            <div style={{ padding: '16px', borderBottom: '1px solid #e1e3e5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{projectInfo.projectName}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{projectInfo.milestone}</div>
                </div>
                <div className={styleClass.statusPill}>{percentComplete}%</div>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e1e3e5', height: '6px', borderRadius: '3px' }}>
                <div style={{
                  width: `${percentComplete}%`,
                  backgroundColor: '#95bf47',
                  height: '100%',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>
          )}

          <div className={styleClass.customerSection}>
            <div className={styleClass.customerBlock}>
              <h3>Bill To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.email}</div>
            </div>
            <div className={styleClass.customerBlock}>
              <h3>Due Date</h3>
              <div className={styleClass.name}>{data.dueDate}</div>
              <div className={styleClass.statusPill}>Pending</div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Milestone Items</h2>
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
                <div className={styleClass.summaryRow} style={{ borderTop: '1px dashed #d1d5db', paddingTop: '8px' }}>
                  <span>Total Project</span>
                  <span>${totalProject.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className={styleClass.summaryRow}>
                  <span>Invoiced to Date</span>
                  <span>${invoicedToDate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className={styleClass.grandTotal}>
                <span>This Invoice</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink}>Project Details</a>
                <a href="#" className={styleClass.footerLink}>All Invoices</a>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <span>Progress: {percentComplete}% complete</span>
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
              <div className={getClasses('invoiceBadge', 'invoiceLabel')}>INTERIM INVOICE</div>
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')}>{projectInfo?.milestone || 'Milestone'}</div>
            </div>
          </div>

          {projectInfo && (
            <div className={getClasses('metaGrid', 'detailsGrid', 'metadata')} style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', marginBottom: '24px', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '18px' }}>{projectInfo.projectName}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>{projectInfo.milestone}</div>
                </div>
                <div className={getClasses('statusBadge', 'statusPill')} style={{ background: '#0f7b6c', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' }}>
                  {percentComplete}% Complete
                </div>
              </div>
              <div style={{ width: '100%', backgroundColor: '#d1d5db', height: '8px', borderRadius: '4px' }}>
                <div style={{
                  width: `${percentComplete}%`,
                  background: 'linear-gradient(90deg, #0f7b6c 0%, #10b981 100%)',
                  height: '100%',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          )}

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
              <label>This Invoice</label>
              <span style={{ fontWeight: '700' }}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Project Total</label>
              <span>${totalProject.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className={styleClass.content}>
            <div className={getClasses('addressSection', 'addressGrid', 'addresses', 'customerSection')}>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>Bill To</h3>
                <div className={getClasses('company', 'name')}>{data.to.name}</div>
                <div>{data.to.email}</div>
              </div>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>From</h3>
                <div className={getClasses('company', 'name')}>{data.from.name}</div>
                <div>{data.from.email}</div>
              </div>
            </div>

            <div className={getClasses('tableSection', 'tableContainer', 'itemsSection', 'lineItemsHeader')}>
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Milestone Items</h2>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: '#6b7280', borderTop: '1px dashed #e5e7eb', marginTop: '8px' }}>
                <span>Invoiced to Date</span>
                <span>${invoicedToDate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={getClasses('grandTotal', 'grandTotalRow')}>
                <span>This Invoice</span>
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
        <div className={getClasses('subtitle', 'subHeader')}>INTERIM INVOICE</div>
      </header>

      {projectInfo && (
        <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>{projectInfo.projectName}</h4>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{projectInfo.milestone}</p>
            </div>
            <span style={{ background: '#0078D4', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600' }}>
              {percentComplete}%
            </span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px' }}>
            <div style={{
              width: `${percentComplete}%`,
              backgroundColor: '#0078D4',
              height: '100%',
              borderRadius: '4px'
            }}></div>
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
          <span>This Milestone</span>
          <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default InterimInvoice;
