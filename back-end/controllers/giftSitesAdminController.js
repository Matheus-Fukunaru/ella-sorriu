const { getGiftSiteById, listGiftSites, releaseGiftSite } = require('../models/giftSitesModel');
const { recordAudit } = require('../models/auditLogModel');

function giftSitesPage(req, res) {
  res.render('gift-sites-admin', {
    admin: req.admin,
    activeSection: 'gift-sites',
    csrfToken: req.cookies.csrf_token,
    sites: listGiftSites(),
    released: req.query.released === '1'
  });
}

function releaseSite(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).send('Dados inválidos.');
  const site = getGiftSiteById(id);
  if (!site) return res.status(404).send('Site-presente não encontrado.');
  releaseGiftSite(id);
  recordAudit({ actorAdminId: req.admin.id, action: 'gift_site_released_after_payment', targetType: 'gift_site', targetId: id, details: site.slug });
  return res.redirect('/admin/gift-sites?released=1');
}

module.exports = { giftSitesPage, releaseSite };
