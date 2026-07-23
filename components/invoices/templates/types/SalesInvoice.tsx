import React from 'react';
import { InvoiceData } from '../../types';

interface SalesInvoiceProps {
  data: InvoiceData;
  styleClass: { readonly [key: string]: string };
}

const SalesInvoice: React.FC<SalesInvoiceProps> = ({ data, styleClass }) => {
  // Normalize style classes to handle all design style variations
  const getClasses = (...keys: string[]): string => {
    return keys
      .map(key => styleClass[key])
      .filter(Boolean)
      .join(' ');
  };

  // Check if this is a premium "page" style (Stripe, Slack, etc.)
  const hasPageLayout = !!styleClass.page;
  // Check if this is a notion-style document layout
  const hasCoverImage = !!styleClass.coverImage;
  // Check if this is a Salesforce-style layout
  const hasAccountsBar = !!styleClass.accountsBar;
  // Check if this is a Shopify-style invoice card
  const hasInvoiceCard = !!styleClass.invoiceCard;

  // Render different layouts based on available CSS classes
  if (hasCoverImage) {
    // Notion-style document layout
    return (
      <div className={styleClass.container}>
        <div className={styleClass.coverImage}>
          <div className={styleClass.coverGradient}></div>
        </div>
        <div className={styleClass.pageContent}>
          <div className={styleClass.pageIcon}>
            <span>&#128196;</span>
          </div>
          <h1 className={styleClass.title}>{data.invoiceNumber}</h1>
          <p className={styleClass.subtitle}>Invoice</p>

          <div className={styleClass.metadata}>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Date</span>
              <span className={styleClass.metaValue}>{data.issuedDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Due</span>
              <span className={styleClass.metaValue}>{data.dueDate}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Total</span>
              <span className={`${styleClass.metaValue} ${styleClass.highlight || ''}`}>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styleClass.metaGroup}>
              <span className={styleClass.metaLabel}>Status</span>
              <span className={styleClass.tagsSection}>
                <span className={`${styleClass.tag} ${styleClass.tagSENT}`}>Unpaid</span>
              </span>
            </div>
          </div>

          <div className={styleClass.calloutBlock}>
            <div className={styleClass.calloutIcon}>
              <span>&#128161;</span>
            </div>
            <div className={styleClass.calloutContent}>
              <h3>Payment Instructions</h3>
              <p>Please remit payment by the due date. Net 30 payment terms apply.</p>
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
              <div className={styleClass.name}>{data?.from?.name}</div>
              <div>{data?.from?.address}</div>
              <div>{data?.from?.city}</div>
              {data?.from?.email && <div>{data.from.email}</div>}
            </div>
          </div>

          <div className={getClasses('divider')}></div>

          <div className={styleClass.tableSection}>
            <div className={styleClass.tableTitle}>
              <span className={styleClass.tableTitleIcon}>&#128203;</span>
              Line Items
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
              <span>Total Due</span>
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
              <span className={styleClass.breadcrumb}>Invoices</span>
              <span className={styleClass.breadcrumb}>{data.invoiceNumber}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasInvoiceCard) {
    // Shopify-style card layout
    return (
      <div className={styleClass.container}>
        <div className={styleClass.invoiceCard}>
          <div className={styleClass.header}>
            <div className={styleClass.shopifyBrand}>
              <div className={styleClass.shopifyLogo}>S</div>
              <span className={styleClass.shopifyText}>Shopify</span>
            </div>
            <div className={styleClass.invoiceMeta}>
              <h3 className={styleClass.title}>Invoice</h3>
              <div className={styleClass.invoiceNumber}>{data.invoiceNumber}</div>
              <div className={styleClass.orderTag}>
                <span>&#128230;</span>
                Order #{data.invoiceNumber.split('-').pop()}
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
              <h3>Ship To</h3>
              <div className={styleClass.name}>{data.to.name}</div>
              <div>{data.to.address}</div>
              <div>{data.to.city}</div>
            </div>
            <div className={styleClass.customerBlock}>
              <h3>Payment Due</h3>
              <div className={styleClass.name}>{data.dueDate}</div>
              <div className={styleClass.statusPill}>
                <span>&#10003;</span> Unpaid
              </div>
            </div>
          </div>

          <div className={styleClass.itemsSection}>
            <div className={styleClass.sectionHeader}>
              <h2>Line Items</h2>
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
                <span>Total</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styleClass.paymentSection}>
            <div className={styleClass.paymentInfo}>
              <div className={styleClass.paymentIcon}>&#128179;</div>
              <div className={styleClass.paymentDetails}>
                <h4>Payment Method</h4>
                <span>Due by {data.dueDate}</span>
              </div>
            </div>
            <button className={styleClass.payNowBtn}>
              <span>&#10003;</span> Pay Now
            </button>
          </div>

          <div className={styleClass.footer}>
            <div className={styleClass.footerContent}>
              <div className={styleClass.footerLinks}>
                <a href="#" className={styleClass.footerLink}>Terms</a>
                <a href="#" className={styleClass.footerLink}>Privacy</a>
                <a href="#" className={styleClass.footerLink}>Contact</a>
              </div>
              <div className={styleClass.socialProof}>
                <span className={styleClass.starRating}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span>4.9/5</span>
              </div>
            </div>
            <div className={styleClass.poweredBy}>
              <div className={styleClass.poweredByIcon}></div>
              <span>Powered by Shopify</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasPageLayout) {
    // Stripe/Slack-style page layout
    return (
      <div className={styleClass.container}>
        <div className={styleClass.page}>
          <div className={styleClass.header}>
            <div className={getClasses('brandHeader', 'sfdcHeader', 'shopifyBrand', 'slackLogo')}>
              <div className={styleClass.logoArea}>
                <div className={getClasses('logoPlaceholder', 'shopifyLogo', 'sfdcLogo')}></div>
                <span className={getClasses('title', 'slackText', 'shopifyText')}>{data?.from?.name}</span>
              </div>
              {(styleClass.invoiceBadge || styleClass.invoiceLabel) && (
                <div className={getClasses('invoiceBadge', 'invoiceLabel')}>INVOICE</div>
              )}
            </div>
            <div className={getClasses('headerRight', 'invoiceMeta', 'workspaceInfo')}>
              <h1 className={getClasses('title', 'invoiceNumber')}>{data.invoiceNumber}</h1>
              <div className={getClasses('subtitle', 'orderTag')}>Issued: {data.issuedDate}</div>
            </div>
          </div>

          <div className={getClasses('metaGrid', 'detailsGrid', 'channelsSection', 'metadata')}>
            <div className={getClasses('metaItem', 'metaGroup', 'metaGroup', 'detailsCol')}>
              <label>Invoice Date</label>
              <span>{data.issuedDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Due Date</label>
              <span>{data.dueDate}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Amount</label>
              <span style={{ fontWeight: '700' }}>${(data.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
              <label>Status</label>
              <span className={getClasses('statusBadge', 'statusPill', 'statusDraft')}>Draft</span>
            </div>
          </div>

          <div className={styleClass.content}>
            <div className={getClasses('addressSection', 'addressGrid', 'addresses', 'customerSection')}>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>Bill To</h3>
                <div className={getClasses('company', 'name')}>{data?.to?.name}</div>
                <div>{data?.to?.company}</div>
                <div>{data?.to?.address}</div>
                <div>{data?.to?.city}</div>
                {data?.to?.email && <div>{data.to.email}</div>}
              </div>
              <div className={getClasses('addressBlock', 'addressBox', 'addressCol', 'customerBlock')}>
                <h3>From</h3>
                <div className={getClasses('company', 'name')}>{data?.from?.name}</div>
                <div>{data?.from?.address}</div>
                <div>{data?.from?.city}</div>
                {data?.from?.email && <div>{data.from.email}</div>}
              </div>
            </div>

            <div className={getClasses('tableSection', 'tableContainer', 'itemsSection', 'lineItemsHeader')}>
              <h2 className={getClasses('sectionTitle', 'lineItemsHeader')}>Line Items</h2>
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

            <div className={getClasses('totals', 'totals', 'summarySection', 'financialSummary', 'summaryPanel', 'summaryCard')}>
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
                <span>Total</span>
                <span>${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {data.notes && (
              <div className={getClasses('notes', 'footer', 'toggleContent')}>
                <h4 style={{ marginBottom: '8px', fontWeight: '600' }}>Notes</h4>
                {data.notes}
              </div>
            )}
          </div>

          {(styleClass.paymentSection || styleClass.paymentActions) && (
            <div className={getClasses('paymentSection', 'footer')}>
              <div className={getClasses('paymentInfo', 'paymentDetails')}>
                <h4>Payment</h4>
                <p>Due by {data.dueDate}</p>
              </div>
              <div className={styleClass.payButton}>
                <span>&#128179;</span> Pay Now
              </div>
            </div>
          )}

          {(styleClass.footerLinks || styleClass.footerContent) && (
            <div className={styleClass.footer}>
              <div className={getClasses('footerContent', 'footerLinks')}>
                <div className={styleClass.footerLinks}>
                  <a href="#" className={styleClass.footerLink}>Terms of Service</a>
                  <a href="#" className={styleClass.footerLink}>Privacy Policy</a>
                  <a href="#" className={styleClass.footerLink}>Contact Support</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Salesforce/Financial-style layout
  return (
    <div className={styleClass.container}>
      <header className={styleClass.header}>
        <div className={styleClass.title}>{data?.from?.name || 'Company Name'}</div>
        <div className={getClasses('subtitle', 'subHeader', 'subHeader')}>INVOICE</div>
      </header>

      <div className={getClasses('metaGrid', 'metaSection', 'detailsGrid', 'meta')}>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Invoice No</label>
          <span className={getClasses('metaValue')}>{data?.invoiceNumber}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Date</label>
          <span className={getClasses('metaValue')}>{data?.issuedDate}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Due Date</label>
          <span className={getClasses('metaValue')}>{data?.dueDate}</span>
        </div>
        <div className={getClasses('metaItem', 'metaGroup', 'detailsCol')}>
          <label className={getClasses('metaLabel')}>Total Due</label>
          <span className={getClasses('metaValue')}>${(data?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className={getClasses('addressSection', 'addressGrid', 'addresses')}>
        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>Bill To</h3>
          <div>{data?.to?.name}</div>
          <div>{data?.to?.company}</div>
          <div>{data?.to?.address}</div>
          <div>{data?.to?.city}</div>
          <div>{data?.to?.email}</div>
        </div>

        <div className={getClasses('addressBlock', 'addressBox', 'addressCol')}>
          <h3>From</h3>
          <div>{data?.from?.name}</div>
          <div>{data?.from?.address}</div>
          <div>{data?.from?.city}</div>
          <div>{data?.from?.email}</div>
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
          <span>Total</span>
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

export default SalesInvoice;
